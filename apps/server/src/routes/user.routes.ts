import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { authenticateUser } from "../middleware/auth";
import { signupSchema, loginSchema, updateProfileSchema } from "@split-wisely/validations";

const router = Router();

router.post("/signup", validate(signupSchema), UserController.signup);
router.post("/login", validate(loginSchema), UserController.login);
router.get("/me", authenticateUser, UserController.getProfile);
router.put("/update-profile",
    authenticateUser,
    validate(updateProfileSchema),
    UserController.updateProfile
);
router.delete("/delete-account", authenticateUser, UserController.deleteAccount);

export default router;