import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import type { SignupInput, LoginInput, UpdateProfileInput } from "@split-wisely/validations";
import { CacheService } from "../services/cache.service";

export class UserController {
    static async signup(req: Request<{}, {}, SignupInput>, res: Response) {
        try {
            const { email, password, name } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name
                }
            });

            const token = jwt.sign({ userId: user.id }, config.JWT_SECRET);

            return res.status(201).json({
                message: "User created successfully",
                token
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req: Request<{}, {}, LoginInput>, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !user.isActive) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });

            await CacheService.setUserProfile(user.id, {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                lastLogin: updatedUser.lastLogin
            });

            const token = jwt.sign({ userId: user.id }, config.JWT_SECRET);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getProfile(req: Request, res: Response) {
        try {
            const cached = await CacheService.getUserProfile(req.user.id);
            if (cached) {
                return res.status(200).json(cached);
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    lastLogin: true
                }
            });

            await CacheService.setUserProfile(req.user.id, user);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateProfile(
        req: Request<{}, {}, UpdateProfileInput>,
        res: Response
    ) {
        try {
            const updates: any = { ...req.body };
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            const user = await prisma.user.update({
                where: { id: req.user.id },
                data: updates,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    updatedAt: true
                }
            });

            await CacheService.invalidateUserProfile(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteAccount(req: Request, res: Response) {
        try {
            await prisma.user.update({
                where: { id: req.user.id },
                data: { isActive: false }
            });

            return res.status(200).json({ message: "Account deactivated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
} 