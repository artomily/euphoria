import Link from "next/link";
import { Radio, Users, Scale, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import HeroVideo from "@/components/dashboard/hero-video";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import DataSources from "@/components/agents/data-sources";
import type { SourcePlatform } from "@/lib/data-sources";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "FOMO Radar", href: "/radar" },
  { label: "Predictions", href: "/predictions" },
  { label: "History", href: "/history" },
];

const FEATURES = [
  {
    icon: Radio,
    title: "FOMO Radar",
    description:
      "Live narrative heat across BNB Chain — see which sectors are overheating before the crowd floods in.",
    color: "#3b82f6",
    bg: "#eff6ff",
    href: "/radar",
    tag: "Live",
  },
  {
    icon: Users,
    title: "AI Debate",
    description:
      "Bull and Bear agents argue every side before the Judge delivers a verdict with a confidence score.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    href: "/dashboard",
    tag: "4 Agents",
  },
  {
    icon: Scale,
    title: "Prediction FOMO",
    description:
      "Paste any Polymarket link — we score the crowd psychology driving the bet so you know when to fade.",
    color: "#1652f0",
    bg: "#e9efff",
    href: "/predictions",
    tag: "Polymarket",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Sources",
    description:
      "Every signal traces back to real, public sources. No black boxes — you see exactly what the AI read.",
    color: "#10b981",
    bg: "#f0fdf4",
    href: "/dashboard",
    tag: "Verified",
  },
];

const LANDING_SOURCES: SourcePlatform[] = [
  "x",
  "tiktok",
  "youtube",
  "instagram",
  "reddit",
  "telegram",
  "dexscreener",
  "coinmarketcap",
  "coingecko",
  "bscscan",
  "polymarket",
  "news",
];

const AGENT_STEPS = [
  {
    num: "01",
    name: "Scout",
    color: "#f97316",
    bg: "#fff7ed",
    desc: "Reads DexScreener, CMC & BscScan for volume, momentum and on-chain signals.",
  },
  {
    num: "02",
    name: "Narrative",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    desc: "Scans X, news and YouTube to identify why the market is moving.",
  },
  {
    num: "03",
    name: "Crowd",
    color: "#3b82f6",
    bg: "#eff6ff",
    desc: "Aggregates TikTok, Reddit, Telegram and Instagram chatter into a FOMO score.",
  },
  {
    num: "04",
    name: "Judge",
    color: "#10b981",
    bg: "#f0fdf4",
    desc: "Synthesizes every agent's output and delivers a BUY / SELL / WATCH verdict.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">E</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)] text-sm">Euphoria</span>
        </div>

        <nav className="hidden md:flex items-center gap-6" aria-label="Site navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 rounded"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
        >
          Launch App
          <ArrowRight size={14} aria-hidden />
        </Link>
      </header>

      {/* ── SECTION 1: HERO ────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-between min-h-[calc(100vh-64px)] px-6 sm:px-10 pt-16 pb-10 overflow-hidden"
        aria-labelledby="hero-heading"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(147,197,253,0.18) 0%, transparent 65%), #f5f6fa",
        }}
      >
        {/* Badge + headline */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden />
            <span className="text-xs text-blue-600 font-medium">BNB Chain · Live Intelligence</span>
          </div>

          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl font-bold tracking-tight leading-none"
          >
            Trade Market
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500">
              Emotions,
            </span>{" "}
            Not Charts.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md leading-relaxed">
            AI agents read crowd behavior across social and on-chain data — then show you exactly
            where every signal came from.
          </p>
        </div>

        {/* Interactive video — hero centrepiece (move your cursor over it) */}
        <div className="flex items-center justify-center py-6 w-full">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-elevated)] bg-black cursor-crosshair">
            <HeroVideo src="/hero.mp4" />
          </div>
        </div>

        {/* Search + chips */}
        <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
          <QuickChips />
          <TokenSearchBar />
          <p className="text-xs text-[var(--text-muted)] text-center">
            Not financial advice. Psychological signals for research only.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)]">
          <div className="w-5 h-8 rounded-full border border-[var(--border)] flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" aria-hidden />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FEATURES ────────────────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-10 bg-white border-t border-[var(--border)]" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">Features</span>
            <h2 id="features-heading" className="text-3xl font-bold tracking-tight">
              Everything you need to read the crowd
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md">
              Four AI agents work in sequence, each citing their sources — no black-box decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, description, color, bg, href, tag }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-app)] hover:bg-white hover:border-[var(--text-muted)] hover:shadow-[var(--shadow-elevated)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon size={18} style={{ color }} aria-hidden />
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{ background: bg, color, borderColor: "transparent" }}
                  >
                    {tag}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)] mb-1">{title}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] group-hover:text-blue-500 transition-colors mt-auto">
                  <span>Open</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW AGENTS WORK ────────────────────────────────────── */}
      <section
        className="py-20 px-6 sm:px-10 border-t border-[var(--border)]"
        aria-labelledby="agents-heading"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(147,197,253,0.10) 0%, transparent 70%), #f5f6fa",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Pipeline</span>
            <h2 id="agents-heading" className="text-3xl font-bold tracking-tight">
              Four agents, one verdict
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md">
              Agents run in sequence — each one cites where it read the data, so you can verify the reasoning yourself.
            </p>
          </div>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            {AGENT_STEPS.map(({ num, name, color, bg, desc }) => (
              <li key={num} className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-[var(--border)] shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: bg }}>
                    <Zap size={15} style={{ color }} aria-hidden />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-muted)]">{num}</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)] mb-1">{name} Agent</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── SECTION 4: DATA SOURCE TRANSPARENCY ───────────────────────────── */}
      <section className="py-20 px-6 sm:px-10 bg-white border-t border-[var(--border)]" aria-labelledby="sources-heading">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">Transparency</span>
            <h2 id="sources-heading" className="text-3xl font-bold tracking-tight">
              Every signal. Every source. Visible.
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md">
              Most AI tools are black boxes. Euphoria shows you exactly which platform each agent read
              before scoring your token — click any icon to verify it yourself.
            </p>
          </div>

          <DataSources sources={LANDING_SOURCES} variant="detailed" label="Agents read from" />

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-[0_0_24px_rgba(59,130,246,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
          >
            Launch App — it&apos;s free
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-app)] px-6 sm:px-10 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">E</span>
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Euphoria</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center">
            <strong className="text-[var(--text-secondary)]">Not financial advice.</strong>{" "}
            Euphoria provides psychological signals for research purposes only. BNB Chain · 2026.
          </p>
          <nav className="flex items-center gap-4" aria-label="Footer navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 rounded"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
