import React from "react";
import { VERDICT_CONFIG } from "../../lib/constants";
import { formatMs } from "../../lib/utils";
import { CheckCircle2, XCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";

export function VerdictStrip({ result, isLoading, isDryRun }) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-[#7c3aed]/40 bg-[#111827] p-3 text-xs font-mono">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent animate-shimmer" />
        <div className="flex items-center justify-between relative z-10 text-[#a78bfa]">
          <span className="flex items-center gap-2 font-semibold">
            <Loader2 size={16} className="animate-spin text-[#7c3aed]" />
            EXECUTING QUERY IN ORACLE 21C XE SANDBOX...
          </span>
          <span className="text-[11px] text-[#64748b]">Max timeout 10.0s</span>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const verdict = result.verdict || (result.success ? "pass" : "fail");
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.fail;
  const execTime = result.executionTimeMs;

  const isPass = verdict === "pass";

  return (
    <div
      className={`rounded-lg border p-4 space-y-2 font-mono transition-all ${
        isPass
          ? "border-green-500/30 bg-green-950/20"
          : verdict === "timeout"
          ? "border-red-500/30 bg-red-950/20"
          : verdict === "error"
          ? "border-amber-500/30 bg-amber-950/20"
          : "border-red-500/30 bg-red-950/20"
      }`}
    >
      {/* Oracle Double-Line Motif */}
      <div className="text-[11px] text-[#64748b] overflow-hidden whitespace-nowrap select-none opacity-60">
        ════════════════════════════════════════════════════════════════════════════════
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {isPass ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <CheckCircle2 size={18} />
            </span>
          ) : verdict === "error" ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <AlertTriangle size={18} />
            </span>
          ) : verdict === "timeout" ? (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <Clock size={18} />
            </span>
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <XCircle size={18} />
            </span>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold tracking-wide ${config.color}`}>
                {config.label}
              </span>
              {isDryRun && (
                <span className="text-[10px] uppercase font-sans tracking-wider px-1.5 py-0.5 rounded bg-[#1a2233] text-[#64748b] border border-[#252d3d]">
                  Dry Run (Not Saved)
                </span>
              )}
            </div>
            <p className="text-xs text-[#cbd5e1] font-sans mt-0.5">{result.message}</p>
          </div>
        </div>

        {execTime != null && (
          <div className="text-right text-xs text-[#64748b]">
            <span className="text-[#a78bfa] font-mono font-semibold">{formatMs(execTime)}</span>
            <div className="text-[10px] text-[#64748b]">exec time</div>
          </div>
        )}
      </div>

      <div className="text-[11px] text-[#64748b] overflow-hidden whitespace-nowrap select-none opacity-60">
        ════════════════════════════════════════════════════════════════════════════════
      </div>
    </div>
  );
}
