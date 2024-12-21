import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller";
import { validate } from "../middleware/validate";
import { authenticateUser } from "../middleware/auth";
import {
    createSubscriptionSchema,
    updateSubscriptionSchema,
    inviteParticipantSchema,
    respondToInviteSchema
} from "@split-wisely/validations";

const router = Router();

router.use(authenticateUser); // All subscription routes require authentication

router.post("/", validate(createSubscriptionSchema), SubscriptionController.create);
router.get("/", SubscriptionController.getAll);
router.get("/:id", SubscriptionController.getOne);
router.put("/:id", validate(updateSubscriptionSchema), SubscriptionController.update);
router.delete("/:id", SubscriptionController.delete);
router.post("/:id/invite", validate(inviteParticipantSchema), SubscriptionController.invite);
router.put("/:id/respond-invite", validate(respondToInviteSchema), SubscriptionController.respondToInvite);

export default router;