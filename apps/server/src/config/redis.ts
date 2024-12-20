import Redis from "ioredis";
import { config } from "./env";

if (!config.REDIS_URL) {
    throw new Error("REDIS_URL is not defined in environment variables");
}

export const redis = new Redis(config.REDIS_URL, {
    tls: {
        rejectUnauthorized: false
    },
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
});

redis.on("error", (error) => {
    console.error("Redis Error:", error);
});

redis.on("connect", () => {
    console.log("🚀 Successfully connected to Redis");
});

redis.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
});