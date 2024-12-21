import { Request, Response } from "express";
import { RazorpayService } from "../services/razorpay.service";

export class WebhookController {
    static async handleRazorpayWebhook(req: Request, res: Response) {
        try {
            const signature = req.headers["x-razorpay-signature"] as string;
            
            if (!signature) {
                return res.status(400).json({ message: "Missing signature" });
            }

            const isValid = await RazorpayService.verifyWebhookSignature(
                req.body,
                signature
            );

            if (!isValid) {
                return res.status(400).json({ message: "Invalid signature" });
            }

            await RazorpayService.handleWebhookEvent(req.body);
            return res.status(200).json({ received: true });
        } catch (error) {
            console.error("Webhook error:", error);
            return res.status(500).json({ message: "Webhook processing failed" });
        }
    }
} 