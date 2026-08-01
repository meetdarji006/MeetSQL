import React, { useState } from "react";
import { useSubmissions } from "../hooks/use-submissions";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { formatRelative, formatMs } from "../lib/utils";
import { VERDICT_CONFIG } from "../lib/constants";
import { History, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export function SubmissionsPage() {
  const [page, setPage] = useState(1);
  const [verdictFilter, setVerdictFilter] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data, isLoading, isError } = useSubmissions({
    page,
    limit: 15,
    verdict: verdictFilter || undefined,
  });

  const submissions = data?.data || [];
  const pagination = data?.meta || { page: 1, totalPages: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252d3d] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#f1f5f9] tracking-tight">
            Submission History
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Review all your past query executions, verdicts, and execution performance
          </p>
        </div>

        {/* Verdict Filter */}
        <div className="flex items-center gap-1 rounded-lg border border-[#252d3d] bg-[#111827] p-1">
          {["", "pass", "fail", "error", "timeout"].map((v) => (
            <button
              key={v}
              onClick={() => { setVerdictFilter(v); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                verdictFilter === v
                  ? "bg-[#7c3aed] text-white"
                  : "text-[#64748b] hover:text-[#cbd5e1]"
              }`}
            >
              {v ? v.toUpperCase() : "ALL"}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-xl border border-[#252d3d] bg-[#111827] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <Spinner size={32} />
            <p className="text-xs text-[#64748b] font-mono">Loading submission log...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <History size={40} className="mx-auto text-[#64748b]" />
            <p className="text-base font-semibold text-[#f1f5f9]">No submissions found</p>
            <p className="text-xs text-[#64748b]">
              Head over to the problems catalog and solve your first Oracle SQL challenge!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a2233] text-xs font-semibold uppercase tracking-wider text-[#64748b] border-b border-[#252d3d]">
                <tr>
                  <th className="py-3.5 px-4">Problem</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4">SQL Query</th>
                  <th className="py-3.5 px-4">Exec Time</th>
                  <th className="py-3.5 px-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252d3d]/50 font-sans">
                {submissions.map((s) => {
                  const isPass = s.verdict === "pass";
                  const config = VERDICT_CONFIG[s.verdict] || VERDICT_CONFIG.fail;

                  return (
                    <tr key={s.id} className="hover:bg-[#1a2233]/40 transition-colors">
                      <td className="py-4 px-4 font-medium text-[#f1f5f9]">
                        <Link
                          to={`/problems/${s.problemSlug}`}
                          className="hover:text-[#a78bfa] transition-colors"
                        >
                          {s.problemTitle}
                        </Link>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${config.color}`}>
                          {isPass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {config.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 max-w-xs sm:max-w-md">
                        <pre className="p-1.5 rounded bg-[#1a2233] font-mono text-xs text-[#cbd5e1] truncate border border-[#252d3d]">
                          {s.queryText}
                        </pre>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs text-[#a78bfa]">
                        {formatMs(s.executionTimeMs)}
                      </td>

                      <td className="py-4 px-4 text-right text-xs text-[#64748b]">
                        {formatRelative(s.submittedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#252d3d] bg-[#111827] px-4 py-3 sm:px-6">
            <div className="text-xs text-[#64748b]">
              Page <span className="font-mono text-[#cbd5e1]">{pagination.page}</span> of{" "}
              <span className="font-mono text-[#cbd5e1]">{pagination.totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} /> Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={page >= pagination.totalPages}
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
