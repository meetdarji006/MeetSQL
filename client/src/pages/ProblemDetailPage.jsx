import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProblem, useSolvedIds } from "../hooks/use-problems";
import { useSubmitSolution, useRunQuery } from "../hooks/use-judge";
import { useProblemSubmissions } from "../hooks/use-submissions";
import { SqlEditor } from "../components/editor/SqlEditor";
import { VerdictStrip } from "../components/editor/VerdictStrip";
import { ResultsPanel } from "../components/editor/ResultsPanel";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Spinner } from "../components/ui/spinner";
import { DIFFICULTY_CONFIG } from "../lib/constants";
import { formatRelative, formatMs } from "../lib/utils";
import {
  ArrowLeft,
  Play,
  Send,
  Database,
  History,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export function ProblemDetailPage() {
  const { slug } = useParams();
  const { data: problemRes, isLoading, isError } = useProblem(slug);
  const problem = problemRes?.data;

  const [sql, setSql] = useState("");
  const [activeTab, setActiveTab] = useState("description"); // description | submissions
  const [judgeResult, setJudgeResult] = useState(null);
  const [isDryRun, setIsDryRun] = useState(false);

  const runMutation = useRunQuery();
  const submitMutation = useSubmitSolution();
  const { data: submissionsRes, refetch: refetchSubmissions } = useProblemSubmissions(
    problem?.id
  );
  const { data: solvedData } = useSolvedIds();
  const solvedIds = new Set(solvedData?.data || []);
  const isSolved = problem ? solvedIds.has(problem.id) : false;

  const previousSubmissions = submissionsRes?.data || [];

  // Set default comment placeholder when problem loads
  useEffect(() => {
    if (problem) {
      if (problem.validationType === "select_diff") {
        setSql(`-- Write your Oracle SQL solution here\n`);
      } else if (problem.validationType === "dml_diff") {
        setSql(`-- Write your DML query here\n`);
      } else {
        setSql(`-- Write your DDL statement here\n`);
      }
    }
  }, [problem]);

  const handleRun = () => {
    if (!problem || !sql.trim()) return;
    setIsDryRun(true);
    setJudgeResult(null);

    runMutation.mutate(
      { problemId: problem.id, sql },
      {
        onSuccess: (res) => setJudgeResult(res.data),
        onError: (err) =>
          setJudgeResult({
            verdict: "error",
            message: err.response?.data?.message || err.message,
            executionTimeMs: 0,
          }),
      }
    );
  };

  const handleSubmit = () => {
    if (!problem || !sql.trim()) return;
    setIsDryRun(false);
    setJudgeResult(null);

    submitMutation.mutate(
      { problemId: problem.id, sql },
      {
        onSuccess: (res) => {
          setJudgeResult(res.data);
          refetchSubmissions();
        },
        onError: (err) =>
          setJudgeResult({
            verdict: "error",
            message: err.response?.data?.message || err.message,
            executionTimeMs: 0,
          }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center space-y-3">
        <Spinner size={36} />
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center space-y-4">
        <AlertCircle size={40} className="mx-auto text-red-400" />
        <h2 className="text-xl font-bold font-display text-[#f1f5f9]">Problem Not Found</h2>
        <p className="text-xs text-[#64748b]">
          The problem you're looking for doesn't exist or has been archived.
        </p>
        <Link to="/problems">
          <Button variant="outline" size="sm">← Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const diffConf = DIFFICULTY_CONFIG[problem.difficulty] || DIFFICULTY_CONFIG.easy;
  const isExecuting = runMutation.isPending || submitMutation.isPending;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0b0f19] overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-[#252d3d] bg-[#111827] px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#cbd5e1] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Catalog</span>
          </Link>
          <span className="text-[#252d3d]">|</span>
          <h1 className="text-sm font-semibold font-display text-[#f1f5f9] truncate max-w-xs sm:max-w-md">
            {problem.title}
          </h1>
          <Badge variant={problem.difficulty} className="hidden sm:inline-flex">
            {diffConf.label}
          </Badge>
          {isSolved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 border border-green-500/30 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={12} /> Solved
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            disabled={isExecuting || !sql.trim()}
            className="text-xs gap-1.5"
          >
            <Play size={14} className="text-[#a78bfa]" />
            <span>Run Query</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isExecuting || !sql.trim()}
            className="text-xs gap-1.5 font-semibold"
          >
            <Send size={14} />
            <span>Submit Solution</span>
          </Button>
        </div>
      </div>

      {/* Main Split Pane Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Problem Spec & Submissions */}
        <div className="lg:col-span-5 border-r border-[#252d3d] bg-[#111827] flex flex-col overflow-hidden">
          {/* Sub-tabs */}
          <div className="flex items-center border-b border-[#252d3d] bg-[#1a2233]/40 px-3 shrink-0">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === "description"
                  ? "border-[#7c3aed] text-[#f1f5f9]"
                  : "border-transparent text-[#64748b] hover:text-[#cbd5e1]"
              }`}
            >
              <BookOpen size={14} />
              <span>Description</span>
            </button>

            <button
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === "submissions"
                  ? "border-[#7c3aed] text-[#f1f5f9]"
                  : "border-transparent text-[#64748b] hover:text-[#cbd5e1]"
              }`}
            >
              <History size={14} />
              <span>My Submissions ({previousSubmissions.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === "description" ? (
              <div className="space-y-6 text-sm text-[#cbd5e1]">
                {/* Meta Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={problem.difficulty}>{diffConf.label}</Badge>
                  <span className="text-xs font-mono text-[#64748b] bg-[#1a2233] px-2 py-0.5 rounded border border-[#252d3d]">
                    Type: {problem.validationType}
                  </span>
                  {problem.topicTags?.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#1a2233] text-[#a78bfa] border border-[#252d3d]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Problem Description Markdown */}
                <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(problem.description) }} />
                </div>

                {/* Table Structure Preview */}
                <div className="space-y-2 border-t border-[#252d3d] pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f1f5f9]">
                    <Database size={14} className="text-[#a78bfa]" />
                    <span>Oracle Table Structure</span>
                  </div>
                  <pre className="p-3 rounded bg-[#1a2233] font-mono text-[11px] text-[#34d399] overflow-x-auto border border-[#252d3d]">
                    {extractTableStructure(problem.setupScript)}
                  </pre>
                </div>
              </div>
            ) : (
              /* Submissions History Tab */
              <div className="space-y-3">
                {previousSubmissions.length === 0 ? (
                  <div className="text-center py-12 space-y-2 text-[#64748b]">
                    <History size={32} className="mx-auto" />
                    <p className="text-xs">No submissions yet for this problem.</p>
                    <p className="text-[11px]">Write your query and click "Submit Solution".</p>
                  </div>
                ) : (
                  previousSubmissions.map((s) => {
                    const isPass = s.verdict === "pass";
                    return (
                      <div
                        key={s.id}
                        className="rounded-lg border border-[#252d3d] bg-[#1a2233] p-3 space-y-2 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isPass ? (
                              <span className="text-green-400 font-bold flex items-center gap-1">
                                <CheckCircle2 size={14} /> ACCEPTED
                              </span>
                            ) : (
                              <span className="text-red-400 font-bold flex items-center gap-1">
                                <XCircle size={14} /> {s.verdict.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#64748b]">{formatRelative(s.submittedAt)}</span>
                        </div>

                        <pre className="p-2 rounded bg-[#0b0f19] text-[#cbd5e1] text-[11px] overflow-x-auto border border-[#252d3d]">
                          {s.queryText}
                        </pre>

                        <div className="flex justify-between items-center text-[10px] text-[#64748b]">
                          <span>Exec Time: {formatMs(s.executionTimeMs)}</span>
                          <button
                            onClick={() => setSql(s.queryText)}
                            className="text-[#a78bfa] hover:underline font-sans"
                          >
                            Load into Editor
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Editor + Verdict Strip + Results */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#0b0f19] overflow-hidden">
          {/* Top Half: Code Editor */}
          <div className="flex-1 p-3 min-h-[300px]">
            <SqlEditor
              value={sql}
              onChange={(val) => setSql(val || "")}
              onRun={handleRun}
              onSubmit={handleSubmit}
              isPending={isExecuting}
            />
          </div>

          {/* Bottom Half: Verdict Strip & Results (Scrollable) */}
          <div className="border-t border-[#252d3d] bg-[#111827] p-4 max-h-[45%] overflow-y-auto space-y-3 shrink-0">
            <VerdictStrip
              result={judgeResult}
              isLoading={isExecuting}
              isDryRun={isDryRun}
            />
            <ResultsPanel result={judgeResult} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced markdown formatter helper for rich problem descriptions
function formatMarkdown(str = "") {
  if (!str) return "";

  let html = str;

  // Code blocks (```sql ... ```)
  html = html.replace(/```(?:sql)?\n([\s\S]*?)```/g, (_match, p1) => {
    return `<pre class="p-3 my-2 rounded bg-[#1a2233] font-mono text-[11px] text-[#34d399] border border-[#252d3d] overflow-x-auto">${p1.trim()}</pre>`;
  });

  // Markdown tables
  const tableRegex = /((?:\|[^\n]+\|\n)+)/g;
  html = html.replace(tableRegex, (tableMatch) => {
    const rows = tableMatch.trim().split("\n");
    let tableHtml = '<div className="overflow-x-auto my-3"><table class="w-full text-left text-xs border border-[#252d3d] rounded-lg overflow-hidden">';

    rows.forEach((row, i) => {
      // Skip delimiter row (|:---|:---|)
      if (row.includes(":---") || row.includes("---")) return;

      const cells = row.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const tag = i === 0 ? "th" : "td";
      const cellBg = i === 0 ? "bg-[#1a2233] text-[#a78bfa] font-bold" : "bg-[#111827]/80 text-[#cbd5e1]";

      tableHtml += `<tr class="border-b border-[#252d3d]">`;
      cells.forEach((cell) => {
        tableHtml += `<${tag} class="py-2 px-3 ${cellBg}">${cell.trim()}</${tag}>`;
      });
      tableHtml += `</tr>`;
    });

    tableHtml += "</table></div>";
    return tableHtml;
  });

  // Headings
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-[#f1f5f9] mt-5 mb-2 font-display border-b border-[#252d3d] pb-1">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-[#a78bfa] mt-4 mb-1.5 font-display">$1</h3>');

  // Lists
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-xs text-[#cbd5e1]">$1</li>');

  // Bold & Inline code
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f1f5f9] font-semibold">$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#1a2233] px-1.5 py-0.5 rounded text-[#34d399] font-mono text-xs border border-[#252d3d]">$1</code>');

  // Line breaks for non-html blocks
  html = html.replace(/\n\n/g, '<br/><br/>');

  return html;
}

// Extract only table structure (CREATE TABLE, ALTER TABLE etc.) from setup script
// Filters out INSERT, COMMIT, and SELECT data seed lines
function extractTableStructure(script = "") {
  const lines = script.split("\n");
  const structureLines = [];
  let inCreateBlock = false;

  for (const line of lines) {
    const trimmed = line.trim().toUpperCase();

    // Skip INSERT, COMMIT, and standalone SELECT lines
    if (
      trimmed.startsWith("INSERT ") ||
      trimmed.startsWith("COMMIT") ||
      (trimmed.startsWith("SELECT ") && !inCreateBlock)
    ) {
      continue;
    }

    // Track CREATE TABLE / ALTER TABLE blocks
    if (
      trimmed.startsWith("CREATE ") ||
      trimmed.startsWith("ALTER ")
    ) {
      inCreateBlock = true;
    }

    if (inCreateBlock) {
      structureLines.push(line);
    }

    // End of CREATE block (line ends with ; outside of parens)
    if (inCreateBlock && trimmed.endsWith(";")) {
      inCreateBlock = false;
      structureLines.push(""); // blank line separator
    }
  }

  return structureLines.join("\n").trim();
}
