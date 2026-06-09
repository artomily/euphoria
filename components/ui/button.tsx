import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg",
        "motion-safe:transition-all motion-safe:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
        "motion-safe:active:scale-[0.98] motion-safe:active:translate-y-px",
        "disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: [
            "bg-accent-emerald text-white",
            "motion-safe:hover:bg-emerald-400",
          ],
          ghost: [
            "bg-transparent text-text-secondary",
            "motion-safe:hover:bg-white/5 motion-safe:hover:text-text-primary",
          ],
          outline: [
            "bg-transparent border border-border-subtle text-text-primary",
            "motion-safe:hover:bg-white/5 motion-safe:hover:border-white/20",
          ],
          destructive: [
            "bg-signal-sell text-white",
            "motion-safe:hover:bg-red-400",
          ],
        }[variant],
        {
          sm: "h-8 px-3 text-xs",
          md: "h-10 px-4 text-sm",
          lg: "h-12 px-6 text-base",
          icon: "h-9 w-9",
        }[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin" aria-hidden />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
