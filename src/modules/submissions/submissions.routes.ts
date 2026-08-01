import { Router } from "express";
import * as submissionsController from "./submissions.controller";
import { validateQuery } from "../../middleware/validate.middleware";
import { authGuard } from "../../middleware/auth.middleware";
import { listSubmissionsSchema } from "./submissions.schema";

const router = Router();

router.get(
  "/",
  authGuard,
  validateQuery(listSubmissionsSchema),
  submissionsController.listSubmissions
);
router.get("/:id", authGuard, submissionsController.getSubmission);
router.get(
  "/problem/:problemId",
  authGuard,
  submissionsController.getProblemSubmissions
);

export default router;
