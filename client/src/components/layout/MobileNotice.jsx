import React from "react";
import { Monitor, Tablet, Smartphone, AlertTriangle, Terminal, Sparkles, MoveRight } from "lucide-react";

export function MobileNotice() {
  return (
    <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19] p-6 text-center select-none overflow-y-auto">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#7c3aed]/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative max-w-md w-full rounded-2xl border border-[#252d3d] bg-[#111827]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Animated Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7c3aed]/15 border border-[#7c3aed]/40 text-[#a78bfa] text-xs font-semibold font-mono tracking-wide">
          <Terminal size={14} className="animate-pulse text-[#a78bfa]" />
          <span>MeetSQL IDE Experience</span>
        </div>

        {/* Hero Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1a2233] to-[#252d3d] border border-[#334155] flex items-center justify-center shadow-inner">
          <Monitor size={36} className="text-[#a78bfa] drop-shadow-md" />
          <div className="absolute -bottom-1 -right-1 bg-amber-500/20 border border-amber-500/40 p-1.5 rounded-full">
            <AlertTriangle size={14} className="text-amber-400" />
          </div>
        </div>

        {/* Heading & Explanation */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#f1f5f9] tracking-tight">
            Please Open on Desktop or Tablet
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
            MeetSQL features an interactive Oracle 21c SQL query editor, schema table inspector, and detailed query validation diffs designed for larger screens.
          </p>
        </div>

        {/* Supported Devices Cards */}
        <div className="space-y-2 text-left text-xs font-medium">
          <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <div className="flex items-center gap-2.5">
              <Monitor size={16} />
              <span>Desktops & Laptops</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 uppercase">
              Recommended
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
            <div className="flex items-center gap-2.5">
              <Tablet size={16} />
              <span>Tablets & iPads</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/40 uppercase">
              Supported
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 opacity-80">
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} />
              <span>Mobile Phones</span>
            </div>
            <span className="text-[10px] font-mono bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40 uppercase">
              Restricted
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#252d3d]/60 text-[11px] text-[#64748b] flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-[#a78bfa]" />
          <span>Switch to a tablet (iPad) or desktop browser to continue</span>
        </div>
      </div>
    </div>
  );
}
