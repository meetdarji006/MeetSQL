import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProblems, useTopics, useSolvedIds } from "../hooks/use-problems";
import { ProblemFilters } from "../components/problems/ProblemFilters";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { DIFFICULTY_CONFIG } from "../lib/constants";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, FileCode2, Terminal } from "lucide-react";

export function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [page, setPage] = useState(1);

  const { data: topicsData } = useTopics();
  const { data: solvedData } = useSolvedIds();
  const { data, isLoading, isError, error } = useProblems({
    page,
    limit: 15,
    search: search || undefined,
    difficulty: difficulty || undefined,
    topic: selectedTopic || undefined,
  });

  const problems = data?.data || [];
  const pagination = data?.meta || { page: 1, totalPages: 1, total: 0 };
  const topics = topicsData?.data || [];
  const solvedIds = new Set(solvedData?.data || []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252d3d] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#f1f5f9] tracking-tight">
            SQL Problem Catalog
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Master Oracle SQL queries, DML modifications, and DDL schema designs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-[#252d3d] bg-[#111827] px-3 py-1.5 text-xs text-[#cbd5e1] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[#a78bfa]">Oracle 21c XE Engine Active</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <ProblemFilters
        search={search}
        setSearch={(val) => { setSearch(val); setPage(1); }}
        difficulty={difficulty}
        setDifficulty={(val) => { setDifficulty(val); setPage(1); }}
        selectedTopic={selectedTopic}
        setSelectedTopic={(val) => { setSelectedTopic(val); setPage(1); }}
        topics={topics}
      /> */}

      {/* Table Container */}
      <div className="rounded-xl border border-[#252d3d] bg-[#111827] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <Spinner size={32} />
            <p className="text-xs text-[#64748b] font-mono">Fetching problem catalog...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-red-400 font-medium">Failed to load problems</p>
            <p className="text-xs text-[#64748b]">{error?.message || "Please check your connection."}</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileCode2 size={40} className="mx-auto text-[#64748b]" />
            <p className="text-base font-semibold text-[#f1f5f9]">No problems matched your query</p>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto">
              Try adjusting your topic tags, difficulty filter, or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a2233] text-xs font-semibold uppercase tracking-wider text-[#64748b] border-b border-[#252d3d]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Validation</th>
                  <th className="py-3.5 px-4">Topics</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252d3d]/50 font-sans">
                {problems.map((p, idx) => {
                  const diffConf = DIFFICULTY_CONFIG[p.difficulty] || DIFFICULTY_CONFIG.easy;
                  const itemNumber = (pagination.page - 1) * 15 + idx + 1;
                  const isSolved = solvedIds.has(p.id);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#1a2233]/50 transition-colors group"
                    >
                      <td className="py-4 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 size={18} className="mx-auto text-green-400" />
                        ) : (
                          <span className="block h-[18px] w-[18px] mx-auto rounded-full border border-[#252d3d]" />
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
                          <span>{p.title}</span>
                        </Link>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={p.difficulty}>
                          <span className={`h-1.5 w-1.5 rounded-full ${diffConf.dot} mr-1.5`} />
                          {diffConf.label}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono text-xs text-[#64748b] bg-[#1a2233] px-2 py-0.5 rounded border border-[#252d3d]">
                          {p.validationType}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.topicTags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2 py-0.5 rounded bg-[#1a2233] text-[#64748b] border border-[#252d3d]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link to={`/problems/${p.slug}`}>
                          {isSolved ? (
                            <Button size="sm" variant="secondary" className="border-green-500/30 text-green-400 hover:border-green-400/50">
                              <CheckCircle2 size={14} className="mr-1" /> Solved
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" className="group-hover:border-[#7c3aed]/40 group-hover:text-white">
                              Solve →
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

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#252d3d] bg-[#111827] px-4 py-3 sm:px-6">
            <div className="text-xs text-[#64748b]">
              Showing page <span className="font-mono text-[#cbd5e1]">{pagination.page}</span> of{" "}
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
