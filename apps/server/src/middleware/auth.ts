import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { prisma } from "../config/prisma";

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId, isActive: true }
        });

        if (!user) {
            return res.status(401).json({ message: "User not found or inactive" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}; 