import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import axios from 'axios';

const prisma = new PrismaClient();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

// Base64 encode API key and secret for basic auth
const razorpayAuth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
).toString('base64');

const razorpayXApi = axios.create({
    baseURL: 'https://api.razorpay.com/v1',
    headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json'
    }
});

export const createSettlement = async (req: Request, res: Response) => {
    try {
        const { subscriptionId, settlerId } = req.body;

        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { members: true, payer: true }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const amountPerMember = subscription.amount / (subscription.members.length + 1);

        // Create settlement record
        const settlement = await prisma.settlement.create({
            data: {
                subscriptionId,
                payerId: subscription.payerId!,
                settlerId,
                amount: amountPerMember,
                status: 'PENDING'
            }
        });

        // Create Razorpay payment link
        const paymentLink = await razorpay.paymentLink.create({
            amount: Math.round(amountPerMember * 100), // Convert to paise
            currency: 'INR',
            accept_partial: false,
            description: `Settlement for ${subscription.name}`,
            customer: {
                name: subscription.payer!.name,
                email: subscription.payer!.email
            },
            notify: {
                email: true,
                sms: true
            },
            reminder_enable: true,
            notes: {
                settlementId: settlement.id
            }
        });

        // Update settlement with payment link ID
        await prisma.settlement.update({
            where: { id: settlement.id },
            data: {
                paymentLinkId: paymentLink.id,
                status: 'PAYMENT_LINK_CREATED'
            }
        });

        res.json({ settlement, paymentLink });
    } catch (error) {
        console.error('Settlement creation error:', error);
        res.status(500).json({ error: 'Failed to create settlement' });
    }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
    try {
        const { payload } = req.body;
        const settlement = await prisma.settlement.findFirst({
            where: { paymentLinkId: payload.payment_link_id }
        });

        if (!settlement) {
            return res.status(404).json({ error: 'Settlement not found' });
        }

        if (payload.payment.status === 'paid') {
            // Update settlement status
            await prisma.settlement.update({
                where: { id: settlement.id },
                data: {
                    status: 'PAID',
                    paymentId: payload.payment.id
                }
            });

            // Initiate payout to the payer
            await initiatePayoutToPayer(settlement);
        }

        res.json({ status: 'success' });
    } catch (error) {
        console.error('Webhook handling error:', error);
        res.status(500).json({ error: 'Failed to process webhook' });
    }
};

async function initiatePayoutToPayer(settlement: any) {
    try {
        const payer = await prisma.user.findUnique({
            where: { id: settlement.payerId },
            include: { bankAccounts: { where: { isDefault: true } } }
        });

        if (!payer || !payer.bankAccounts[0]) {
            throw new Error('Payer bank account not found');
        }

        // Add beneficiary if not already added
        if (!settlement.beneficiaryId) {
            const { data: beneficiary } = await razorpayXApi.post('/contacts', {
                name: payer.name,
                email: payer.email,
                contact: payer.phone || '',
                type: 'vendor',
                notes: { role: 'payer' }
            });

            const { data: fundAccount } = await razorpayXApi.post('/fund_accounts', {
                contact_id: beneficiary.id,
                account_type: 'bank_account',
                bank_account: {
                    name: payer.bankAccounts[0].accountName,
                    account_number: payer.bankAccounts[0].accountNumber,
                    ifsc: payer.bankAccounts[0].ifscCode
                }
            });

            await prisma.settlement.update({
                where: { id: settlement.id },
                data: {
                    beneficiaryId: beneficiary.id,
                    fundAccountId: fundAccount.id
                }
            });

            settlement.beneficiaryId = beneficiary.id;
            settlement.fundAccountId = fundAccount.id;
        }

        // Initiate payout
        const { data: payout } = await razorpayXApi.post('/payouts', {
            account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
            fund_account_id: settlement.fundAccountId,
            amount: Math.round(settlement.amount * 100),
            currency: 'INR',
            mode: 'IMPS',
            purpose: 'payout',
            queue_if_low_balance: true,
            reference_id: `settlement_${settlement.id}`,
            narration: `Settlement for subscription payment`
        });

        await prisma.settlement.update({
            where: { id: settlement.id },
            data: {
                payoutId: payout.id,
                status: 'SETTLED'
            }
        });
    } catch (error) {
        console.error('Payout initiation error:', error);
        await prisma.settlement.update({
            where: { id: settlement.id },
            data: { status: 'FAILED' }
        });
        throw error;
    }
}