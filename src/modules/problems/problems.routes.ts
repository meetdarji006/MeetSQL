import { Router } from "express";
import * as problemsController from "./problems.controller";
import { validateQuery } from "../../middleware/validate.middleware";
import { authGuard } from "../../middleware/auth.middleware";
import { listProblemsSchema } from "./problems.schema";

const router = Router();

router.get(
  "/",
  authGuard,
  validateQuery(listProblemsSchema),
  problemsController.listProblems
);

router.get("/topics", authGuard, problemsController.getTopics);
router.get("/solved-ids", authGuard, problemsController.getSolvedIds);
router.get("/:slug", authGuard, problemsController.getProblem);

export default router;
