"use client";

// ─── Dashboard analysis experience ───────────────────────────────────────────
// Inline chat-style analysis: the user's query appears as a bubble, agents
// "think" in a visual pipeline, then each agent streams in as a rich message
// card ending with the Judge verdict.

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart2,
  Brain,
  Check,
  Eye,
  Gavel,
  Loader2,
  Plus,
  Shield,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import Greeting from "@/components/layout/greeting";
import FomoOrb from "@/components/dashboard/fomo-orb";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/layout/page-animate";
import { cn } from "@/lib/utils";
import { formatUSD, fomoLevelColor, fomoLevelBg } from "@/lib/format";
import type { AnalysisResult } from "@/types/agents";

type Phase = "idle" | "analyzing" | "result" | "error";

// ─── Pipeline step config ─────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { id: "scout",     icon: BarChart2, label: "Scout",          desc: "Gathering market data…",   colorVar: "--agent-scout" },
  { id: "narrative", icon: Brain,     label: "Narrative",      desc: "Reading the story…",       colorVar: "--agent-narrative" },
  { id: "debate",    icon: Users,     label: "Crowd & Reverse",desc: "Simulating the debate…",   colorVar: "--agent-crowd" },
  { id: "judge",     icon: Gavel,     label: "Judge",          desc: "Deliberating the verdict…",colorVar: "--agent-judge" },
] as const;

// Cumulative ms at which each step auto-completes and next activates.
const STEP_COMPLETE_AT = [1600, 4000, 7200] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface DashboardExperienceProps {
  children?: React.ReactNode;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardExperience({ children }: DashboardExperienceProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const feedTopRef = useRef<HTMLDivElement>(null);

  const analyze = useCallback(async (raw: string) => {
    const sym = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
    if (!sym) return;

    setSymbol(sym);
    setResult(null);
    setErrorMsg("");
    setPhase("analyzing");
    feedTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: sym }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const { result: data } = (await res.json()) as { result: AnalysisResult };
      setResult(data);
      setPhase("result");
    } catch {
      setErrorMsg("Couldn't complete the analysis. The market data or model may be unavailable — try again.");
      setPhase("error");
    }
  }, []);

  const reset = () => {
    setPhase("idle");
    setResult(null);
    setSymbol("");
    setErrorMsg("");
  };

  return (
    <AnimatePresence mode="wait">
      {phase === "idle" ? (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-8"
        >
          <Greeting />

          <div className="flex-1 flex items-center justify-center min-h-70 max-h-105">
            <FomoOrb
              level="ready"
              label="AI is ready"
              sublabel="Search a token to watch the agents analyze it live"
            />
          </div>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
            <QuickChips onSelect={analyze} />
            <TokenSearchBar onAnalyze={analyze} />
          </div>

          {children}
        </motion.div>
      ) : (
        <motion.div
          key="conversation"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
          className="flex flex-col gap-5 max-w-3xl mx-auto w-full"
        >
          <div ref={feedTopRef} />

          {/* Conversation header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-lg font-semibold text-[var(--text-primary)]">${symbol}</span>
              {result && <Badge variant="narrative">{result.narrative.narrative}</Badge>}
              {result?.cached && (
                <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded px-1.5 py-0.5">
                  Cached
                </span>
              )}
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-(--text-primary) transition-colors rounded-lg px-2.5 py-1.5 hover:bg-black/4"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden />
              New analysis
            </button>
          </div>

          {/* User query bubble */}
          <div className="flex justify-end">
            <div className="bg-accent-emerald text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 font-medium">
              Analyze ${symbol}
            </div>
          </div>

          {phase === "analyzing" && <PipelineLoader />}

          {phase === "error" && (
            <AgentBubble colorVar="--agent-reverse" icon={<AlertTriangle className="w-4 h-4" />} name="Euphoria">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{errorMsg}</p>
              <button
                onClick={() => analyze(symbol)}
                className="mt-3 text-xs font-medium text-accent-emerald hover:underline"
              >
                Retry
              </button>
            </AgentBubble>
          )}

          {phase === "result" && result && <ResultFeed result={result} />}

          {(phase === "result" || phase === "error") && (
            <div className="pt-1">
              <TokenSearchBar onAnalyze={analyze} placeholder="Analyze another token…" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Pipeline loader (replaces simple thinking dots) ────────────────────────

function PipelineLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEP_COMPLETE_AT.map((ms, i) =>
      setTimeout(() => setActiveStep(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AgentBubble colorVar="--agent-judge" icon={<Sparkles className="w-4 h-4" />} name="Euphoria AI">
      <div className="space-y-3" role="status" aria-label="Analysis in progress">
        {PIPELINE_STEPS.map(({ id, icon: Icon, label, desc, colorVar }, i) => {
          const state: "complete" | "running" | "pending" =
            i < activeStep ? "complete" : i === activeStep ? "running" : "pending";
          const isLast = i === PIPELINE_STEPS.length - 1;

          return (
            <div key={id} className="flex items-start gap-3">
              {/* Step connector column */}
              <div className="flex flex-col items-center shrink-0">
                {/* Step indicator */}
                <motion.div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0",
                    state === "complete" && "bg-accent-emerald",
                    state === "running" && "bg-[var(--text-muted)]",
                    state === "pending" && "bg-[var(--bg-elevated)] border border-[var(--border)]"
                  )}
                  animate={state === "running" ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: state === "running" ? Infinity : 0, ease: "easeInOut" }}
                  style={state === "running" ? { background: `var(${colorVar})` } : undefined}
                >
                  {state === "complete" ? (
                    <Check className="w-3 h-3" aria-hidden />
                  ) : state === "running" ? (
                    <Loader2 className="w-3 h-3 animate-spin" aria-hidden />
                  ) : (
                    <Icon className="w-3 h-3 text-[var(--text-muted)]" aria-hidden />
                  )}
                </motion.div>
                {/* Connector line */}
                {!isLast && (
                  <div className="w-px flex-1 mt-1 mb-0 min-h-[10px]"
                    style={{ background: state === "complete" ? "var(--accent-emerald)" : "var(--border)" }}
                  />
                )}
              </div>

              {/* Step label */}
              <div className="flex-1 pb-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-semibold",
                    state === "complete" ? "text-accent-emerald" :
                    state === "running" ? "text-[var(--text-primary)]" :
                    "text-[var(--text-muted)]"
                  )}>
                    {label}
                  </span>
                  {state === "complete" && (
                    <span className="text-[10px] text-accent-emerald font-medium">Done</span>
                  )}
                  {state === "running" && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key="running-desc"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-[var(--text-muted)]"
                      >
                        {desc}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AgentBubble>
  );
}

// ─── Result feed ──────────────────────────────────────────────────────────────

function ResultFeed({ result }: { result: AnalysisResult }) {
  const reduced = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.4, ease: [0, 0, 0.2, 1] as const } },
  };

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.4 } } }}
    >
      {/* ── Summary snapshot ── */}
      <motion.div variants={item}>
        <AnalysisSummaryCard result={result} />
      </motion.div>

      {/* ── Scout ── */}
      <motion.div variants={item}>
        <AgentBubble colorVar="--agent-scout" icon={<BarChart2 className="w-4 h-4" />} name="Scout · Market data">
          <ScoutBody scout={result.scout} />
        </AgentBubble>
      </motion.div>

      {/* ── Narrative ── */}
      <motion.div variants={item}>
        <AgentBubble colorVar="--agent-narrative" icon={<Brain className="w-4 h-4" />} name="Narrative · The story">
          <NarrativeBody narrative={result.narrative} />
        </AgentBubble>
      </motion.div>

      {/* ── Crowd ── */}
      <motion.div variants={item}>
        <AgentBubble colorVar="--agent-crowd" icon={<Users className="w-4 h-4" />} name="Crowd · FOMO (bull)">
          <CrowdBody crowd={result.crowd} />
        </AgentBubble>
      </motion.div>

      {/* ── Reverse ── */}
      <motion.div variants={item}>
        <AgentBubble colorVar="--agent-reverse" icon={<Shield className="w-4 h-4" />} name="Reverse · Bubble risk (bear)">
          <ReverseBody reverse={result.reverse} />
        </AgentBubble>
      </motion.div>

      {/* ── Judge verdict ── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: reduced ? 1 : 0.95 },
          visible: { opacity: 1, scale: 1, transition: { type: reduced ? "tween" : "spring", stiffness: 260, damping: 24 } },
        }}
      >
        <JudgeCard judge={result.judge} />
      </motion.div>
    </motion.div>
  );
}

// ─── Analysis summary snapshot ────────────────────────────────────────────────

function AnalysisSummaryCard({ result }: { result: AnalysisResult }) {
  const { scout, crowd, reverse, judge } = result;
  const change = scout.price_change_24h;
  const isPositive = change >= 0;

  const decisionColor =
    judge.decision === "BUY" ? "text-signal-buy" :
    judge.decision === "SELL" ? "text-signal-sell" : "text-signal-watch";
  const decisionBg =
    judge.decision === "BUY" ? "bg-emerald-500/10 border-emerald-500/25" :
    judge.decision === "SELL" ? "bg-red-500/10 border-red-500/25" : "bg-amber-500/10 border-amber-500/25";

  return (
    <div className="rounded-2xl bg-white border border-[var(--border)] shadow-[var(--shadow-elevated)] overflow-hidden">
      {/* Price row */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
              ${scout.price.toFixed(scout.price < 1 ? 6 : 2)}
            </span>
            <span className={cn(
              "flex items-center gap-0.5 font-mono text-sm font-semibold",
              isPositive ? "text-signal-buy" : "text-signal-sell"
            )}>
              {isPositive ? <ArrowUp className="w-3.5 h-3.5" aria-hidden /> : <ArrowDown className="w-3.5 h-3.5" aria-hidden />}
              {isPositive ? "+" : ""}{change}%
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            MCap {formatUSD(scout.market_cap)} · Vol {formatUSD(scout.volume_24h)} · 24h
          </p>
        </div>
        {/* Decision badge */}
        <div className={cn("flex flex-col items-center justify-center rounded-xl px-4 py-2.5 border", decisionBg)}>
          <span className={cn("text-xl font-mono font-bold", decisionColor)}>{judge.decision}</span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{judge.confidence}% conf</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 divide-x divide-[var(--border-subtle)]">
        <MetricCell
          label="FOMO Score"
          value={crowd.fomo_score}
          sub={crowd.fomo_level.toUpperCase()}
          color={fomoScoreColor(crowd.fomo_score)}
        />
        <MetricCell
          label="Bubble Risk"
          value={reverse.bubble_probability}
          sub={reverse.bubble_risk.toUpperCase()}
          color={riskColor(reverse.bubble_probability)}
          suffix="%"
        />
        <MetricCell
          label="Confidence"
          value={judge.confidence}
          sub={`${scout.volume_score}v · ${scout.momentum_score}m`}
          color="var(--accent-blue)"
          suffix="%"
        />
      </div>
    </div>
  );
}

function MetricCell({ label, value, sub, color, suffix = "" }: {
  label: string;
  value: number;
  sub: string;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3.5">
      <div className="flex items-baseline gap-0.5">
        <CountUp value={value} className="font-mono text-xl font-bold text-[var(--text-primary)]" />
        {suffix && <span className="font-mono text-xs text-[var(--text-muted)]">{suffix}</span>}
      </div>
      <p className="text-[10px] font-medium mt-0.5" style={{ color }}>{sub}</p>
      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
  );
}

// ─── Scout body ───────────────────────────────────────────────────────────────

function ScoutBody({ scout }: { scout: AnalysisResult["scout"] }) {
  return (
    <div className="space-y-4">
      {/* Score gauges */}
      <div className="grid grid-cols-2 gap-3">
        <GaugeCard
          label="Volume Score"
          value={scout.volume_score}
          color="#10b981"
          description="Market buying pressure relative to 30d average"
        />
        <GaugeCard
          label="Momentum Score"
          value={scout.momentum_score}
          color="#06b6d4"
          description="Price & volume trend strength over 7d"
        />
      </div>

      {/* Data source tag */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" aria-hidden />
        <span className="text-[11px] text-[var(--text-muted)]">
          Data via {scout.data_source === "cmc" ? "CoinMarketCap" : scout.data_source === "dexscreener" ? "DexScreener" : "mock data"}
          {scout.name && ` · ${scout.name}`}
        </span>
      </div>
    </div>
  );
}

// ─── Narrative body ───────────────────────────────────────────────────────────

function NarrativeBody({ narrative }: { narrative: AnalysisResult["narrative"] }) {
  return (
    <div className="space-y-3">
      {/* Header: category + confidence */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="narrative">{narrative.narrative}</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 rounded-full bg-black/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${narrative.confidence}%` }}
              transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
            />
          </div>
          <span className="font-mono text-xs text-[var(--text-secondary)]">{narrative.confidence}%</span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{narrative.explanation}</p>

      {/* Key catalysts */}
      {narrative.key_catalysts.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <Tag className="w-3 h-3" aria-hidden />
            Key Catalysts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {narrative.key_catalysts.map((c) => (
              <span
                key={c}
                className="text-xs px-2 py-0.5 rounded-md bg-purple-500/8 border border-purple-500/15 text-purple-700"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Crowd body ───────────────────────────────────────────────────────────────

function CrowdBody({ crowd }: { crowd: AnalysisResult["crowd"] }) {
  const scoreColor = fomoScoreColor(crowd.fomo_score);

  return (
    <div className="space-y-3">
      {/* FOMO gauge */}
      <div className="flex items-center gap-4">
        <RingGauge value={crowd.fomo_score} color={scoreColor} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <CountUp value={crowd.fomo_score} className="text-3xl font-mono font-bold text-[var(--text-primary)]" />
            <span className="text-xs text-[var(--text-muted)] font-mono">/100</span>
          </div>
          <div className={cn("inline-flex items-center text-xs font-semibold uppercase px-2 py-0.5 rounded-md border mt-1", fomoLevelBg(crowd.fomo_score))}>
            <span className={fomoLevelColor(crowd.fomo_score)}>{crowd.fomo_level}</span>
          </div>
          {crowd.social_signals && (
            <p className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2">{crowd.social_signals}</p>
          )}
        </div>
      </div>

      {/* Sentiment drivers */}
      <DriverList items={crowd.sentiment_drivers} marker="›" markerClass="text-orange-500" />

      {/* Crowd narrative */}
      {crowd.crowd_narrative && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-3 italic">
          &ldquo;{crowd.crowd_narrative}&rdquo;
        </p>
      )}
    </div>
  );
}

// ─── Reverse body ─────────────────────────────────────────────────────────────

function ReverseBody({ reverse }: { reverse: AnalysisResult["reverse"] }) {
  const rColor = riskColor(reverse.bubble_probability);
  const riskBg =
    reverse.bubble_probability >= 70 ? "bg-red-500/8 border-red-500/15" :
    reverse.bubble_probability >= 50 ? "bg-orange-500/8 border-orange-500/15" :
    reverse.bubble_probability >= 30 ? "bg-yellow-500/8 border-yellow-500/15" :
    "bg-emerald-500/8 border-emerald-500/15";

  return (
    <div className="space-y-3">
      {/* Bubble risk gauge */}
      <div className="flex items-center gap-4">
        <RingGauge value={reverse.bubble_probability} color={rColor} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <CountUp value={reverse.bubble_probability} className="text-3xl font-mono font-bold text-[var(--text-primary)]" />
            <span className="text-xs text-[var(--text-muted)] font-mono">% risk</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold uppercase px-2 py-0.5 rounded-md border mt-1",
              riskBg
            )}
            style={{ color: rColor }}
          >
            {reverse.bubble_risk}
          </span>
        </div>
      </div>

      {/* Red flags */}
      <DriverList
        items={reverse.red_flags}
        icon={<AlertTriangle className="w-3 h-3 text-signal-sell mt-0.5 shrink-0" />}
      />

      {/* Contrarian argument */}
      {reverse.contrarian_argument && (
        <div className="rounded-lg bg-red-500/5 border border-red-500/12 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500/70 mb-1">Bear thesis</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{reverse.contrarian_argument}</p>
        </div>
      )}

      {/* Historical parallel */}
      {reverse.historical_parallel && (
        <p className="text-xs text-[var(--text-muted)] italic border-t border-[var(--border-subtle)] pt-3">
          Historical parallel: {reverse.historical_parallel}
        </p>
      )}
    </div>
  );
}

// ─── Judge card (hero verdict) ────────────────────────────────────────────────

function JudgeCard({ judge }: { judge: AnalysisResult["judge"] }) {
  const color =
    judge.decision === "BUY" ? "text-signal-buy" :
    judge.decision === "SELL" ? "text-signal-sell" : "text-signal-watch";
  const bg =
    judge.decision === "BUY" ? "bg-emerald-500/10 border-emerald-500/30" :
    judge.decision === "SELL" ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30";
  const icon =
    judge.decision === "BUY" ? <ArrowUp className="w-5 h-5" /> :
    judge.decision === "SELL" ? <ArrowDown className="w-5 h-5" /> : <Eye className="w-5 h-5" />;

  return (
    <div className="flex gap-3">
      <AgentAvatar colorVar="--agent-judge" icon={<Gavel className="w-4 h-4" />} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-1.5">Judge · Final verdict</p>
        <div className="rounded-2xl rounded-tl-sm glass-elevated overflow-hidden">
          {/* Decision hero */}
          <div className="flex items-center gap-5 px-5 py-5 border-b border-[var(--border-subtle)]">
            <div className={cn("flex flex-col items-center justify-center w-20 h-20 rounded-2xl border shrink-0", bg)}>
              <span className={color}>{icon}</span>
              <span className={cn("text-2xl font-mono font-bold mt-0.5", color)}>{judge.decision}</span>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              {/* Confidence bar */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-[var(--text-muted)]">Confidence</span>
                  <div className="flex items-baseline gap-0.5">
                    <CountUp value={judge.confidence} className="font-mono text-lg font-bold text-[var(--text-primary)]" />
                    <span className="text-xs text-[var(--text-muted)]">%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      judge.decision === "BUY" ? "bg-signal-buy" :
                      judge.decision === "SELL" ? "bg-signal-sell" : "bg-signal-watch"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${judge.confidence}%` }}
                    transition={{ duration: 1.0, ease: [0, 0, 0.2, 1], delay: 0.2 }}
                  />
                </div>
              </div>
              {/* Key insight */}
              <div className="flex items-start gap-1.5 text-sm text-[var(--text-secondary)] leading-snug">
                <span className="text-accent-purple mt-0.5 shrink-0 text-base" aria-hidden>✦</span>
                <em className="text-[var(--text-secondary)]">{judge.key_insight}</em>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="px-5 py-4 border-b border-[var(--border-subtle)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Reasoning</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{judge.reasoning}</p>
          </div>

          {/* Bull / Bear cases */}
          <div className="grid sm:grid-cols-2 gap-3 p-5">
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-emerald mb-2">
                <ArrowUp className="w-3.5 h-3.5" aria-hidden /> Bull case
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{judge.bull_case}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/15">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-signal-sell mb-2">
                <ArrowDown className="w-3.5 h-3.5" aria-hidden /> Bear case
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{judge.bear_case}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50">
            <span className="text-[11px] text-[var(--text-muted)]">
              Horizon <span className="font-mono font-medium text-[var(--text-secondary)]">{judge.time_horizon}</span>
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              <strong className="text-[var(--text-secondary)]">Not financial advice.</strong> Research signal only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function AgentAvatar({ colorVar, icon }: { colorVar: string; icon: React.ReactNode }) {
  return (
    <span
      className="flex items-center justify-center w-8 h-8 rounded-full text-white shrink-0"
      style={{ background: `var(${colorVar})` }}
      aria-hidden
    >
      {icon}
    </span>
  );
}

function AgentBubble({
  colorVar,
  icon,
  name,
  children,
}: {
  colorVar: string;
  icon: React.ReactNode;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <AgentAvatar colorVar={colorVar} icon={icon} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-1.5">{name}</p>
        <div className="rounded-2xl rounded-tl-sm bg-white border border-[var(--border)] shadow-[var(--shadow-card)] p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Circular SVG ring gauge with animated progress fill. */
function RingGauge({ value, color, size = 72, strokeWidth = 5 }: {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const reduced = useReducedMotion();
  const center = size / 2;
  const r = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={center} cy={center} r={r}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={center} cy={center} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0, 0, 0.2, 1] }}
        />
      </svg>
      {/* Value in center — rotated back to normal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <CountUp value={value} className="font-mono text-sm font-bold text-[var(--text-primary)]" />
      </div>
    </div>
  );
}

/** Score card with label, gauge ring, and a short description. */
function GaugeCard({ label, value, color, description }: {
  label: string;
  value: number;
  color: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] px-3.5 py-3">
      <RingGauge value={value} color={color} size={56} strokeWidth={4} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--text-primary)]">{label}</p>
        <p className="text-[11px] text-[var(--text-muted)] leading-snug mt-0.5">{description}</p>
        <div className="mt-1.5 h-1 rounded-full bg-black/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function DriverList({
  items,
  marker,
  markerClass,
  icon,
}: {
  items: string[];
  marker?: string;
  markerClass?: string;
  icon?: React.ReactNode;
}) {
  if (!items.length) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((d) => (
        <li key={d} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
          {icon ?? <span className={cn("mt-0.5 shrink-0", markerClass)}>{marker}</span>}
          {d}
        </li>
      ))}
    </ul>
  );
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function fomoScoreColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#84cc16";
  return "#10b981";
}

function riskColor(risk: number): string {
  if (risk >= 70) return "#ef4444";
  if (risk >= 50) return "#f97316";
  if (risk >= 30) return "#f59e0b";
  return "#10b981";
}
