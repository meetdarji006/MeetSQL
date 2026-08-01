import { useMutation, useQueryClient } from "@tanstack/react-query";
import { judgeApi } from "../api/judge";

export function useSubmitSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: judgeApi.submit,
    onSuccess: () => {
      // Invalidate all related caches so UI refreshes dynamically
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-stats"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["solved-ids"] });
    },
  });
}

export function useRunQuery() {
  return useMutation({
    mutationFn: judgeApi.run,
  });
}
