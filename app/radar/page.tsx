import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = { title: "FOMO Radar" };

const NARRATIVES = [
  {
    name: "AI & Machine Learning",
    category: "AI" as const,
    heat: 87,
    tokens: ["FET", "AGIX", "OCEAN", "NMR"],
    trend: "up",
    summary: "AI narrative at peak heat. Multiple tokens hitting all-time highs on BNB Chain. Institutional inflows detected.",
    change24h: +14,
  },
  {
    name: "DeFi Protocols",
    category: "DeFi" as const,
    heat: 74,
    tokens: ["CAKE", "BSW", "XVS", "ALPACA"],
    trend: "up",
    summary: "DeFi TVL recovering strongly. PancakeSwap v3 driving volume. Yield farming narratives resurgent.",
    change24h: +8,
  },
  {
    name: "RWA Tokenization",
    category: "RWA" as const,
    heat: 68,
    tokens: ["ONDO", "RIO", "CFG", "MPX"],
    trend: "up",
    summary: "Real-world assets gaining traction as institutional capital seeks on-chain yield products.",
    change24h: +5,
  },
  {
    name: "Memecoins",
    category: "Memecoin" as const,
    heat: 61,
    tokens: ["PEPE", "FLOKI", "BONK", "SHIB"],
    trend: "down",
    summary: "Memecoin enthusiasm cooling after recent rally. Retail sentiment shifting toward fundamentals.",
    change24h: -3,
  },
  {
    name: "DePIN",
    category: "DePIN" as const,
    heat: 55,
    tokens: ["IOTX", "HNT", "MOBILE", "FIL"],
    trend: "up",
    summary: "Decentralized infrastructure narrative building quietly. Undervalued vs. AI sector.",
    change24h: +2,
  },
  {
    name: "Gaming & Metaverse",
    category: "Gaming" as const,
    heat: 43,
    tokens: ["AXS", "SAND", "MANA", "GALA"],
    trend: "down",
    summary: "Gaming season has not yet arrived. Waiting for major title launches to catalyze narrative.",
    change24h: -6,
  },
  {
    name: "Layer 2 Scaling",
    category: "Layer2" as const,
    heat: 38,
    tokens: ["ARB", "OP", "MATIC", "METIS"],
    trend: "down",
    summary: "L2 tokens underperforming as ETH ecosystem attention consolidates around blob scaling.",
    change24h: -4,
  },
  {
    name: "Layer 1 Chains",
    category: "Layer1" as const,
    heat: 31,
    tokens: ["BNB", "SOL", "AVAX", "ATOM"],
    trend: "down",
    summary: "L1 rotation has paused. Capital consolidating in yield-bearing assets and AI narratives.",
    change24h: -9,
  },
];

function HeatGradient({ score }: { score: number }) {
  const color =
    score >= 80 ? "#ef4444" :
    score >= 60 ? "#f97316" :
    score >= 40 ? "#eab308" :
    score >= 20 ? "#84cc16" :
    "#10b981";
  return (
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex-1">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${score}%`, background: color }}
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

function HeatLabel({ score }: { score: number }) {
  if (score >= 80) return <span className="text-red-400 font-mono text-xs">Euphoria</span>;
  if (score >= 60) return <span className="text-orange-400 font-mono text-xs">FOMO</span>;
  if (score >= 40) return <span className="text-yellow-400 font-mono text-xs">Bullish</span>;
  if (score >= 20) return <span className="text-lime-400 font-mono text-xs">Interest</span>;
  return <span className="text-emerald-400 font-mono text-xs">Calm</span>;
}

export default function RadarPage() {
  const globalFomo = Math.round(
    NARRATIVES.reduce((sum, n) => sum + n.heat, 0) / NARRATIVES.length
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="FOMO Radar" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent-emerald" aria-hidden />
                  FOMO Radar
                </h1>
                <p className="text-sm text-text-secondary mt-0.5">
                  Live narrative heat across 8 market themes, sorted by crowd energy.
                </p>
              </div>
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-4">
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Global Index</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-semibold text-orange-400">{globalFomo}</span>
                    <HeatLabel score={globalFomo} />
                  </div>
                </div>
                <div className="w-px h-8 bg-border-subtle" aria-hidden />
                <div>
                  <div className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">Hot Sector</div>
                  <Badge variant="narrative">AI</Badge>
                </div>
              </div>
            </div>

            {/* Narrative grid */}
            <div className="grid sm:grid-cols-2 gap-4" role="list" aria-label="Narrative heat cards">
              {NARRATIVES.map(({ name, heat, tokens, trend, summary, change24h }) => (
                <article
                  key={name}
                  className="glass rounded-xl p-5 hover:border-white/[0.12] motion-safe:transition-colors motion-safe:duration-150"
                  role="listitem"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {trend === "up" ? (
                          <TrendingUp className="w-3.5 h-3.5 text-accent-emerald shrink-0" aria-hidden />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden />
                        )}
                        <h2 className="text-sm font-medium text-text-primary">{name}</h2>
                      </div>
                      <HeatLabel score={heat} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-semibold text-text-primary">{heat}</div>
                      <div className={`text-xs font-mono ${change24h >= 0 ? "text-accent-emerald" : "text-signal-sell"}`}>
                        {change24h >= 0 ? "+" : ""}{change24h}% 24h
                      </div>
                    </div>
                  </div>

                  {/* Heat bar */}
                  <div className="flex items-center gap-2 mb-4">
                    <HeatGradient score={heat} />
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">{summary}</p>

                  {/* Token pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {tokens.map((token) => (
                      <Link
                        key={token}
                        href={`/token/${token}`}
                        className="font-mono text-[10px] px-2 py-1 rounded-md bg-white/5 border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/8 hover:border-white/15 motion-safe:transition-all motion-safe:duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-emerald"
                      >
                        {token}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-text-muted pb-2">
              <strong className="text-text-secondary">Not financial advice.</strong>{" "}
              Heat scores reflect AI-analyzed crowd psychology signals, updated every 10 minutes by the FOMO cron job.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
