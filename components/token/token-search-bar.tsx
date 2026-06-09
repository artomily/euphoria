"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenSearchBarProps {
  className?: string;
}

export default function TokenSearchBar({ className }: TokenSearchBarProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const symbol = value.trim().toUpperCase();
    if (symbol) {
      setValue("");
      router.push(`/token/${symbol}`);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-2xl",
        "bg-white border border-[var(--border)]",
        "shadow-[var(--shadow-elevated)]",
        "focus-within:ring-2 focus-within:ring-blue-400/20 focus-within:border-blue-300",
        "transition-all",
        className
      )}
    >
      <Search size={15} className="text-[var(--text-muted)] shrink-0" />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask AI or give instructions..."
        className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none min-w-0"
      />

      {/* Model selector */}
      <button
        type="button"
        className="flex items-center gap-1 shrink-0 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border-r border-[var(--border)] pr-3 mr-1"
      >
        Core Intelligence
        <ChevronDown size={11} />
      </button>

      {/* Submit / mode toggle */}
      <button
        type="submit"
        className={cn(
          "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
          value.trim()
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-gray-200"
        )}
      >
        {value.trim() ? "Analyze" : "Fast"}
      </button>
    </form>
  );
}
