import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT || "8000",
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
};

const requiredEnvVars = ["REDIS_URL"];
for (const envVar of requiredEnvVars) {
    if (!config[envVar as keyof typeof config]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
