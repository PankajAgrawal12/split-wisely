import Razorpay from "razorpay";
import { config } from "./env";

if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not defined in environment variables");
}

export const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET
});