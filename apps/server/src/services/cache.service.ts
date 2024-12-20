import { redis } from "../config/redis";

export class CacheService {
    private static PREFIX = "split-wisely:";
    private static TTL = 3600; // 1 hour in seconds

    static async getUserProfile(userId: string) {
        const key = `${this.PREFIX}user:${userId}`;
        const cached = await redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    static async setUserProfile(userId: string, profile: any) {
        const key = `${this.PREFIX}user:${userId}`;
        await redis.setex(key, this.TTL, JSON.stringify(profile));
    }

    static async invalidateUserProfile(userId: string) {
        const key = `${this.PREFIX}user:${userId}`;
        await redis.del(key);
    }

    static async getUserSubscriptions(userId: string) {
        const key = `${this.PREFIX}subscriptions:${userId}`;
        const cached = await redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    static async setUserSubscriptions(userId: string, subscriptions: any) {
        const key = `${this.PREFIX}subscriptions:${userId}`;
        await redis.setex(key, this.TTL, JSON.stringify(subscriptions));
    }

    static async invalidateUserSubscriptions(userId: string) {
        const key = `${this.PREFIX}subscriptions:${userId}`;
        await redis.del(key);
    }
} 