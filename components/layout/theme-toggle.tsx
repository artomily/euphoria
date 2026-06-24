"use client";

import { Moon, Sun } from "lucide-react";
import { useUI } from "./ui-context";
import { cn } from "@/lib/utils";

// A compact pill switch that flips between light and dark. The knob slides and
// swaps the Sun/Moon glyph; the whole control is a single accessible button.
export default function ThemeToggle() {
  const { theme, toggleTheme } = useUI();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40",
        isDark
          ? "bg-[var(--bg-elevated)] border-[var(--border)]"
          : "bg-[var(--bg-elevated)] border-[var(--border)]"
      )}
    >
      <span
        className={cn(
          "absolute flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-surface)] shadow-sm transition-transform",
          isDark ? "translate-x-6" : "translate-x-1"
        )}
      >
        {isDark ? (
          <Moon size={12} className="text-blue-300" aria-hidden />
        ) : (
          <Sun size={12} className="text-amber-500" aria-hidden />
        )}
      </span>
    </button>
  );
}
