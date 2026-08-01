import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#252d3d] bg-[#1a2233] px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#64748b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
