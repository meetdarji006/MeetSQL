import { Request, Response } from "express";
import * as submissionsService from "./submissions.service";
import { ok, fail } from "../../utils/api-response";

export async function listSubmissions(req: Request, res: Response) {
  try {
    const result = await submissionsService.listSubmissions(
      req.user!.userId,
      req.query as any
    );
    ok(res, "Submissions retrieved", result.submissions, result.pagination);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getSubmission(req: Request, res: Response) {
  try {
    const submission = await submissionsService.getSubmission(
      req.user!.userId,
      parseInt(req.params.id as string, 10)
    );
    ok(res, "Submission retrieved", submission);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}

export async function getProblemSubmissions(req: Request, res: Response) {
  try {
    const data = await submissionsService.getProblemSubmissions(
      req.user!.userId,
      parseInt(req.params.problemId as string, 10)
    );
    ok(res, "Problem submissions retrieved", data);
  } catch (err: any) {
    fail(res, err.statusCode || 500, err.message, err);
  }
}
