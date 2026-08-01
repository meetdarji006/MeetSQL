import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "../api/leaderboard";

export function useLeaderboard(params) {
  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: () => leaderboardApi.list(params),
  });
}

export function useMyStats() {
  return useQuery({
    queryKey: ["my-stats"],
    queryFn: leaderboardApi.me,
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: leaderboardApi.badges,
    staleTime: 10 * 60 * 1000,
  });
}
