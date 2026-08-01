import { Router } from "express";
import * as leaderboardController from "./leaderboard.controller";
import { authGuard } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authGuard, leaderboardController.getLeaderboard);
router.get("/me", authGuard, leaderboardController.getMyStats);
router.get("/badges", authGuard, leaderboardController.getBadges);

export default router;
