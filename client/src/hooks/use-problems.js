import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems";

export function useProblems(params) {
  return useQuery({
    queryKey: ["problems", params],
    queryFn: () => problemsApi.list(params),
    keepPreviousData: true,
  });
}

export function useProblem(slug) {
  return useQuery({
    queryKey: ["problem", slug],
    queryFn: () => problemsApi.get(slug),
    enabled: !!slug,
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: problemsApi.topics,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSolvedIds() {
  return useQuery({
    queryKey: ["solved-ids"],
    queryFn: problemsApi.solvedIds,
    staleTime: 30 * 1000,
  });
}
