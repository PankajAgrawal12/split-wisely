import { razorpay } from "../config/razorpay";
import { prisma } from "../config/prisma";
import crypto from "crypto";
import { config } from "../config/env";

export class RazorpayService {
    static async createPlan(subscription: any) {
        const period = subscription.billingCycle === "MONTHLY" ? "monthly" : "yearly";

        const plan = await razorpay.plans.create({
            period,
            interval: 1,
            item: {
                name: subscription.name,
                amount: subscription.amount * 100,
                currency: subscription.currency
            }
        });

        return plan;
    }

    static async createSubscription(planId: string, totalCount: number) {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: totalCount,
            notify_info: {
                notify_phone: "1",
                notify_email: "1"
            }
        });

        return subscription;
    }

    static async verifyWebhookSignature(
        body: any,
        signature: string
    ): Promise<boolean> {
        if (!config.RAZORPAY_WEBHOOK_SECRET) {
            throw new Error("RAZORPAY_WEBHOOK_SECRET is not defined in environment variables");
        }

        const expectedSignature = crypto
            .createHmac("sha256", config.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(body))
            .digest("hex");

        return expectedSignature === signature;
    }

    static async handleWebhookEvent(event: any) {
        const { payload } = event;

        switch (event.event) {
            case "subscription.charged":
                await this.handleSuccessfulPayment(payload);
                break;
            case "payment.failed":
                await this.handleFailedPayment(payload);
                break;
            // Add more cases as needed
        }
    }

    private static async handleSuccessfulPayment(payload: any) {
        const { subscription_id, payment_id } = payload;

        await prisma.payment.updateMany({
            where: {
                razorpayOrderId: payment_id
            },
            data: {
                status: "PAID",
                paidAt: new Date(),
                razorpayPaymentId: payment_id
            }
        });
    }

    private static async handleFailedPayment(payload: any) {
        const { order_id, error_description } = payload;

        await prisma.payment.updateMany({
            where: {
                razorpayOrderId: order_id
            },
            data: {
                status: "OVERDUE",
                failureReason: error_description
            }
        });
    }
} 