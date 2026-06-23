"use client";

import { useRouter } from "next/navigation";
import { Zap, Search, Sparkles, Globe, BarChart2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const CHIPS = [
  { symbol: "BNB",  icon: Zap,        label: "BNB" },
  { symbol: "CAKE", icon: Search,      label: "CAKE" },
  { symbol: "BTC",  icon: BarChart2,   label: "BTC" },
  { symbol: "ETH",  icon: Sparkles,    label: "ETH" },
  { symbol: "PEPE", icon: TrendingUp,  label: "PEPE" },
  { symbol: "WRX",  icon: Globe,       label: "WRX" },
];

interface QuickChipsProps {
  tokens?: typeof CHIPS;
  /** When provided, selecting a chip analyzes inline instead of navigating. */
  onSelect?: (symbol: string) => void;
}

export default function QuickChips({ tokens = CHIPS, onSelect }: QuickChipsProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {tokens.map(({ symbol, icon: Icon, label }) => (
        <button
          key={symbol}
          onClick={() => (onSelect ? onSelect(symbol) : router.push(`/token/${symbol}`))}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
            "bg-white border border-[var(--border)] text-[var(--text-secondary)]",
            "hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
            "shadow-[var(--shadow-card)]",
            "transition-all cursor-pointer"
          )}
        >
          <Icon size={12} className="shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
