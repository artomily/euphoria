"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Link2, Scale, ArrowRight } from "lucide-react";
import { parseBinanceSlug } from "@/lib/predictions";
import { cn } from "@/lib/utils";

interface PredictionPasteBarProps {
  className?: string;
  autoFocus?: boolean;
}

const EXAMPLE = "https://www.binance.com/en/prediction/will-bitcoin-hit-150k-by-2026";

export default function PredictionPasteBar({ className, autoFocus }: PredictionPasteBarProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function submit(input: string) {
    const slug = parseBinanceSlug(input);
    if (!slug) {
      setError("Paste a valid Binance Prediction link or market slug.");
      return;
    }
    setError(null);
    router.push(`/predictions?m=${encodeURIComponent(slug)}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(value);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-2xl bg-white",
          "border border-[var(--border)] shadow-[var(--shadow-elevated)]",
          "focus-within:ring-2 focus-within:ring-blue-400/20 focus-within:border-blue-300 transition-all",
          error && "border-red-300 focus-within:ring-red-400/20"
        )}
      >
        <Link2 size={16} className="text-[var(--text-muted)] shrink-0" aria-hidden />

        <label htmlFor="polymarket-url" className="sr-only">
          Binance Prediction link
        </label>
        <input
          id="binance-url"
          type="text"
          inputMode="url"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste a Binance Prediction bet link…"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "binance-error" : undefined}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none min-w-0"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40",
            value.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
          )}
        >
          <Scale size={13} aria-hidden />
          Scan FOMO
        </button>
      </form>

      {error ? (
        <p id="binance-error" className="text-xs text-red-500 px-1">
          {error}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setValue(EXAMPLE);
            submit(EXAMPLE);
          }}
          className="group flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-1 w-fit transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 rounded"
        >
          Try an example
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" aria-hidden />
        </button>
      )}
    </div>
  );
}
