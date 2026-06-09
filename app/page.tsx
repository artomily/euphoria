import Link from "next/link";
import { Radio, Users, Scale, ShieldCheck } from "lucide-react";
import FomoOrb from "@/components/dashboard/fomo-orb";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import Greeting from "@/components/layout/greeting";
import DataSources from "@/components/agents/data-sources";
import type { SourcePlatform } from "@/lib/data-sources";

const features = [
  {
    icon: Radio,
    title: "FOMO Radar",
    description: "Live narrative heat across BNB Chain — see which sectors are overheating.",
    color: "#3b82f6",
    bg: "#eff6ff",
    href: "/radar",
  },
  {
    icon: Users,
    title: "AI Debate",
    description: "Bull and Bear agents argue every position before the Judge delivers a verdict.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    href: "/dashboard",
  },
  {
    icon: Scale,
    title: "Prediction FOMO",
    description: "Paste a Polymarket link — we score the crowd psychology driving the bet.",
    color: "#1652f0",
    bg: "#e9efff",
    href: "/predictions",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Sources",
    description: "Every signal is traced to X, TikTok, YouTube, on-chain data and more.",
    color: "#10b981",
    bg: "#f0fdf4",
    href: "/dashboard",
  },
];

// Shown as a marketing strip so visitors see we cite real, public sources.
const LANDING_SOURCES: SourcePlatform[] = [
  "x",
  "tiktok",
  "youtube",
  "instagram",
  "reddit",
  "telegram",
  "dexscreener",
  "coinmarketcap",
  "bscscan",
  "polymarket",
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      {/* ── Left column: branding + features ── */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex flex-col justify-between p-8 lg:p-12 bg-white border-r border-[var(--border)]">
        {/* Logo + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">Euphoria</span>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
          >
            Open App
          </Link>
        </div>

        {/* Hero copy */}
        <div className="flex flex-col gap-4 my-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-blue-600 font-medium">BNB Chain · Live Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            Trade Market
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              Emotions,
            </span>{" "}
            Not Charts.
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">
            AI agents read crowd behavior across social and on-chain data — then show you exactly
            where every signal came from.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(({ icon: Icon, title, description, color, bg, href }) => (
            <Link
              key={title}
              href={href}
              className="p-4 rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)] flex flex-col gap-2 hover:border-[var(--text-muted)] hover:shadow-[var(--shadow-elevated)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <Icon size={15} style={{ color }} aria-hidden />
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>

        {/* Source transparency strip */}
        <div className="mt-8 flex flex-col gap-2.5">
          <DataSources sources={LANDING_SOURCES} variant="compact" label="Signals traced to" />
          <p className="text-xs text-[var(--text-muted)]">
            Euphoria provides psychological signals for research only — not financial advice.
          </p>
        </div>
      </div>

      {/* ── Right column: hero interaction ── */}
      <div
        className="flex-1 hidden lg:flex flex-col px-12 py-8"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 44%, rgba(147,197,253,0.13) 0%, transparent 70%), #f5f6fa",
        }}
      >
        {/* Greeting */}
        <Greeting subtitle="Search a token, or paste a Polymarket bet to scan its FOMO" />

        {/* Orb — centered in remaining space */}
        <div className="flex-1 flex items-center justify-center py-6">
          <FomoOrb
            level="ready"
            label="AI is ready"
            sublabel="Search a token or paste a Polymarket link to begin"
          />
        </div>

        {/* Chips + search */}
        <div className="flex flex-col gap-4">
          <QuickChips />
          <TokenSearchBar />
        </div>
      </div>
    </div>
  );
}
