"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

const QUICK_PICKS = ["CAKE", "FET", "BNB", "FLOKI", "ONDO"] as const;

export function TokenSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const symbol = value.trim().toUpperCase();
    if (symbol) router.push(`/token/${symbol}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            aria-hidden
          />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter token symbol (e.g. CAKE, BNB, FET)"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-emerald focus:border-transparent motion-safe:transition-colors motion-safe:duration-100"
            autoComplete="off"
            aria-label="Token symbol to analyze"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent-emerald text-white text-sm font-medium motion-safe:transition-all motion-safe:duration-100 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base active:scale-[0.98]"
          disabled={!value.trim()}
        >
          Analyze
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </button>
      </form>

      <p className="text-xs text-text-muted mt-3">
        Quick picks:{" "}
        {QUICK_PICKS.map((s) => (
          <Link
            key={s}
            href={`/token/${s}`}
            className="font-mono text-text-secondary hover:text-accent-emerald motion-safe:transition-colors motion-safe:duration-100 mr-2 focus-visible:outline-none focus-visible:text-accent-emerald focus-visible:rounded"
          >
            {s}
          </Link>
        ))}
      </p>
    </div>
  );
}
