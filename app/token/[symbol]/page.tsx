import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  BarChart2,
  Brain,
  ChevronRight,
  Eye,
  Gavel,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StaggerList, StaggerItem, SpringIn, CountUp } from "@/components/layout/page-animate";

interface TokenPageProps {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: TokenPageProps): Promise<Metadata> {
  const { symbol } = await params;
  return { title: `${symbol.toUpperCase()} Analysis` };
}

// Mock data for demo. Real data comes from /api/analyze
const MOCK_RESULT = {
  symbol: "CAKE",
  price: 3.24,
  price_change_24h: 12.4,
  volume_score: 89,
  momentum_score: 74,
  market_cap: 820_000_000,
  volume_24h: 142_000_000,
  narrative: "DeFi",
  narrative_confidence: 92,
  narrative_explanation:
    "PancakeSwap is a leading DEX on BNB Chain benefiting from renewed DeFi activity and BNB ecosystem growth. The protocol has maintained dominant market share with continuous v3 upgrades.",
  crowd_fomo: 78,
  crowd_level: "FOMO",
  crowd_drivers: [
    "Volume spike 3.2× above 7-day average",
    "Strong buy-side order flow on BNB Chain DEXes",
    "Social mention count up 187% in 24h",
  ],
  reverse_probability: 34,
  reverse_risk: "Low-Medium",
  red_flags: [
    "Price up 12% with no fundamental catalyst",
    "Retail-driven momentum — no VC or whale accumulation signal",
  ],
  decision: "BUY",
  confidence: 87,
  reasoning:
    "Strong momentum backed by a credible DeFi narrative, healthy volume metrics, and low-medium bubble risk. The FOMO score is elevated but not euphoric — crowd energy is building, not exploding.",
  bull_case:
    "DeFi narrative tailwind, dominant DEX position on BNB Chain, v3 upgrade cycle driving TVL growth.",
  bear_case:
    "Retail-driven pump with no institutional confirmation. Elevated FOMO could reverse quickly.",
  key_insight: "Volume quality is strong — this is real trading activity, not wash trading.",
  time_horizon: "3–7 days",
};

function ScoreBar({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-text-muted">{label}</span>
        <span className={`font-mono text-sm font-medium ${color}`}>{score}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-current ${color}`}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default async function TokenPage({ params }: TokenPageProps) {
  const { symbol } = await params;
  const data = MOCK_RESULT;
  const s = symbol.toUpperCase();

  const decisionColor =
    data.decision === "BUY" ? "text-signal-buy" :
    data.decision === "SELL" ? "text-signal-sell" :
    "text-signal-watch";

  const decisionBg =
    data.decision === "BUY" ? "bg-emerald-500/10 border-emerald-500/30" :
    data.decision === "SELL" ? "bg-red-500/10 border-red-500/30" :
    "bg-amber-500/10 border-amber-500/30";

  const decisionIcon =
    data.decision === "BUY" ? <ArrowUp className="w-6 h-6" aria-hidden /> :
    data.decision === "SELL" ? <ArrowDown className="w-6 h-6" aria-hidden /> :
    <Eye className="w-6 h-6" aria-hidden />;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={`Token Analysis`} />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* Back + token header */}
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary motion-safe:transition-colors motion-safe:duration-100 mb-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-emerald focus-visible:rounded"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
                Dashboard
              </Link>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-3xl font-mono font-semibold text-text-primary">${s}</h1>
                    <span className="text-lg font-mono text-text-primary">${data.price.toFixed(2)}</span>
                    <span className={`font-mono text-sm ${data.price_change_24h >= 0 ? "text-signal-buy" : "text-signal-sell"}`}>
                      {data.price_change_24h >= 0 ? "+" : ""}{data.price_change_24h}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="narrative">{data.narrative}</Badge>
                    <Badge variant="muted">BNB Chain</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right">
                    <div className="font-mono text-text-primary">${(data.market_cap / 1e6).toFixed(0)}M</div>
                    <div className="text-text-muted">Market Cap</div>
                  </div>
                  <div className="w-px h-8 bg-border-subtle" aria-hidden />
                  <div className="text-right">
                    <div className="font-mono text-text-primary">${(data.volume_24h / 1e6).toFixed(0)}M</div>
                    <div className="text-text-muted">24h Volume</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline progress */}
            <Card>
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-1 text-xs">
                  {[
                    { name: "Scout", done: true },
                    { name: "Narrative", done: true },
                    { name: "Crowd + Reverse", done: true },
                    { name: "Judge", done: true },
                  ].map(({ name, done }, i, arr) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className={`flex items-center gap-1 ${done ? "text-accent-emerald" : "text-text-muted"}`}>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono border ${done ? "bg-emerald-500/15 border-emerald-500/30 text-accent-emerald" : "border-border-subtle text-text-muted"}`}>
                          {done ? "✓" : String(i + 1)}
                        </span>
                        <span className={done ? "text-text-secondary" : "text-text-muted"}>{name}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-text-muted shrink-0" aria-hidden />
                      )}
                    </div>
                  ))}
                  <span className="ml-auto text-text-muted font-mono">2.4s</span>
                </div>
              </CardContent>
            </Card>

            {/* Scout + Narrative */}
            <StaggerList className="grid sm:grid-cols-2 gap-4">
              <StaggerItem>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="w-3.5 h-3.5 text-accent-emerald" aria-hidden />
                    <CardTitle>Scout Agent</CardTitle>
                  </div>
                  <div className="space-y-4">
                    <ScoreBar score={data.volume_score} label="Volume Score" color="text-accent-emerald" />
                    <ScoreBar score={data.momentum_score} label="Momentum Score" color="text-accent-cyan" />
                  </div>
                  <p className="text-xs text-text-muted mt-4 leading-relaxed">
                    Volume is 3.2× above the 7-day average. Multi-timeframe momentum is positive across 1h, 4h, and 24h windows.
                  </p>
                </CardContent>
              </Card>

              </StaggerItem>
              <StaggerItem>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-3.5 h-3.5 text-accent-purple" aria-hidden />
                    <CardTitle>Narrative Agent</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="narrative" className="text-sm px-3 py-1">{data.narrative}</Badge>
                    <span className="font-mono text-sm text-text-secondary">{data.narrative_confidence}% confident</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{data.narrative_explanation}</p>
                </CardContent>
              </Card>
              </StaggerItem>
            </StaggerList>

            {/* Debate: Crowd vs Reverse */}
            <StaggerList className="grid sm:grid-cols-2 gap-4" staggerDelay={0.12}>
              <StaggerItem>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-3.5 h-3.5 text-signal-watch" aria-hidden />
                    <CardTitle>Crowd Agent</CardTitle>
                    <Badge variant="watch" className="ml-auto">BULL</Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <CountUp value={data.crowd_fomo} className="text-4xl font-mono font-semibold text-orange-400" />
                    <span className="text-sm text-text-muted font-mono">/100</span>
                    <span className="ml-1 text-sm font-medium text-orange-400">{data.crowd_level}</span>
                  </div>
                  <ul className="space-y-1.5" aria-label="Crowd sentiment drivers">
                    {data.crowd_drivers.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="text-signal-watch mt-0.5 shrink-0">›</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              </StaggerItem>

              <StaggerItem>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-3.5 h-3.5 text-signal-sell" aria-hidden />
                    <CardTitle>Reverse Agent</CardTitle>
                    <Badge variant="sell" className="ml-auto">BEAR</Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <CountUp value={data.reverse_probability} className="text-4xl font-mono font-semibold text-text-primary" />
                    <span className="text-sm text-text-muted font-mono">% bubble risk</span>
                    <span className="ml-1 text-sm font-medium text-emerald-400">{data.reverse_risk}</span>
                  </div>
                  <ul className="space-y-1.5" aria-label="Risk red flags">
                    {data.red_flags.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-text-secondary">
                        <AlertTriangle className="w-3 h-3 text-signal-sell mt-0.5 shrink-0" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              </StaggerItem>
            </StaggerList>

            {/* Judge Decision — the hero card */}
            <SpringIn delay={0.25}>
            <Card elevated>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Gavel className="w-4 h-4 text-accent-purple" aria-hidden />
                  <CardTitle className="text-text-primary uppercase text-xs tracking-widest">Judge Decision</CardTitle>
                </div>

                <div className="flex flex-wrap items-start gap-6">
                  {/* Decision badge */}
                  <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border ${decisionBg}`} role="status" aria-label={`Decision: ${data.decision}`}>
                    <div className={decisionColor}>{decisionIcon}</div>
                    <div className={`text-2xl font-mono font-bold mt-1 ${decisionColor}`}>{data.decision}</div>
                  </div>

                  {/* Confidence + key insight */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-mono font-semibold text-text-primary">{data.confidence}%</span>
                      <span className="text-sm text-text-muted">confidence</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-3 max-w-xs">
                      <div
                        className={`h-full rounded-full ${decisionColor.replace("text-", "bg-")}`}
                        style={{ width: `${data.confidence}%` }}
                        aria-hidden
                      />
                    </div>
                    <div className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed max-w-lg">
                      <span className="text-accent-purple mt-0.5 shrink-0" aria-hidden>✦</span>
                      <em>{data.key_insight}</em>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mt-5 mb-5">{data.reasoning}</p>

                {/* Bull / Bear cases */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-accent-emerald mb-2">
                      <ArrowUp className="w-3 h-3" aria-hidden />
                      Bull Case
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{data.bull_case}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-signal-sell mb-2">
                      <ArrowDown className="w-3 h-3" aria-hidden />
                      Bear Case
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{data.bear_case}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-subtle">
                  <TrendingUp className="w-3.5 h-3.5 text-text-muted" aria-hidden />
                  <span className="text-xs text-text-muted">Suggested time horizon:</span>
                  <span className="font-mono text-xs text-text-secondary">{data.time_horizon}</span>
                </div>

                <p className="text-xs text-text-muted mt-4 pt-4 border-t border-border-subtle">
                  <strong className="text-text-secondary">Not financial advice.</strong>{" "}
                  This is a psychological signal for research purposes only. Never trade solely based on AI analysis.
                </p>
              </CardContent>
            </Card>
            </SpringIn>
          </div>
        </main>
      </div>
    </div>
  );
}
