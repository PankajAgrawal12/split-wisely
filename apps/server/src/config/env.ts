import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT || "8000",
    REDIS_URL: process.env.REDIS_URL
};

const requiredEnvVars = ["REDIS_URL"];
for (const envVar of requiredEnvVars) {
    if (!config[envVar as keyof typeof config]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
