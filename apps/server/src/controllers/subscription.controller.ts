import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import type {
    CreateSubscriptionInput,
    UpdateSubscriptionInput,
    InviteParticipantInput,
    RespondToInviteInput
} from "@split-wisely/validations";
import { CacheService } from "../services/cache.service";

export class SubscriptionController {
    static async create(req: Request<{}, {}, CreateSubscriptionInput>, res: Response) {
        try {
            const subscription = await prisma.subscription.create({
                data: {
                    ...req.body,
                    ownerId: req.user.id
                }
            });

            await CacheService.invalidateUserSubscriptions(req.user.id);
            return res.status(201).json(subscription);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const cached = await CacheService.getUserSubscriptions(req.user.id);
            if (cached) return res.status(200).json(cached);

            const subscriptions = await prisma.subscription.findMany({
                where: {
                    OR: [
                        { ownerId: req.user.id },
                        {
                            participants: {
                                some: {
                                    userId: req.user.id,
                                    status: "ACCEPTED"
                                }
                            }
                        }
                    ],
                    isActive: true
                },
                include: {
                    owner: {
                        select: { name: true, email: true }
                    },
                    participants: {
                        include: {
                            User: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                }
            });

            await CacheService.setUserSubscriptions(req.user.id, subscriptions);
            return res.status(200).json(subscriptions);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const subscription = await prisma.subscription.findFirst({
                where: {
                    id,
                    OR: [
                        { ownerId: req.user.id },
                        {
                            participants: {
                                some: {
                                    userId: req.user.id
                                }
                            }
                        }
                    ]
                },
                include: {
                    owner: {
                        select: { name: true, email: true }
                    },
                    participants: {
                        include: {
                            User: {
                                select: { name: true, email: true }
                            }
                        }
                    },
                    payments: true
                }
            });

            if (!subscription) {
                return res.status(404).json({ message: "Subscription not found" });
            }

            return res.status(200).json(subscription);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async update(
        req: Request<{ id: string }, {}, UpdateSubscriptionInput>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const subscription = await prisma.subscription.findFirst({
                where: {
                    id,
                    ownerId: req.user.id,
                    isActive: true
                }
            });

            if (!subscription) {
                return res.status(404).json({ message: "Subscription not found" });
            }

            const updated = await prisma.subscription.update({
                where: { id },
                data: req.body
            });

            await CacheService.invalidateUserSubscriptions(req.user.id);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const subscription = await prisma.subscription.findFirst({
                where: {
                    id,
                    ownerId: req.user.id,
                    isActive: true
                }
            });

            if (!subscription) {
                return res.status(404).json({ message: "Subscription not found" });
            }

            await prisma.subscription.update({
                where: { id },
                data: { isActive: false }
            });

            await CacheService.invalidateUserSubscriptions(req.user.id);
            return res.status(200).json({ message: "Subscription cancelled successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async invite(
        req: Request<{ id: string }, {}, InviteParticipantInput>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const { emails, shareAmount } = req.body;

            const subscription = await prisma.subscription.findFirst({
                where: {
                    id,
                    ownerId: req.user.id,
                    isActive: true
                }
            });

            if (!subscription) {
                return res.status(404).json({ message: "Subscription not found" });
            }

            const users = await prisma.user.findMany({
                where: {
                    email: { in: emails },
                    isActive: true
                }
            });

            const participants = await prisma.$transaction(
                users.map((user: { id: string }) =>
                    prisma.participant.create({
                        data: {
                            subscriptionId: id,
                            userId: user.id,
                            shareAmount: subscription.splitType === "CUSTOM" ? shareAmount : null
                        }
                    })
                )
            );

            return res.status(200).json(participants);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async respondToInvite(
        req: Request<{ id: string }, {}, RespondToInviteInput>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const { response } = req.body;

            const participant = await prisma.participant.findFirst({
                where: {
                    subscriptionId: id,
                    userId: req.user.id,
                    status: "PENDING"
                }
            });

            if (!participant) {
                return res.status(404).json({ message: "Invitation not found" });
            }

            const updated = await prisma.participant.update({
                where: { id: participant.id },
                data: { status: response }
            });

            await CacheService.invalidateUserSubscriptions(req.user.id);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
} 