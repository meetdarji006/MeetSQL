import React from "react";
import { useLeaderboard, useMyStats } from "../hooks/use-leaderboard";
import { Card, CardContent } from "../components/ui/card";
import { Spinner } from "../components/ui/spinner";
import { Trophy, Flame } from "lucide-react";
import { useAuthStore } from "../stores/auth-store";

export function LeaderboardPage() {
  const currentUser = useAuthStore((s) => s.user);
  const { data: leaderboardRes, isLoading } = useLeaderboard();
  const { data: myStatsRes } = useMyStats();

  const leaderboard = leaderboardRes?.data || [];
  const myStats = myStatsRes?.data;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#252d3d] pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#f1f5f9] tracking-tight">
          Classmate Leaderboard
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Competitive rankings based on solved problems, difficulty score, and daily streaks
        </p>
      </div>

      {/* My Summary Banner */}
      {myStats && (
        <Card className="border-[#7c3aed]/30 bg-gradient-to-r from-[#111827] via-[#1a2233] to-[#111827] relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#7c3aed]/5 blur-2xl pointer-events-none" />

          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40 text-xl font-bold font-display">
                {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-[#f1f5f9]">
                  {currentUser?.displayName || "Student"}
                </h2>
                <p className="text-xs font-mono text-[#a78bfa]">
                  Schema: {currentUser?.oracleSchema || "STU_SANDBOX"}
                </p>
              </div>
            </div>

            {/* Stat Counters */}
            <div className="grid grid-cols-2 gap-8 text-center border-t sm:border-t-0 sm:border-l border-[#252d3d] pt-4 sm:pt-0 sm:pl-8">
              <div>
                <div className="text-2xl font-bold font-display text-[#f1f5f9]">
                  {myStats.stats?.solvedCount || 0}
                </div>
                <div className="text-[11px] text-[#64748b]">Solved</div>
              </div>

              <div>
                <div className="text-2xl font-bold font-display text-amber-400 flex items-center justify-center gap-1">
                  <Flame size={20} className="fill-amber-400" />
                  <span>{myStats.stats?.currentStreak || 0}</span>
                </div>
                <div className="text-[11px] text-[#64748b]">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Leaderboard Table */}
      <div className="rounded-xl border border-[#252d3d] bg-[#111827] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#1a2233]/40 border-b border-[#252d3d] flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-sm font-semibold text-[#f1f5f9]">
            <Trophy size={18} className="text-[#a78bfa]" />
            <span>Global Standings</span>
          </div>
          <span className="text-xs text-[#64748b]">Updated automatically after each submission</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <Spinner size={32} />
            <p className="text-xs text-[#64748b] font-mono">Computing rankings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#64748b]">
            No activity logged yet. Be the first to solve a problem!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a2233] text-xs font-semibold uppercase tracking-wider text-[#64748b] border-b border-[#252d3d]">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4 text-center">Total Solved</th>
                  <th className="py-3.5 px-4 text-center">Easy</th>
                  <th className="py-3.5 px-4 text-center">Medium</th>
                  <th className="py-3.5 px-4 text-center">Hard</th>
                  <th className="py-3.5 px-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252d3d]/50 font-sans">
                {leaderboard.map((entry) => {
                  const isMe = entry.userId === currentUser?.id;

                  return (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${
                        isMe
                          ? "bg-[#7c3aed]/10 hover:bg-[#7c3aed]/15 font-medium"
                          : "hover:bg-[#1a2233]/40"
                      }`}
                    >
                      <td className="py-4 px-4 text-center font-display font-bold text-sm">
                        {entry.rank === 1 ? (
                          <span className="text-amber-400">🥇 1</span>
                        ) : entry.rank === 2 ? (
                          <span className="text-slate-300">🥈 2</span>
                        ) : entry.rank === 3 ? (
                          <span className="text-amber-700">🥉 3</span>
                        ) : (
                          <span className="text-[#64748b]">#{entry.rank}</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-[#f1f5f9]">
                            {entry.displayName}
                          </span>
                          {isMe && (
                            <span className="text-[10px] uppercase tracking-wider bg-[#7c3aed] text-white px-1.5 py-0.5 rounded font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-[#f1f5f9]">
                        {entry.solvedCount}
                      </td>

                      <td className="py-4 px-4 text-center text-green-400 font-mono text-xs">
                        {entry.easySolved}
                      </td>

                      <td className="py-4 px-4 text-center text-amber-400 font-mono text-xs">
                        {entry.mediumSolved}
                      </td>

                      <td className="py-4 px-4 text-center text-red-400 font-mono text-xs">
                        {entry.hardSolved}
                      </td>

                      <td className="py-4 px-4 text-right font-mono text-xs text-amber-400 font-semibold">
                        {entry.currentStreak > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Flame size={14} className="fill-amber-400" />
                            {entry.currentStreak}d
                          </span>
                        ) : (
                          <span className="text-[#64748b]">0d</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
