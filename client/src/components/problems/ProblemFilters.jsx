import React from "react";
import { Search, X, Filter, Sparkles, BookOpen, Layers, Zap, Hash, Database, Link as JoinIcon, FileCode, Split } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SYLLABUS_TOPICS = [
  { id: "Basic SQL", label: "Basic SQL", icon: Zap, color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { id: "DDL & DML", label: "DDL & DML", icon: Database, color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "Constraints", label: "Constraints", icon: Layers, color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30" },
  { id: "Functions", label: "Functions", icon: Hash, color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30" },
  { id: "GROUP BY & HAVING", label: "GROUP BY & HAVING", icon: Sparkles, color: "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30" },
  { id: "Joins", label: "Joins", icon: JoinIcon, color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30" },
  { id: "Subqueries", label: "Subqueries", icon: FileCode, color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30" },
  { id: "Set Operations", label: "Set Operations", icon: Split, color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30" },
];

export function ProblemFilters({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedTopic,
  setSelectedTopic,
  pageSize,
  setPageSize,
  totalResults,
}) {
  const difficulties = [
    { value: "", label: "All Difficulties", color: "hover:border-[#334155]" },
    { value: "easy", label: "Easy", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
    { value: "medium", label: "Medium", color: "text-amber-400 border-amber-500/40 bg-amber-500/10" },
    { value: "hard", label: "Hard", color: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
  ];

  const pageSizes = [10, 15, 25, 50];

  const handleReset = () => {
    setSearch("");
    setDifficulty("");
    setSelectedTopic("");
  };

  const hasActiveFilters = Boolean(search || difficulty || selectedTopic);

  return (
    <div className="space-y-6">
      {/* ─── Top Category Topic Hub ─────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#a78bfa]" />
            <h2 className="text-sm font-semibold tracking-wide text-[#cbd5e1] uppercase">
              Oracle Exam Syllabus Topics
            </h2>
          </div>
          {selectedTopic && (
            <button
              onClick={() => setSelectedTopic("")}
              className="text-xs text-[#a78bfa] hover:text-white transition-colors underline cursor-pointer"
            >
              Reset Topic Filter
            </button>
          )}
        </div>

        {/* Scrollable / Grid Topic Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          <button
            onClick={() => setSelectedTopic("")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer group ${
              !selectedTopic
                ? "bg-gradient-to-b from-[#7c3aed]/30 to-[#6d28d9]/20 border-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/10 ring-1 ring-[#7c3aed]/50 font-semibold"
                : "bg-[#111827] text-[#94a3b8] border-[#252d3d] hover:border-[#334155] hover:bg-[#1a2233] hover:text-[#f1f5f9]"
            }`}
          >
            <Sparkles size={16} className={!selectedTopic ? "text-[#a78bfa]" : "text-[#64748b] group-hover:text-[#a78bfa]"} />
            <span className="text-xs font-medium mt-1.5 line-clamp-1">All Topics</span>
            <span className="text-[10px] font-mono mt-0.5 text-[#64748b]">80 Problems</span>
          </button>

          {SYLLABUS_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopic === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(isSelected ? "" : topic.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer group relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-b from-[#7c3aed]/30 to-[#6d28d9]/20 border-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/15 ring-2 ring-[#7c3aed]/50 font-semibold"
                    : "bg-[#111827] text-[#94a3b8] border-[#252d3d] hover:border-[#334155] hover:bg-[#1a2233] hover:text-[#f1f5f9]"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-[#a78bfa]" : "text-[#64748b] group-hover:text-[#a78bfa]"} />
                <span className="text-xs font-medium mt-1.5 line-clamp-1">{topic.label}</span>
                <span className="text-[10px] font-mono mt-0.5 text-[#64748b]">10 Problems</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Search & Control Panel Header ─────────────────────────── */}
      <div className="rounded-xl border border-[#252d3d] bg-[#111827]/90 p-4 space-y-3 backdrop-blur shadow-md">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <Input
              type="text"
              placeholder="Search problem title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-9 bg-[#1a2233] border-[#252d3d] text-[#f1f5f9] placeholder:text-[#64748b] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] h-10 rounded-lg text-xs sm:text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-[#252d3d] bg-[#1a2233] p-1">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    difficulty === d.value
                      ? "bg-[#7c3aed] text-white shadow-sm font-semibold"
                      : "text-[#64748b] hover:text-[#cbd5e1]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Page Size Dropdown */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#252d3d] bg-[#1a2233] px-2.5 py-1 text-xs text-[#94a3b8]">
              <span className="hidden sm:inline">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-transparent text-[#f1f5f9] font-mono focus:outline-none cursor-pointer"
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size} className="bg-[#111827] text-white">
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 h-9 px-3 transition-colors cursor-pointer"
              >
                <X size={13} className="mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#252d3d]/50 text-xs">
            <span className="text-[#64748b] font-medium flex items-center gap-1">
              <Filter size={12} /> Active Filters:
            </span>

            {selectedTopic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40 font-medium">
                Topic: {selectedTopic}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setSelectedTopic("")}
                />
              </span>
            )}

            {difficulty && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-medium capitalize">
                Difficulty: {difficulty}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setDifficulty("")}
                />
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                Search: "{search}"
                <X
                  size={12}
                  className="cursor-pointer hover:text-white"
                  onClick={() => setSearch("")}
                />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
