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
} 