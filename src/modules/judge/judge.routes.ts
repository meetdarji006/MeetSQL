import { Router } from "express";
import * as judgeController from "./judge.controller";
import { validate } from "../../middleware/validate.middleware";
import { authGuard } from "../../middleware/auth.middleware";
import { submitSchema } from "./judge.schema";

const router = Router();

router.post("/submit", authGuard, validate(submitSchema), judgeController.submit);
router.post("/run", authGuard, validate(submitSchema), judgeController.dryRun);

export default router;
