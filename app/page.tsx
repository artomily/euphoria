import Link from "next/link";
import { Radio, Users, BookOpen, BarChart2 } from "lucide-react";
import FomoOrb from "@/components/dashboard/fomo-orb";
import QuickChips from "@/components/dashboard/quick-chips";
import TokenSearchBar from "@/components/token/token-search-bar";
import Greeting from "@/components/layout/greeting";

const features = [
  {
    icon: Radio,
    title: "FOMO Radar",
    description: "Live narrative heat scores across BNB Chain — see which sectors are overheating.",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    icon: Users,
    title: "AI Debate",
    description: "Bull and Bear agents argue every position before the Judge delivers a verdict.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    icon: BookOpen,
    title: "Narrative Discovery",
    description: "Know exactly why a token is moving — AI, DeFi, Meme, RWA, and more.",
    color: "#f97316",
    bg: "#fff7ed",
  },
  {
    icon: BarChart2,
    title: "FOMO Meter",
    description: "A single 0–100 score that quantifies crowd psychology for any token.",
    color: "#10b981",
    bg: "#f0fdf4",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">

      {/* ── Left column: branding + features ── */}
      <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 flex flex-col justify-between p-8 lg:p-12 bg-white border-r border-[var(--border)]">

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
            className="px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
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
            Trade Market<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              Emotions,
            </span>{" "}
            Not Charts.
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm">
            AI agents analyze crowd behavior, narratives, and FOMO signals so you understand
            the psychology behind every price move.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="p-4 rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)] flex flex-col gap-2"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={15} style={{ color }} />
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-[var(--text-muted)]">
          Euphoria provides psychological signals for research purposes only — not financial advice.
        </p>
      </div>

      {/* ── Right column: hero interaction ── */}
      <div
        className="flex-1 hidden lg:flex flex-col px-12 py-8"
        style={{
          background: "radial-gradient(ellipse 65% 50% at 50% 44%, rgba(147,197,253,0.13) 0%, transparent 70%), #f5f6fa",
        }}
      >
        {/* Greeting */}
        <Greeting subtitle="Euphoria · Launching soon" />

        {/* Orb — centered in remaining space */}
        <div className="flex-1 flex items-center justify-center py-6">
          <FomoOrb
            level="ready"
            label="AI is ready"
            sublabel="Waiting for your instructions or voice command"
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
