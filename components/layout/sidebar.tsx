"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Scale,
  LineChart,
  History,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections: {
  title: string;
  items: { href: string; icon: typeof LayoutDashboard; label: string; hint?: string }[];
}[] = [
  {
    title: "Analyze",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/radar", icon: Radio, label: "FOMO Radar" },
      { href: "/backtest", icon: LineChart, label: "Backtest", hint: "Strategy" },
      { href: "/predictions", icon: Scale, label: "Predictions", hint: "Coming Soon" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/history", icon: History, label: "History" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border)] h-full">
      {/* Wordmark */}
      <Link
        href="/"
        className="flex items-center gap-2.5 h-14 px-4 border-b border-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">E</span>
        </div>
        <span className="text-sm font-semibold text-[var(--text-primary)]">Euphoria</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-5 py-4 px-3 flex-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {section.title}
            </p>
            {section.items.map(({ href, icon: Icon, label, hint }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40",
                    active
                      ? "text-[var(--text-primary)] bg-[var(--bg-elevated)] font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
                  )}
                  <Icon size={17} className="shrink-0" />
                  <span className="flex-1">{label}</span>
                  {hint && (
                    <span className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-app)] border border-[var(--border)] rounded px-1.5 py-0.5">
                      {hint}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Transparency footer */}
      <div className="px-3 pb-4">
        <div className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-app)] px-2.5 py-2">
          <ShieldCheck size={14} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden />
          <p className="text-[11px] leading-snug text-[var(--text-muted)]">
            Every signal is traced to its source — X, TikTok, YouTube & on-chain data.
          </p>
        </div>
      </div>
    </aside>
  );
}
