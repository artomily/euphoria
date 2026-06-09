"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Radio, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/radar", icon: Radio, label: "FOMO Radar" },
  { href: "/history", icon: History, label: "History" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-12 shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border)] h-full">
      {/* Logo mark */}
      <div className="flex items-center justify-center h-14 border-b border-[var(--border)]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">E</span>
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 py-3 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                active
                  ? "text-[var(--text-primary)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-r-full" />
              )}
              <Icon size={18} />
            </Link>
          );
        })}
      </nav>

      {/* Bottom: settings */}
      <div className="flex items-center justify-center pb-4">
        <Link
          href="/settings"
          title="Settings"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <Settings size={18} />
        </Link>
      </div>
    </aside>
  );
}
