import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-lg shadow-[#7c3aed]/20 font-semibold",
        secondary: "bg-[#1a2233] text-[#f1f5f9] hover:bg-[#252d3d] border border-[#252d3d]",
        outline: "border border-[#252d3d] bg-transparent hover:bg-[#1a2233] text-[#cbd5e1] hover:text-[#f1f5f9]",
        ghost: "hover:bg-[#1a2233] text-[#cbd5e1] hover:text-[#f1f5f9]",
        danger: "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-lg shadow-[#ef4444]/20",
        success: "bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-lg shadow-[#22c55e]/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
