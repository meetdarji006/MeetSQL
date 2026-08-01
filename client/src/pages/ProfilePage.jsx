import React from "react";
import { useAuthStore } from "../stores/auth-store";
import { useMyStats } from "../hooks/use-leaderboard";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Spinner } from "../components/ui/spinner";
import { User, Terminal, Database, Trophy, Flame, Award, Calendar, CheckCircle2 } from "lucide-react";
import { formatDate } from "../lib/utils";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { data: myStatsRes, isLoading } = useMyStats();
  const myStats = myStatsRes?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  const stats = myStats?.stats || {};
  const badges = myStats?.badges || [];
  const topics = myStats?.topicBreakdown || [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <Card className="border-[#252d3d] bg-[#111827]">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#7c3aed] text-white text-3xl font-bold font-display shadow-lg shadow-[#7c3aed]/20">
            {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold font-display text-[#f1f5f9]">
                  {user?.displayName}
                </h1>
                <p className="text-xs text-[#64748b]">{user?.email}</p>
              </div>

              <Badge variant="violet" className="self-center sm:self-auto">
                Student Account
              </Badge>
            </div>

            {/* Oracle Credentials Info Box */}
            <div className="rounded-lg border border-[#252d3d] bg-[#1a2233] p-3 text-xs font-mono text-[#cbd5e1] grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-[#a78bfa]" />
                <span>Oracle Schema: <strong className="text-[#f1f5f9]">{user?.oracleSchema || "STU_SANDBOX"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#34d399]" />
                <span>Database Engine: <strong className="text-[#f1f5f9]">Oracle XE 21c</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-amber-400" />
                <span>Joined: <strong className="text-[#f1f5f9]">{formatDate(user?.createdAt)}</strong></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Solved Statistics & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#252d3d] bg-[#111827]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[#64748b] uppercase tracking-wider font-sans">
              Total Solved
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold font-display text-[#f1f5f9]">
              {stats.solvedCount || 0} <span className="text-xs font-sans font-normal text-[#64748b]">problems</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-green-400 font-mono">
                <span>Easy</span>
                <span>{stats.easySolved || 0}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-mono">
                <span>Medium</span>
                <span>{stats.mediumSolved || 0}</span>
              </div>
              <div className="flex justify-between text-red-400 font-mono">
                <span>Hard</span>
                <span>{stats.hardSolved || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#252d3d] bg-[#111827]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[#64748b] uppercase tracking-wider font-sans">
              Daily Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold font-display text-amber-400 flex items-center gap-2">
              <Flame size={28} className="fill-amber-400" />
              <span>{stats.currentStreak || 0} <span className="text-xs font-sans font-normal text-[#64748b]">days</span></span>
            </div>
            <p className="text-xs text-[#64748b]">
              Longest streak: <strong className="text-[#cbd5e1] font-mono">{stats.longestStreak || 0} days</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Topic Mastery */}
      <Card className="border-[#252d3d] bg-[#111827]">
        <CardHeader>
          <CardTitle className="text-base">Topic Mastery Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {topics.length === 0 ? (
            <p className="text-xs text-[#64748b]">No topics solved yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {topics.map((t) => (
                <div
                  key={t.tag}
                  className="rounded-lg border border-[#252d3d] bg-[#1a2233] p-3 flex items-center justify-between"
                >
                  <span className="text-xs font-mono text-[#a78bfa]">{t.tag}</span>
                  <span className="text-xs font-bold text-[#f1f5f9]">{t.count} solved</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
