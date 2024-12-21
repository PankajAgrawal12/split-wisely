import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import type { UpdateProfileInput } from "@split-wisely/validations";
import { CacheService } from "../services/cache.service";
// import { Clerk } from "@clerk/backend";
import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export class UserController {
    static async webhookHandler(req: Request, res: Response) {
        try {
            // TODO: Re-enable header verification in production
            // const svix_id = req.headers["svix-id"] as string;
            // const svix_timestamp = req.headers["svix-timestamp"] as string;
            // const svix_signature = req.headers["svix-signature"] as string;

            // if (!svix_id || !svix_timestamp || !svix_signature) {
            //     return res.status(400).json({ error: "Missing svix headers" });
            // }

            const evt = req.body;
            
            switch (evt.type) {
                case 'user.created': {
                    const { id, email_addresses, first_name, last_name } = evt.data;
                    
                    await prisma.user.create({
                        data: {
                            clerkId: id,
                            email: email_addresses[0].email_address,
                            name: `${first_name || ''} ${last_name || ''}`.trim(),
                            isActive: true
                        }
                    });
                    break;
                }
            }
            
            return res.status(200).json({ message: "Webhook processed successfully" });
        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(500).json({ error: "Webhook processing failed" });
        }
    }

    static async getProfile(req: Request, res: Response) {
        try {
            const { userId } = req.auth;
            const cached = await CacheService.getUserProfile(userId);
            if (cached) {
                return res.status(200).json(cached);
            }

            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    lastLogin: true
                }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            await CacheService.setUserProfile(user.id, user);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const { userId } = req.auth;
            const user = await prisma.user.update({
                where: { clerkId: userId },
                data: {
                    name: req.body.name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    updatedAt: true
                }
            });

            await CacheService.invalidateUserProfile(user.id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteAccount(req: Request, res: Response) {
        try {
            const { userId } = req.auth;
            // Delete user from Clerk
            await clerk.users.deleteUser(userId);

            // Deactivate in our database
            await prisma.user.update({
                where: { clerkId: userId },
                data: { isActive: false }
            });

            return res.status(200).json({ message: "Account deactivated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}