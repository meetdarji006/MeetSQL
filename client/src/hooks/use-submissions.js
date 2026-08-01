import { useQuery } from "@tanstack/react-query";
import { submissionsApi } from "../api/submissions";

export function useSubmissions(params) {
  return useQuery({
    queryKey: ["submissions", params],
    queryFn: () => submissionsApi.list(params),
    keepPreviousData: true,
  });
}

export function useSubmission(id) {
  return useQuery({
    queryKey: ["submission", id],
    queryFn: () => submissionsApi.get(id),
    enabled: !!id,
  });
}

export function useProblemSubmissions(problemId) {
  return useQuery({
    queryKey: ["submissions", "problem", problemId],
    queryFn: () => submissionsApi.byProblem(problemId),
    enabled: !!problemId,
  });
}
