"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Chip {
  symbol: string;
  price_change_24h?: number;
}

// Shown immediately while the live feed loads (and if it fails). These all
// resolve to real BNB-Chain market data — the search bar handles any other token.
const FALLBACK: Chip[] = [
  { symbol: "BNB" },
  { symbol: "BTC" },
  { symbol: "ETH" },
  { symbol: "SOL" },
  { symbol: "CAKE" },
  { symbol: "XRP" },
  { symbol: "DOGE" },
  { symbol: "LINK" },
];

// Rounds first, then derives the sign — so a value like -0.02 reads "+0.0%"
// instead of an awkward "-0.0%".
function ChangePct({ value }: { value: number }) {
  const rounded = Number(value.toFixed(1));
  const positive = rounded >= 0;
  return (
    <span
      className={cn(
        "font-mono text-[11px]",
        positive ? "text-signal-buy" : "text-signal-sell",
      )}
    >
      {positive ? "+" : ""}
      {rounded.toFixed(1)}%
    </span>
  );
}

interface QuickChipsProps {
  /** When provided, selecting a chip analyzes inline instead of navigating. */
  onSelect?: (symbol: string) => void;
}

export default function QuickChips({ onSelect }: QuickChipsProps) {
  const router = useRouter();
  const [chips, setChips] = useState<Chip[]>(FALLBACK);

  // Pull live, volume-ranked tokens so the featured set reflects real market
  // activity rather than a fixed list. Falls back silently to FALLBACK.
  useEffect(() => {
    let active = true;
    fetch("/api/trending")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { tokens?: Chip[] } | null) => {
        if (active && data?.tokens && data.tokens.length > 0) setChips(data.tokens);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {chips.map(({ symbol, price_change_24h }) => (
        <button
          key={symbol}
          onClick={() => (onSelect ? onSelect(symbol) : router.push(`/token/${symbol}`))}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm",
            "bg-white border border-[var(--border)] text-[var(--text-secondary)]",
            "hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
            "shadow-[var(--shadow-card)] transition-all cursor-pointer",
          )}
        >
          <span className="font-mono font-semibold text-[var(--text-primary)]">{symbol}</span>
          {typeof price_change_24h === "number" && (
            <ChangePct value={price_change_24h} />
          )}
        </button>
      ))}
    </div>
  );
}
