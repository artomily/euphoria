"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { isPolymarketUrl, parsePolymarketSlug } from "@/lib/predictions";

interface TokenSearchBarProps {
  className?: string;
}

export default function TokenSearchBar({ className }: TokenSearchBarProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  // A pasted Polymarket link switches the bar into "Scan FOMO" mode.
  const isPolymarket = isPolymarketUrl(value);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = value.trim();
    if (!raw) return;

    if (isPolymarket) {
      const slug = parsePolymarketSlug(raw);
      if (slug) {
        setValue("");
        router.push(`/predictions?m=${encodeURIComponent(slug)}`);
        return;
      }
    }

    setValue("");
    router.push(`/token/${raw.toUpperCase()}`);
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
      {isPolymarket ? (
        <Scale size={15} className="text-blue-500 shrink-0" aria-hidden />
      ) : (
        <Search size={15} className="text-[var(--text-muted)] shrink-0" aria-hidden />
      )}

      <label htmlFor="token-search" className="sr-only">
        Token symbol or Polymarket link
      </label>
      <input
        id="token-search"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search a token or paste a Polymarket link…"
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
          "shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40",
          value.trim()
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-gray-200"
        )}
      >
        {isPolymarket ? "Scan FOMO" : value.trim() ? "Analyze" : "Fast"}
      </button>
    </form>
  );
}
