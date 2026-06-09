import {
  TrendingUp,
  AlertTriangle,
  Flame,
  Users,
  Activity,
  ExternalLink,
} from "lucide-react";
import type { BetFomoAnalysis } from "@/lib/predictions";
import { DATA_SOURCES } from "@/lib/data-sources";
import { formatUSD, formatNumber, fomoLevelLabel } from "@/lib/format";
import DataSources from "@/components/agents/data-sources";
import { cn } from "@/lib/utils";

interface BetFomoCardProps {
  analysis: BetFomoAnalysis;
}

const VERDICT_STYLES: Record<
  BetFomoAnalysis["verdict"],
  { label: string; chip: string; bar: string; note: string }
> = {
  FADE: {
    label: "Fade the Crowd",
    chip: "bg-red-50 text-red-700 border-red-200",
    bar: "bg-red-500",
    note: "text-red-600",
  },
  FOLLOW: {
    label: "Follow the Momentum",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    note: "text-emerald-600",
  },
  WATCH: {
    label: "Watch & Wait",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
    note: "text-amber-600",
  },
};

function fomoBarColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 40) return "#eab308";
  if (score >= 20) return "#84cc16";
  return "#10b981";
}

export default function BetFomoCard({ analysis }: BetFomoCardProps) {
  const {
    market,
    fomoScore,
    crowdLean,
    crowdConfidence,
    socialMentions24h,
    mentionChange,
    drivers,
    contrarian,
    verdict,
    verdictReason,
    sources,
  } = analysis;
  const v = VERDICT_STYLES[verdict];
  const barColor = fomoBarColor(fomoScore);
  const polymarketUrl = `${DATA_SOURCES.polymarket.url}/event/${market.slug}`;

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)] overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            style={{
              background: DATA_SOURCES.polymarket.bg,
              color: DATA_SOURCES.polymarket.color,
              borderColor: "transparent",
            }}
          >
            {market.category}
          </span>
          <span className="text-xs text-[var(--text-muted)]">Resolves {market.endsAt}</span>
          <a
            href={polymarketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 rounded"
          >
            View on Polymarket
            <ExternalLink size={12} aria-hidden />
          </a>
        </div>

        <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight leading-snug">
          {market.question}
        </h2>

        {/* Market stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-3 py-2.5">
            <p className="text-[11px] text-[var(--text-muted)]">On-book YES</p>
            <p className="font-mono text-lg font-semibold text-[var(--text-primary)] tabular-nums">
              {market.yesPrice}%
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-3 py-2.5">
            <p className="text-[11px] text-[var(--text-muted)]">24h Volume</p>
            <p className="font-mono text-lg font-semibold text-[var(--text-primary)] tabular-nums">
              {formatUSD(market.volumeUsd)}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-app)] px-3 py-2.5">
            <p className="text-[11px] text-[var(--text-muted)]">Liquidity</p>
            <p className="font-mono text-lg font-semibold text-[var(--text-primary)] tabular-nums">
              {formatUSD(market.liquidityUsd)}
            </p>
          </div>
        </div>
      </div>

      {/* FOMO score */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-end justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame size={16} style={{ color: barColor }} aria-hidden />
            <span className="text-sm font-medium text-[var(--text-primary)]">Bet FOMO Score</span>
          </div>
          <div className="text-right">
            <span className="font-mono text-3xl font-bold tabular-nums" style={{ color: barColor }}>
              {fomoScore}
            </span>
            <span className="text-sm text-[var(--text-muted)] font-mono">/100</span>
          </div>
        </div>
        <div
          className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden"
          role="progressbar"
          aria-valuenow={fomoScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Bet FOMO score"
        >
          <div className="h-full rounded-full" style={{ width: `${fomoScore}%`, background: barColor }} />
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Crowd energy is{" "}
          <span className="font-medium" style={{ color: barColor }}>
            {fomoLevelLabel(fomoScore)}
          </span>{" "}
          — heavily leaning{" "}
          <span className="font-semibold text-[var(--text-primary)]">{crowdLean}</span> at{" "}
          <span className="font-mono tabular-nums">{crowdConfidence}%</span> conviction.
        </p>

        {/* Crowd lean meter */}
        <div className="mt-4 flex items-center gap-3">
          <Users size={15} className="text-[var(--text-muted)] shrink-0" aria-hidden />
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
              <span className={cn(crowdLean === "YES" && "text-emerald-600 font-medium")}>
                YES {crowdLean === "YES" ? crowdConfidence : 100 - crowdConfidence}%
              </span>
              <span className={cn(crowdLean === "NO" && "text-red-600 font-medium")}>
                NO {crowdLean === "NO" ? crowdConfidence : 100 - crowdConfidence}%
              </span>
            </div>
            <div className="flex h-1.5 rounded-full overflow-hidden bg-red-100">
              <div
                className="bg-emerald-500"
                style={{ width: `${crowdLean === "YES" ? crowdConfidence : 100 - crowdConfidence}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] shrink-0">
            <Activity size={13} aria-hidden />
            <span className="font-mono tabular-nums">{formatNumber(socialMentions24h)}</span>
            <span className="text-emerald-600 font-mono">+{mentionChange}%</span>
          </div>
        </div>
      </div>

      {/* Drivers vs contrarian */}
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-subtle)]">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-3">
            <TrendingUp size={14} aria-hidden />
            FOMO Drivers
          </div>
          <ul className="space-y-2">
            {drivers.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-emerald-500 mt-0.5 shrink-0" aria-hidden>
                  ›
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mb-3">
            <AlertTriangle size={14} aria-hidden />
            Contrarian Signals
          </div>
          <ul className="space-y-2">
            {contrarian.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <AlertTriangle size={12} className="text-red-400 mt-1 shrink-0" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verdict */}
      <div className="p-5 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-app)]">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border", v.chip)}>
            {v.label}
          </span>
          <span className="text-xs text-[var(--text-muted)]">Judge synthesis</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{verdictReason}</p>

        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <DataSources sources={sources} variant="detailed" label="Analyzed from" />
        </div>

        <p className="mt-4 text-xs text-[var(--text-muted)] leading-relaxed">
          <strong className="text-[var(--text-secondary)]">Not financial advice.</strong> Euphoria
          scores crowd psychology around a bet — not the outcome. Prediction markets are speculative;
          never wager more than you can lose.
        </p>
      </div>
    </article>
  );
}
