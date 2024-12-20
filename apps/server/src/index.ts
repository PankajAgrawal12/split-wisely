import express from "express";
import cors from "cors";
import { redis } from "./config/redis";
import { config } from "./config/env";
import { prisma } from "./config/prisma";
import userRoutes from "./routes/user.routes";
import subscriptionRoutes from "./routes/subscription.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);

async function init() {
    try {
        // Test Redis connection
        await redis.ping();

        // Connect to Prisma
        await prisma.$connect();
        console.log("🚀 Connected to Database");

        app.listen(config.PORT, () =>
            console.log(`🚀 HTTP Server started at PORT: ${config.PORT}`)
        );
    } catch (error) {
        console.error("Failed to start server:", error);
        await prisma.$disconnect();
        redis.disconnect();
        process.exit(1);
    }
}

init();

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    await redis.quit();
});

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
        await prisma.$disconnect();
        await redis.quit();
        process.exit(0);
    });
});