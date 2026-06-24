"use client";

// ─── Dashboard analysis experience ───────────────────────────────────────────
// Searching a token no longer navigates away. The dashboard stays put and morphs
// into a chat-style conversation: the user's query appears as a bubble, the
// agents "think", then each agent streams in as a message, ending with the Judge
// verdict. Deep links to /token/[symbol] still work — this is the inline path.

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart2,
  Brain,
  Eye,
  Gavel,
  Plus,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Greeting from "@/components/layout/greeting";
import FomoOrb from "@/components/dashboard/fomo-orb";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/layout/page-animate";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/lib/format";
import type { AnalysisResult } from "@/types/agents";

type Phase = "idle" | "analyzing" | "result" | "error";

const THINKING_STEPS = [
  "Scout is gathering market data…",
  "Narrative is reading the story…",
  "Crowd & Reverse are debating…",
  "Judge is deliberating the verdict…",
];

interface DashboardExperienceProps {
  /** Recent-activity grid, rendered only on the idle screen. */
  children?: React.ReactNode;
}

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
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-(--text-primary)">${symbol}</span>
              {result && <Badge variant="narrative">{result.narrative.narrative}</Badge>}
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
            <div className="bg-accent-emerald text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5">
              Analyze ${symbol}
            </div>
          </div>

          {phase === "analyzing" && <ThinkingBubble />}

          {phase === "error" && (
            <AgentMessage colorVar="--agent-reverse" icon={<AlertTriangle className="w-4 h-4" />} name="Euphoria">
              <p className="text-sm text-text-secondary leading-relaxed">{errorMsg}</p>
              <button
                onClick={() => analyze(symbol)}
                className="mt-3 text-xs font-medium text-accent-emerald hover:underline"
              >
                Retry
              </button>
            </AgentMessage>
          )}

          {phase === "result" && result && <ResultFeed result={result} />}

          {/* Analyze another token */}
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

// ─── Thinking indicator ───────────────────────────────────────────────────────

function ThinkingBubble() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % THINKING_STEPS.length), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-3">
      <Avatar colorVar="--agent-judge" icon={<Sparkles className="w-3.5 h-3.5" />} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white border border-border shadow-(--shadow-card) px-4 py-3">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-text-muted"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-text-secondary"
            >
              {THINKING_STEPS[step]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Result feed (staggered agent messages) ──────────────────────────────────

function ResultFeed({ result }: { result: AnalysisResult }) {
  const reduced = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.4, ease: [0, 0, 0.2, 1] as const } },
  };

  const { scout, narrative, crowd, reverse, judge } = result;
  const change = scout.price_change_24h;

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.45 } } }}
    >
      {/* Scout */}
      <motion.div variants={item}>
        <AgentMessage colorVar="--agent-scout" icon={<BarChart2 className="w-4 h-4" />} name="Scout · Market data">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
            <span className="font-mono text-base text-[var(--text-primary)]">${scout.price.toFixed(scout.price < 1 ? 6 : 2)}</span>
            <span className={cn("font-mono text-sm", change >= 0 ? "text-signal-buy" : "text-signal-sell")}>
              {change >= 0 ? "+" : ""}{change}%
            </span>
            <span className="text-xs text-[var(--text-muted)]">MCap {formatUSD(scout.market_cap)} · Vol {formatUSD(scout.volume_24h)}</span>
          </div>
          <MiniBar label="Volume" value={scout.volume_score} colorClass="bg-accent-emerald" />
          <MiniBar label="Momentum" value={scout.momentum_score} colorClass="bg-accent-cyan" />
        </AgentMessage>
      </motion.div>

      {/* Narrative */}
      <motion.div variants={item}>
        <AgentMessage colorVar="--agent-narrative" icon={<Brain className="w-4 h-4" />} name="Narrative · The story">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="narrative">{narrative.narrative}</Badge>
            <span className="font-mono text-xs text-text-secondary">{narrative.confidence}% confident</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{narrative.explanation}</p>
        </AgentMessage>
      </motion.div>

      {/* Crowd vs Reverse — the debate */}
      <motion.div variants={item}>
        <AgentMessage colorVar="--agent-crowd" icon={<Users className="w-4 h-4" />} name="Crowd · FOMO (bull)">
          <div className="flex items-baseline gap-2 mb-2">
            <CountUp value={crowd.fomo_score} className="text-3xl font-mono font-semibold text-orange-500" />
            <span className="text-xs text-text-muted font-mono">/100</span>
            <span className="text-sm font-medium text-orange-500 uppercase">{crowd.fomo_level}</span>
          </div>
          <DriverList items={crowd.sentiment_drivers} marker="›" markerClass="text-orange-500" />
        </AgentMessage>
      </motion.div>

      <motion.div variants={item}>
        <AgentMessage colorVar="--agent-reverse" icon={<Shield className="w-4 h-4" />} name="Reverse · Bubble risk (bear)">
          <div className="flex items-baseline gap-2 mb-2">
            <CountUp value={reverse.bubble_probability} className="text-3xl font-mono font-semibold text-[var(--text-primary)]" />
            <span className="text-xs text-text-muted font-mono">% risk</span>
            <span className="text-sm font-medium text-signal-sell uppercase">{reverse.bubble_risk}</span>
          </div>
          <DriverList items={reverse.red_flags} icon={<AlertTriangle className="w-3 h-3 text-signal-sell mt-0.5 shrink-0" />} />
        </AgentMessage>
      </motion.div>

      {/* Judge verdict */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: reduced ? 1 : 0.94 },
          visible: { opacity: 1, scale: 1, transition: { type: reduced ? "tween" : "spring", stiffness: 260, damping: 22 } },
        }}
      >
        <JudgeMessage judge={judge} />
      </motion.div>
    </motion.div>
  );
}

// ─── Judge hero message ───────────────────────────────────────────────────────

function JudgeMessage({ judge }: { judge: AnalysisResult["judge"] }) {
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
      <Avatar colorVar="--agent-judge" icon={<Gavel className="w-4 h-4" />} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">Judge · Final verdict</p>
        <div className="rounded-2xl rounded-tl-sm glass-elevated p-5">
          <div className="flex items-start gap-4">
            <div className={cn("flex flex-col items-center justify-center w-24 h-24 rounded-2xl border shrink-0", bg)} role="status" aria-label={`Decision: ${judge.decision}`}>
              <span className={color}>{icon}</span>
              <span className={cn("text-xl font-mono font-bold mt-1", color)}>{judge.decision}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-2">
                <CountUp value={judge.confidence} className="text-2xl font-mono font-semibold text-[var(--text-primary)]" />
                <span className="text-sm text-[var(--text-muted)]">% confidence</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                <span className="text-accent-purple mt-0.5 shrink-0" aria-hidden>✦</span>
                <em>{judge.key_insight}</em>
              </div>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-4">{judge.reasoning}</p>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-xs font-medium text-accent-emerald mb-1.5">
                <ArrowUp className="w-3 h-3" aria-hidden /> Bull case
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{judge.bull_case}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15">
              <div className="flex items-center gap-1.5 text-xs font-medium text-signal-sell mb-1.5">
                <ArrowDown className="w-3 h-3" aria-hidden /> Bear case
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{judge.bear_case}</p>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-muted)] mt-4 pt-3 border-t border-[var(--border-subtle)]">
            <strong className="text-[var(--text-secondary)]">Not financial advice.</strong>{" "}
            A psychological signal for research only · horizon {judge.time_horizon}.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Avatar({ colorVar, icon }: { colorVar: string; icon: React.ReactNode }) {
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

function AgentMessage({
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
      <Avatar colorVar={colorVar} icon={icon} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">{name}</p>
        <div className="rounded-2xl rounded-tl-sm bg-white border border-[var(--border)] shadow-[var(--shadow-card)] p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function MiniBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs text-[var(--text-muted)]">{label}</span>
        <span className="font-mono text-xs text-[var(--text-secondary)]">{value}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
        />
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
