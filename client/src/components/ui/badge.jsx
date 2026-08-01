import * as React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-[#1a2233] text-[#cbd5e1] border-[#252d3d]",
    easy: "bg-green-500/10 text-green-400 border-green-500/20 font-medium",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium",
    hard: "bg-red-500/10 text-red-400 border-red-500/20 font-medium",
    violet: "bg-[#7c3aed]/10 text-[#a78bfa] border-[#7c3aed]/20 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
