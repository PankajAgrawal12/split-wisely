import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "@clerk/express";

const router = Router();

// Public webhook endpoint (no auth required)
router.post("/webhook", UserController.webhookHandler);

// Protected routes
router.get("/me", requireAuth(), UserController.getProfile);
router.put("/profile", requireAuth(), UserController.updateProfile);
router.delete("/account", requireAuth(), UserController.deleteAccount);

export default router;