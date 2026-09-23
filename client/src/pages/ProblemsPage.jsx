import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProblems, useTopics, useSolvedIds } from "../hooks/use-problems";
import { ProblemFilters } from "../components/problems/ProblemFilters";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { DIFFICULTY_CONFIG } from "../lib/constants";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileCode2,
  Sparkles,
  Tag,
  Layers,
} from "lucide-react";

export function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);

  const { data: topicsData } = useTopics();
  const { data: solvedData } = useSolvedIds();
  const { data, isLoading, isError, error } = useProblems({
    page,
    limit: pageSize,
    search: search || undefined,
    difficulty: difficulty || undefined,
    topic: selectedTopic || undefined,
  });

  const problems = data?.data || [];
  const pagination = data?.meta || { page: 1, totalPages: 1, total: 0 };
  const solvedIds = new Set(solvedData?.data || []);

  const totalResults = pagination.total || 0;
  const startItem = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalResults);

  // Generate page numbers range for pagination UI
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleTopicClick = (topicName) => {
    setSelectedTopic(topicName === selectedTopic ? "" : topicName);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252d3d] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#f1f5f9] tracking-tight">
              Oracle SQL Lab Problems
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40 font-mono font-medium">
              80 Practice Problems
            </span>
          </div>
          <p className="text-sm text-[#64748b] mt-1">
            Oracle SQL practical revision checklist — Structured by syllabus topics (excluding Views & Sequences)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#252d3d] bg-[#111827] px-3.5 py-2 text-xs text-[#cbd5e1] flex items-center gap-2.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[#a78bfa] font-medium">Oracle 21c XE Engine Ready</span>
          </div>
        </div>
      </div>

      {/* Modern Filter Hub */}
      <ProblemFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        difficulty={difficulty}
        setDifficulty={(val) => {
          setDifficulty(val);
          setPage(1);
        }}
        selectedTopic={selectedTopic}
        setSelectedTopic={(val) => {
          setSelectedTopic(val);
          setPage(1);
        }}
        pageSize={pageSize}
        setPageSize={(val) => {
          setPageSize(val);
          setPage(1);
        }}
        totalResults={totalResults}
      />

      {/* Problem Table Card */}
      <div className="rounded-xl border border-[#252d3d] bg-[#111827] overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Spinner size={36} />
            <p className="text-xs text-[#64748b] font-mono tracking-wide">
              Loading problem catalog...
            </p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-rose-400 font-medium">Failed to load problems</p>
            <p className="text-xs text-[#64748b]">
              {error?.message || "Please check server connection."}
            </p>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <FileCode2 size={48} className="mx-auto text-[#64748b]" />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-[#f1f5f9]">No problems match your filter</p>
              <p className="text-xs text-[#64748b] max-w-sm mx-auto">
                Try switching topics, clearing search terms, or resetting difficulty filters.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setDifficulty("");
                setSelectedTopic("");
                setPage(1);
              }}
              className="text-xs border-[#334155] text-[#cbd5e1] hover:text-white"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a2233] text-[11px] font-semibold uppercase tracking-wider text-[#64748b] border-b border-[#252d3d]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Problem Title</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Validation</th>
                  <th className="py-3.5 px-4">Topic Tags</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252d3d]/50 font-sans">
                {problems.map((p, idx) => {
                  const diffConf = DIFFICULTY_CONFIG[p.difficulty] || DIFFICULTY_CONFIG.easy;
                  const itemNumber = (page - 1) * pageSize + idx + 1;
                  const isSolved = solvedIds.has(p.id);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#1a2233]/60 transition-colors group"
                    >
                      <td className="py-4 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 size={18} className="mx-auto text-emerald-400" />
                        ) : (
                          <span className="block h-4 w-4 mx-auto rounded-full border border-[#252d3d] group-hover:border-[#7c3aed]/50 transition-colors" />
                        )}
                      </td>

                      <td className="py-4 px-4 text-center font-mono text-xs text-[#64748b]">
                        {itemNumber}
                      </td>

                      <td className="py-4 px-4 font-medium text-[#f1f5f9]">
                        <Link
                          to={`/problems/${p.slug}`}
                          className="hover:text-[#a78bfa] transition-colors flex items-center gap-2 group-hover:translate-x-0.5 transform transition-transform"
                        >
                          <span className="font-semibold text-sm">{p.title}</span>
                        </Link>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={p.difficulty}>
                          <span className={`h-1.5 w-1.5 rounded-full ${diffConf.dot} mr-1.5`} />
                          {diffConf.label}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] text-[#94a3b8] bg-[#1a2233] px-2.5 py-1 rounded border border-[#252d3d] uppercase tracking-wider font-semibold">
                          {p.validationType}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {p.topicTags?.map((tag) => {
                            const isTopicActive = selectedTopic === tag;
                            return (
                              <button
                                key={tag}
                                onClick={() => handleTopicClick(tag)}
                                className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer font-medium ${
                                  isTopicActive
                                    ? "bg-[#7c3aed]/30 text-[#a78bfa] border-[#7c3aed]"
                                    : "bg-[#1a2233] text-[#64748b] border-[#252d3d] hover:border-[#334155] hover:text-[#cbd5e1]"
                                }`}
                              >
                                #{tag}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link to={`/problems/${p.slug}`}>
                          {isSolved ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="border-emerald-500/30 text-emerald-400 hover:border-emerald-400/50 bg-emerald-500/10 text-xs font-semibold"
                            >
                              <CheckCircle2 size={13} className="mr-1.5" /> Solved
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="group-hover:bg-[#7c3aed] group-hover:text-white group-hover:border-[#7c3aed] text-xs font-medium transition-all shadow-sm"
                            >
                              Solve Problem →
                            </Button>
                          )}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Smart Interactive Pagination Footer */}
        {pagination.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#252d3d] bg-[#111827] px-4 py-3 sm:px-6">
            <div className="text-xs text-[#64748b]">
              Showing <span className="font-mono font-medium text-[#cbd5e1]">{startItem}</span> to{" "}
              <span className="font-mono font-medium text-[#cbd5e1]">{endItem}</span> of{" "}
              <span className="font-mono font-medium text-[#a78bfa]">{totalResults}</span> problems
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0 text-[#94a3b8] border-[#252d3d] disabled:opacity-30 cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft size={14} />
              </Button>

              {/* Prev Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="h-8 px-2.5 text-xs text-[#94a3b8] border-[#252d3d] disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={14} className="mr-0.5" /> Prev
              </Button>

              {/* Page Number Buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-[#7c3aed] text-white shadow-md shadow-[#7c3aed]/20"
                        : "bg-[#1a2233] text-[#94a3b8] border border-[#252d3d] hover:border-[#334155] hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={page >= pagination.totalPages}
                className="h-8 px-2.5 text-xs text-[#94a3b8] border-[#252d3d] disabled:opacity-30 cursor-pointer"
              >
                Next <ChevronRight size={14} className="ml-0.5" />
              </Button>

              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.totalPages)}
                disabled={page >= pagination.totalPages}
                className="h-8 w-8 p-0 text-[#94a3b8] border-[#252d3d] disabled:opacity-30 cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
