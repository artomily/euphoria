import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUp, ArrowDown, FlaskConical, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { fetchDailyCandles } from "@/lib/backtest/binance";
import { runBacktest } from "@/lib/backtest/engine";
import { WARMUP } from "@/lib/backtest/strategy";
import { formatPercent } from "@/lib/format";
import type { BacktestPoint } from "@/types/backtest";

export const metadata: Metadata = { title: "Strategy Backtest" };

// Backtest is computed from live historical data on each request.
export const dynamic = "force-dynamic";

const QUICK_SYMBOLS = ["CAKE", "BNB", "ETH", "BTC", "XRP", "SOL"];

interface BacktestPageProps {
  searchParams: Promise<{ symbol?: string; days?: string }>;
}

/** Two normalized polylines (strategy vs buy & hold) over the equity series. */
function EquityChart({ series }: { series: BacktestPoint[] }) {
  const W = 760;
  const H = 240;
  const pad = 8;
  const values = series.flatMap((p) => [p.equity, p.buyHold]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const x = (i: number) => pad + (i / (series.length - 1)) * (W - pad * 2);
  const y = (v: number) => H - pad - ((v - min) / span) * (H - pad * 2);

  const line = (pick: (p: BacktestPoint) => number) =>
    series.map((p, i) => `${x(i).toFixed(1)},${y(pick(p)).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Equity curve: strategy vs buy and hold">
      <polyline points={line((p) => p.buyHold)} fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 3" />
      <polyline points={line((p) => p.equity)} fill="none" stroke="#10b981" strokeWidth="2" />
    </svg>
  );
}

function Metric({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "buy" | "sell" | "neutral";
}) {
  const color =
    tone === "buy" ? "text-signal-buy" : tone === "sell" ? "text-signal-sell" : "text-text-primary";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-text-muted mb-1">{label}</div>
        <div className={`font-mono text-2xl font-semibold ${color}`}>{value}</div>
        {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export default async function BacktestPage({ searchParams }: BacktestPageProps) {
  const sp = await searchParams;
  const symbol =
    (sp.symbol ?? "CAKE").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15) || "CAKE";
  const days = Math.min(Math.max(Number(sp.days) || 180, 30), 1000);

  const candles = await fetchDailyCandles(symbol, days);
  const result = candles.length > WARMUP ? runBacktest(symbol, candles) : null;
  const beatsHold = result ? result.totalReturnPct > result.buyHoldReturnPct : false;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Strategy Backtest" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="max-w-5xl mx-auto space-y-5">

            {/* Intro */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <FlaskConical className="w-4 h-4 text-accent-purple" aria-hidden />
                <h1 className="text-xl font-semibold text-text-primary">Euphoria Strategy Backtest</h1>
              </div>
              <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
                The Euphoria psychology thesis as a deterministic, reproducible rule set — ride healthy
                momentum, refuse euphoric blow-off tops. Backtested on daily candles, benchmarked against
                buy &amp; hold.
              </p>
            </div>

            {/* Symbol picker */}
            <div className="flex flex-wrap items-center gap-2">
              {QUICK_SYMBOLS.map((s) => (
                <Link
                  key={s}
                  href={`/backtest?symbol=${s}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border motion-safe:transition-colors ${
                    s === symbol
                      ? "bg-emerald-500/10 border-emerald-500/30 text-accent-emerald"
                      : "border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {s}
                </Link>
              ))}
              <span className="ml-auto text-xs text-text-muted font-mono">{days}d daily candles</span>
            </div>

            {!result ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-text-secondary">
                    No historical data for <span className="font-mono text-text-primary">{symbol}</span>.
                    Try a token with a USDT pair (e.g. CAKE, BNB, ETH).
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Headline result */}
                <Card elevated>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <div className="text-xs text-text-muted mb-1">Strategy Return ({symbol})</div>
                        <div className={`font-mono text-4xl font-bold ${result.totalReturnPct >= 0 ? "text-signal-buy" : "text-signal-sell"}`}>
                          {formatPercent(result.totalReturnPct)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={beatsHold ? "watch" : "muted"} className="flex items-center gap-1">
                          {beatsHold ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {beatsHold ? "Beats" : "Trails"} Buy &amp; Hold
                        </Badge>
                        <span className="text-xs text-text-muted font-mono">
                          B&amp;H {formatPercent(result.buyHoldReturnPct)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5">
                      <EquityChart series={result.series} />
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="inline-block w-4 h-0.5 bg-[#10b981]" /> Strategy
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="inline-block w-4 h-0.5 border-t border-dashed border-text-muted" /> Buy &amp; Hold
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Metric
                    label="Max Drawdown"
                    value={`-${result.maxDrawdownPct.toFixed(1)}%`}
                    tone="sell"
                  />
                  <Metric label="Win Rate" value={`${result.winRatePct.toFixed(0)}%`} tone="buy" />
                  <Metric label="Trades" value={String(result.trades)} />
                  <Metric label="Sharpe" value={result.sharpe.toFixed(2)} />
                </div>

                {/* Strategy spec */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-3.5 h-3.5 text-accent-cyan" aria-hidden />
                      <CardTitle>Strategy Rules</CardTitle>
                    </div>
                    <ul className="space-y-2 text-xs text-text-secondary">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-signal-buy mt-0.5 shrink-0" aria-hidden />
                        <span><strong className="text-text-primary">BUY</strong> — momentum ≥ 55, FOMO ≥ 30, and bubble risk ≤ 60 (healthy trend, not over-extended).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowDown className="w-3.5 h-3.5 text-signal-sell mt-0.5 shrink-0" aria-hidden />
                        <span><strong className="text-text-primary">SELL</strong> (risk-off) — momentum ≤ 42 (trend breaks / crowd fear) <em>or</em> FOMO ≥ 75 &amp; bubble ≥ 70 (euphoric top). Move to cash.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-text-muted mt-0.5 shrink-0">›</span>
                        <span><strong className="text-text-primary">WATCH</strong> — the 42–55 dead band: hold the current position. Features (momentum / FOMO / bubble) are derived deterministically from price, volume, and taker buy-pressure.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <p className="text-xs text-text-muted">
                  <strong className="text-text-secondary">Not financial advice.</strong> Past performance does not
                  predict future results. Backtest uses daily OHLCV from Binance; live signals add LLM-driven
                  narrative &amp; crowd analysis.
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
