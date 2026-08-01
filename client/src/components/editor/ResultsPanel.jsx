import React from "react";
import { AlertCircle, Database, ArrowRightLeft } from "lucide-react";

export function ResultsPanel({ result }) {
  if (!result) return null;

  const summary = result.resultSummary;
  const isPass = result.verdict === "pass";

  // If there's an explicit error message (Oracle syntax error, timeout, etc.)
  if (result.verdict === "error" || result.verdict === "timeout") {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-[#1a2233] p-4 text-xs font-mono space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-semibold font-sans">
          <AlertCircle size={16} />
          <span>Oracle Engine Exception</span>
        </div>
        <pre className="p-3 rounded bg-[#0b0f19] text-red-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-[#252d3d]">
          {result.message}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* 1. SELECT Diff Summary / Row Preview */}
      {summary && summary.sampleActual && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[#64748b] text-[11px] font-sans">
            <span>
              Rows Matched:{" "}
              <strong className="text-[#f1f5f9]">{summary.actualRowCount}</strong> /{" "}
              <strong className="text-[#f1f5f9]">{summary.expectedRowCount}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Output */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[#a78bfa] flex items-center justify-between">
                <span>Your Output Preview</span>
                <span className="text-[10px] text-[#64748b]">({summary.sampleActual?.length || 0} rows)</span>
              </div>
              <TableGrid rows={summary.sampleActual} isError={!isPass} />
            </div>

            {/* Expected Output */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-green-400 flex items-center justify-between">
                <span>Expected Output Preview</span>
                <span className="text-[10px] text-[#64748b]">({summary.sampleExpected?.length || 0} rows)</span>
              </div>
              <TableGrid rows={summary.sampleExpected} />
            </div>
          </div>
        </div>
      )}

      {/* 2. DML Table Diffs */}
      {Array.isArray(summary) && summary[0]?.tableName && (
        <div className="space-y-3">
          <div className="text-[11px] font-semibold text-[#a78bfa] font-sans">
            Table State Diffs After DML
          </div>
          {summary.map((t, idx) => (
            <div key={idx} className="rounded border border-[#252d3d] bg-[#1a2233] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#f1f5f9]">{t.tableName}</span>
                <span className={t.pass ? "text-green-400" : "text-red-400"}>
                  {t.message}
                </span>
              </div>
              {t.actualRows && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-[#64748b]">Actual Table Data:</span>
                    <TableGrid rows={t.actualRows} isError={!t.pass} />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b]">Expected Table Data:</span>
                    <TableGrid rows={t.expectedRows} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. DDL Structure Diffs */}
      {Array.isArray(summary) && summary[0]?.category && (
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-[#a78bfa] font-sans">
            Data Dictionary Inspection Results
          </div>
          <div className="rounded border border-[#252d3d] bg-[#1a2233] divide-y divide-[#252d3d]/60">
            {summary.map((item, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between">
                <span className="text-[#cbd5e1]">{item.message}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.pass ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {item.pass ? "MATCH" : "MISMATCH"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TableGrid({ rows, isError }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="p-3 text-center text-[11px] text-[#64748b] bg-[#0b0f19] rounded border border-[#252d3d]">
        (empty result set)
      </div>
    );
  }

  const cols = Object.keys(rows[0] || {});

  return (
    <div className={`overflow-x-auto rounded border bg-[#0b0f19] ${isError ? "border-red-500/30" : "border-[#252d3d]"}`}>
      <table className="w-full text-left text-[11px]">
        <thead className="bg-[#1a2233] text-[#64748b] border-b border-[#252d3d]">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-2.5 py-1.5 font-semibold uppercase">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#252d3d]/40">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-[#1a2233]/40">
              {cols.map((c) => (
                <td key={c} className="px-2.5 py-1 text-[#cbd5e1] whitespace-nowrap">
                  {row[c] === null ? <span className="text-[#64748b] font-sans text-[10px] italic">NULL</span> : String(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
