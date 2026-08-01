import { Request, Response } from "express";
import * as judgeService from "./judge.service";
import { ok, fail } from "../../utils/api-response";

export async function submit(req: Request, res: Response) {
  try {
    const result = await judgeService.judgeSubmission(
      req.user!.userId,
      req.body.problemId,
      req.body.sql,
      true // save submission
    );
    ok(res, "Submission judged", result);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function dryRun(req: Request, res: Response) {
  try {
    const result = await judgeService.judgeSubmission(
      req.user!.userId,
      req.body.problemId,
      req.body.sql,
      false // don't save
    );
    ok(res, "Dry run complete", result);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}
