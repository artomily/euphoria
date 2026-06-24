import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { computeNarrativeHeat } from "@/lib/radar";

export const metadata: Metadata = { title: "FOMO Radar" };

// Heat is recomputed from live market data every 10 minutes.
export const revalidate = 600;

// Narrative definitions — the basket and copy are curated; heat / 24h change /
// trend are derived live from each basket's real market data (see lib/radar.ts).
// `baselineHeat` is only used as a fallback when no token in the basket resolves.
const NARRATIVES = [
  {
    name: "AI & Machine Learning",
    category: "AI" as const,
    tokens: ["FET", "RENDER", "TAO", "NMR"],
    summary: "AI agents and compute networks remain a primary attention magnet. Heat tracks live momentum across the sector's majors.",
    baselineHeat: 70,
  },
  {
    name: "DeFi Protocols",
    category: "DeFi" as const,
    tokens: ["CAKE", "UNI", "AAVE", "XVS"],
    summary: "DeFi bluechips and BNB Chain DEX leaders. PancakeSwap volume is the local pulse for on-chain yield appetite.",
    baselineHeat: 60,
  },
  {
    name: "RWA Tokenization",
    category: "RWA" as const,
    tokens: ["ONDO", "PENDLE", "CFG"],
    summary: "Real-world assets as institutional capital seeks on-chain yield products. Heat reflects live flows into the basket.",
    baselineHeat: 55,
  },
  {
    name: "Memecoins",
    category: "Memecoin" as const,
    tokens: ["PEPE", "FLOKI", "BONK", "SHIB"],
    summary: "Retail risk appetite barometer. Memecoin momentum swings fastest with the crowd's mood.",
    baselineHeat: 58,
  },
  {
    name: "DePIN",
    category: "DePIN" as const,
    tokens: ["RENDER", "HNT", "IOTX", "FIL"],
    summary: "Decentralized physical infrastructure. A quieter narrative whose heat builds on real network usage.",
    baselineHeat: 48,
  },
  {
    name: "Gaming & Metaverse",
    category: "Gaming" as const,
    tokens: ["AXS", "SAND", "MANA", "GALA"],
    summary: "Gaming tokens track speculative cycles ahead of major title launches. Heat shows current crowd energy.",
    baselineHeat: 40,
  },
  {
    name: "Layer 2 Scaling",
    category: "Layer2" as const,
    tokens: ["ARB", "OP", "MATIC", "STRK"],
    summary: "L2 scaling tokens. Heat moves with rollup attention and the broader ETH ecosystem rotation.",
    baselineHeat: 38,
  },
  {
    name: "Layer 1 Chains",
    category: "Layer1" as const,
    tokens: ["BNB", "SOL", "AVAX", "ATOM"],
    summary: "Major Layer 1 chains. Heat reflects live capital rotation among the large-cap base assets.",
    baselineHeat: 45,
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

export default async function RadarPage() {
  // Enrich each narrative with live, market-derived heat, then rank by heat.
  const enriched = (
    await Promise.all(
      NARRATIVES.map(async (n) => ({
        ...n,
        ...(await computeNarrativeHeat(n.tokens, n.baselineHeat)),
      })),
    )
  ).sort((a, b) => b.heat - a.heat);

  const globalFomo = Math.round(
    enriched.reduce((sum, n) => sum + n.heat, 0) / enriched.length,
  );
  const hotSector = enriched[0];

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="FOMO Radar" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="space-y-6">

            {/* Page header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent-emerald" aria-hidden />
                  FOMO Radar
                </h1>
                <p className="text-sm text-text-secondary mt-0.5">
                  Live narrative heat across {enriched.length} market themes, ranked by crowd energy.
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
                  <Badge variant="narrative">{hotSector.category}</Badge>
                </div>
              </div>
            </div>

            {/* Narrative grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list" aria-label="Narrative heat cards">
              {enriched.map(({ name, heat, tokens, trend, summary, change24h }) => (
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
