import React from "react";
import { Search, X, Tag } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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

  return (
    <div className="space-y-4 rounded-xl border border-[#252d3d] bg-[#111827] p-4">
      {/* Top row: search + difficulty selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
          <Input
            type="text"
            placeholder="Search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#1a2233]"
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

        {/* Difficulty pills */}
        <div className="flex items-center gap-1 rounded-lg border border-[#252d3d] bg-[#1a2233] p-1 overflow-x-auto">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                difficulty === d.value
                  ? "bg-[#7c3aed] text-white shadow"
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
            className="text-[#64748b] hover:text-white text-xs h-10 px-3"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Topic Tags Pills */}
      {topics.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-[#252d3d]/50 overflow-x-auto pb-1">
          <span className="text-xs text-[#64748b] flex items-center gap-1 shrink-0 font-medium">
            <Tag size={12} /> Topics:
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedTopic("")}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                !selectedTopic
                  ? "bg-[#252d3d] text-white border-[#334155]"
                  : "bg-transparent text-[#64748b] border-transparent hover:text-[#cbd5e1]"
              }`}
            >
              All Topics
            </button>

            {topics.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTopic(tag === selectedTopic ? "" : tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedTopic === tag
                    ? "bg-[#7c3aed]/20 text-[#a78bfa] border-[#7c3aed]/40 font-medium"
                    : "bg-[#1a2233] text-[#64748b] border-[#252d3d] hover:border-[#334155] hover:text-[#cbd5e1]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
