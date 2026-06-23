import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  TrendingUp,
  Brain,
  Users,
  Shield,
  Gavel,
  Radio,
  Sparkles,
  Check,
} from "lucide-react";
import Faq from "@/components/landing/faq";
import TestimonialCarousel from "@/components/landing/testimonial-carousel";
import { CountUp } from "@/components/layout/page-animate";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "FOMO Radar", href: "/radar" },
  { label: "Treatments", href: "#treatments" },
  { label: "Signals", href: "#signals" },
  { label: "FAQ", href: "#faq" },
];

const TREATMENTS = [
  {
    icon: TrendingUp,
    title: "Momentum read",
    desc: "Scout scores volume and momentum from live on-chain and market data — sustainable interest, or a fading pump.",
    featured: true,
  },
  { icon: Brain, title: "Narrative scan", desc: "Identify the story driving attention before the crowd names it." },
  { icon: Users, title: "Crowd FOMO score", desc: "Quantify crowd excitement on a 0–100 scale from social signals." },
  { icon: Shield, title: "Bubble risk check", desc: "A contrarian pass that rates how likely the move is to reverse." },
  { icon: Gavel, title: "Judge verdict", desc: "A single BUY / SELL / WATCH call, with calibrated confidence." },
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
  "binance",
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
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] antialiased">
      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[var(--bg-app)]/85 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-12 h-16">
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded-lg">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND}, ${PURPLE_DARK})` }}>E</span>
            <span className="font-semibold text-sm tracking-tight">Euphoria</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)]"
            style={{ background: BRAND }}
          >
            Launch app
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </header>

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-12 pt-4" aria-labelledby="hero-heading">
        <div
          className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden min-h-[520px] sm:min-h-[600px] flex flex-col justify-between p-7 sm:p-10"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, #ddd6fe 0%, transparent 55%), radial-gradient(120% 100% at 90% 20%, #c7d2fe 0%, transparent 50%), radial-gradient(140% 120% at 60% 110%, #4c1d95 0%, transparent 60%), linear-gradient(160deg, #ede9fe 0%, #ddd6fe 100%)",
          }}
        >
          {/* Soft floating orbs for depth */}
          <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }} aria-hidden />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }} aria-hidden />

          {/* Top meta row */}
          <div className="relative flex items-center justify-between text-[11px] font-mono uppercase tracking-widest" style={{ color: "rgba(46,16,101,0.7)" }}>
            <span>Euphoria — Edition 1.0</span>
            <span className="hidden sm:inline">BNB Chain · Live</span>
          </div>

          {/* Floating glass verdict card */}
          <div className="hidden lg:block absolute right-10 top-24 w-56 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(46,16,101,0.18)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: PURPLE_DARK }}>Live verdict</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">BUY</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <CountUp value={84} className="text-3xl font-mono font-semibold" />
              <span className="text-xs font-mono" style={{ color: "rgba(46,16,101,0.6)" }}>% conf</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(46,16,101,0.1)" }}>
              <div className="h-full w-[84%] rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] mt-2 leading-snug" style={{ color: "rgba(46,16,101,0.6)" }}>FOMO 72 · narrative confirmed</p>
          </div>

          {/* Headline + CTA */}
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-auto">
            <div className="max-w-xl">
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.05]" style={{ color: "#1e1b4b" }}>
                Thoughtful intelligence
                <br /> for your trades.
                <br /> Built to read the crowd.
              </h1>
            </div>
            <div className="flex flex-col gap-4 sm:items-end sm:text-right">
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: "rgba(46,16,101,0.8)" }}>
                A calm approach to the market — AI agents that surface psychology, not hype, before you act.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 self-start sm:self-end"
                style={{ background: BRAND }}
              >
                Launch app
                <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: QUOTE / INTRO ────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-24" aria-label="Approach">
        <div className="max-w-6xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">[ Approach ]</span>
          <div className="grid lg:grid-cols-12 gap-6 mt-5 items-start">
            {/* Left: visual + rating */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div
                className="rounded-2xl h-44 relative overflow-hidden"
                style={{ background: "radial-gradient(120% 120% at 20% 20%, #ddd6fe 0%, #4c1d95 120%)" }}
                aria-hidden
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white/70" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden />
                <span className="text-sm font-mono font-medium">5.0</span>
                <span className="text-xs text-[var(--text-muted)]">Member rating</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
                &ldquo;This changed how I read a market entirely.&rdquo;
              </p>
            </div>

            {/* Center: big quote */}
            <div className="lg:col-span-5">
              <p className="text-2xl sm:text-3xl font-medium leading-snug text-[var(--text-primary)]">
                &ldquo; We approach market psychology as a disciplined practice — built to surface clarity,
                conviction, and a calmer kind of edge. &rdquo;
              </p>
            </div>

            {/* Right: small card + accent stat card */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm text-[var(--text-secondary)] mb-3">Join thousands reading the crowd before they trade.</p>
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: BRAND }}>
                  Launch app <ArrowRight size={13} aria-hidden />
                </Link>
              </div>
              {/* Accent metric card (maps to the reference's bright stat card) */}
              <div className="rounded-2xl p-4" style={{ background: LILAC }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium" style={{ color: PURPLE_DARK }}>Analyses today</span>
                  <Radio className="w-3.5 h-3.5" style={{ color: PURPLE_DARK }} aria-hidden />
                </div>
                <CountUp value={1847} className="text-3xl font-mono font-semibold block" />
                <div className="flex items-end gap-1 mt-3 h-8" aria-hidden>
                  {[40, 65, 50, 80, 60, 90, 70, 100, 75, 85].map((h, i) => (
                    <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: BRAND, opacity: 0.85 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SIGNAL SUPPORT ───────────────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-20 bg-white border-y border-[var(--border)]" aria-labelledby="support-heading">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 id="support-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-md">
              Signal support for balanced decisions
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">[ Pipeline ]</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {SUPPORT_TAGS.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] bg-[var(--bg-app)]">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            {/* Specialist / Judge persona card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-app)] p-6 flex flex-col">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-14 h-14 rounded-full text-white text-lg font-semibold shrink-0" style={{ background: "linear-gradient(135deg, #a78bfa, #4c1d95)" }} aria-hidden>
                  JG
                </span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">The Judge Agent</p>
                  <p className="text-sm text-[var(--text-secondary)]">Your final verdict</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-5 italic">
                &ldquo; I weigh every agent — market data, narrative, crowd FOMO and bubble risk — into one calibrated
                call, and I always show my reasoning. &rdquo;
              </p>
              <ul className="mt-5 space-y-2.5">
                {["Synthesizes four independent signals", "Calibrated confidence, never overconfident", "Plain-language reasoning you can audit"].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BRAND }} aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded" style={{ color: BRAND }}>
                See it work <ArrowRight size={13} aria-hidden />
              </Link>
            </div>

            {/* Data visual card (maps to the reference's 1,800 / 142 nutrition card) */}
            <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: PURPLE_DARK }}>
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-2xl opacity-40" style={{ background: "#a78bfa" }} aria-hidden />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-white/70 font-medium">Latest read · $BNB</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200">WATCH</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <CountUp value={72} className="text-4xl font-mono font-semibold block" />
                    <p className="text-xs text-white/60 mt-1">FOMO score</p>
                  </div>
                  <div>
                    <CountUp value={142} className="text-4xl font-mono font-semibold block" />
                    <p className="text-xs text-white/60 mt-1">Narratives tracked</p>
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-16" aria-hidden>
                  {[35, 55, 45, 70, 60, 85, 65, 95, 75, 88, 70, 92].map((h, i) => (
                    <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: "#c4b5fd" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: DISCOVER TREATMENTS ──────────────────────────────────── */}
      <section id="treatments" className="px-5 sm:px-8 lg:px-12 py-16 sm:py-24 scroll-mt-20" aria-labelledby="treatments-heading">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <h2 id="treatments-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-md">
              Discover the read that&apos;s right for you
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
              Five focused agents. Pick a signal, or let the Judge combine all of them.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left visual with floating verdict-style card */}
            <div
              className="rounded-2xl relative overflow-hidden min-h-[360px] flex items-end p-5"
              style={{ background: "radial-gradient(110% 110% at 25% 15%, #ddd6fe 0%, #4c1d95 110%)" }}
            >
              <div className="absolute top-5 left-5 w-2.5 h-2.5 rounded-full bg-white/80 animate-pulse" aria-hidden />
              <div className="w-full rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-[0_12px_40px_rgba(46,16,101,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[var(--text-secondary)]">Sample verdict</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: BRAND }}>FREE</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)]">FOMO</p>
                    <p className="font-mono text-lg font-semibold">19</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--text-muted)]">Confidence</p>
                    <p className="font-mono text-lg font-semibold">33%</p>
                  </div>
                  <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: BRAND }}>
                    Analyze <ArrowRight size={12} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right list */}
            <ul className="flex flex-col">
              {TREATMENTS.map(({ icon: Icon, title, desc, featured }) => (
                <li key={title} className="border-b border-[var(--border)] last:border-0 py-5 first:pt-0">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] shrink-0" style={{ color: BRAND }} aria-hidden>
                      <Icon size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[var(--text-primary)]">{title}</h3>
                        {featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden /> 5.0
                          </span>
                        )}
                      </div>
                      {featured && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1.5">{desc}</p>
                      )}
                      {featured && (
                        <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-white motion-safe:transition-colors mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: BRAND }}>
                          Run this read <ArrowRight size={12} aria-hidden />
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: DAILY SIGNALS (PRODUCTS) ─────────────────────────────── */}
      <section id="signals" className="px-5 sm:px-8 lg:px-12 py-16 sm:py-20 bg-white border-y border-[var(--border)] scroll-mt-20" aria-labelledby="signals-heading">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 id="signals-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-lg">
              Daily signals crafted to support your natural rhythm
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">[ The agents ]</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SIGNAL_CARDS.map(({ name, tag, from, to, initials }) => (
              <div key={name} className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-app)] p-4 flex flex-col">
                <div
                  className="rounded-xl h-40 mb-4 relative overflow-hidden flex items-center justify-center"
                  style={{ background: `radial-gradient(120% 120% at 30% 20%, ${from} 0%, ${to} 120%)` }}
                  aria-hidden
                >
                  <span className="font-mono text-2xl font-bold text-white/90">{initials}</span>
                  <span className="absolute top-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-sm">LIVE</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm">{name} Agent</p>
                    <p className="text-xs text-[var(--text-muted)]">{tag}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden /> 5.0
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-app)] motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple">
              See all agents in action <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIAL (DARK PURPLE) ────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-24" aria-labelledby="testimonial-heading">
        <div className="max-w-6xl mx-auto rounded-3xl p-7 sm:p-12" style={{ background: PURPLE_DARK }}>
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/50">[ Members ]</span>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mt-4 items-center">
            <h2 id="testimonial-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              Built on signals that traders learn to trust
            </h2>
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="px-5 sm:px-8 lg:px-12 py-16 sm:py-24 scroll-mt-20" aria-labelledby="faq-heading">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-muted)]">[ FAQ ]</span>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight mt-3">
              Everything you need to know
            </h2>
            <div className="rounded-2xl p-5 mt-8" style={{ background: LILAC }}>
              <p className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: PURPLE_DARK }}>Still curious?</p>
              <p className="text-sm mb-4" style={{ color: PURPLE_DARK }}>Run a free analysis and watch the agents work.</p>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple" style={{ background: BRAND }}>
                Launch app <ArrowRight size={13} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Faq />
          </div>
        </div>
      </section>

      {/* ── FOOTER (DARK PURPLE) ────────────────────────────────────────────── */}
      <footer className="px-5 sm:px-8 lg:px-12 pt-16 pb-10" style={{ background: PURPLE_DEEP }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-10 pb-12 border-b border-white/10">
            <div className="max-w-sm">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                Begin your journey into reading the crowd.
              </h2>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold motion-safe:transition-colors mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" style={{ background: LILAC, color: PURPLE_DARK }}>
                Launch app <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <FooterCol title="Product" links={[["FOMO Radar", "/radar"], ["Predictions", "/predictions"], ["History", "/history"], ["Backtest", "/backtest"]]} />
              <FooterCol title="Agents" links={[["Scout", "/dashboard"], ["Narrative", "/dashboard"], ["Crowd", "/dashboard"], ["Judge", "/dashboard"]]} />
              <FooterCol title="More" links={[["FAQ", "#faq"], ["Treatments", "#treatments"], ["Dashboard", "/dashboard"]]} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold" style={{ background: LILAC, color: PURPLE_DARK }}>E</span>
              <span className="text-sm font-semibold text-white">Euphoria</span>
            </div>
            <p className="text-xs text-white/50 text-center max-w-md">
              <strong className="text-white/70">Not financial advice.</strong> Psychological signals for research only. BNB Chain · 2026.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-white/70 hover:text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
