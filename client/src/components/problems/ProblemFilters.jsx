import React from "react";
import { Search, X, Tag, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const MAIN_PDF_TOPICS = [
  "Basic SQL",
  "DDL & DML",
  "Constraints",
  "Functions",
  "GROUP BY & HAVING",
  "Joins",
  "Subqueries",
  "Set Operations",
];

export function ProblemFilters({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedTopic,
  setSelectedTopic,
  topics = [],
}) {
  const difficulties = [
    { value: "", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const handleReset = () => {
    setSearch("");
    setDifficulty("");
    setSelectedTopic("");
  };

  const hasActiveFilters = search || difficulty || selectedTopic;

  // Merge available topics from backend with main syllabus topics
  const displayTopics = Array.from(new Set([...MAIN_PDF_TOPICS, ...topics]));

  return (
    <div className="space-y-4 rounded-xl border border-[#252d3d] bg-[#111827] p-5 shadow-lg">
      {/* Search & Difficulty Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <Input
            type="text"
            placeholder="Search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a2233] border-[#252d3d] text-[#f1f5f9] placeholder:text-[#64748b] focus:border-[#7c3aed]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Difficulty Filter Buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-[#252d3d] bg-[#1a2233] p-1 overflow-x-auto shrink-0">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                difficulty === d.value
                  ? "bg-[#7c3aed] text-white shadow-md font-semibold"
                  : "text-[#64748b] hover:text-[#cbd5e1]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-[#64748b] hover:text-white hover:bg-red-500/10 text-xs h-10 px-3 transition-colors"
          >
            <X size={14} className="mr-1" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Topic Filter Buttons Bar */}
      <div className="pt-3 border-t border-[#252d3d]/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#94a3b8] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            <Filter size={13} className="text-[#a78bfa]" /> Filter by Topic ({displayTopics.length}):
          </span>
          {selectedTopic && (
            <span className="text-xs text-[#a78bfa] bg-[#7c3aed]/10 px-2 py-0.5 rounded border border-[#7c3aed]/30 font-mono">
              Active: {selectedTopic}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 max-h-40 overflow-y-auto pr-1 py-1 custom-scrollbar">
          <button
            onClick={() => setSelectedTopic("")}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
              !selectedTopic
                ? "bg-[#7c3aed] text-white border-[#7c3aed] shadow-sm"
                : "bg-[#1a2233] text-[#94a3b8] border-[#252d3d] hover:border-[#334155] hover:text-[#cbd5e1]"
            }`}
          >
            All Topics
          </button>

          {displayTopics.map((topic) => {
            const isSelected = selectedTopic === topic;
            const isMainSyllabus = MAIN_PDF_TOPICS.includes(topic);

            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(isSelected ? "" : topic)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#7c3aed] text-white border-[#7c3aed] shadow-md ring-2 ring-[#7c3aed]/30"
                    : isMainSyllabus
                    ? "bg-[#1e293b] text-[#cbd5e1] border-[#334155] hover:border-[#7c3aed]/50 hover:text-white"
                    : "bg-[#1a2233] text-[#64748b] border-[#252d3d] hover:border-[#334155] hover:text-[#cbd5e1]"
                }`}
              >
                <Tag size={11} className={isSelected ? "text-white" : "text-[#a78bfa]"} />
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

