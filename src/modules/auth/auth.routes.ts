import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { authGuard } from "../../middleware/auth.middleware";
import { signupSchema, loginSchema, refreshSchema } from "./auth.schema";

const router = Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);
router.post("/logout", validate(refreshSchema), authController.logout);
router.get("/profile", authGuard, authController.getProfile);

export default router;
