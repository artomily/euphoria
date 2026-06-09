import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "buy" | "sell" | "watch" | "narrative" | "muted";
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium font-mono",
        {
          default: "bg-white/10 text-text-primary",
          buy: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
          sell: "bg-red-500/15 text-red-400 border border-red-500/20",
          watch: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
          narrative: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
          muted: "bg-white/5 text-text-muted",
        }[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
