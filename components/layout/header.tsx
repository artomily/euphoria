"use client";

import { PanelLeft } from "lucide-react";
import { WalletButton } from "./wallet-button";
import ThemeToggle from "./theme-toggle";
import { useUI } from "./ui-context";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <header className="flex items-center gap-3 h-14 px-6 border-b border-border-subtle bg-bg-base/80 backdrop-blur-sm sticky top-0 z-10">
      {sidebarCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Show sidebar"
          title="Show sidebar"
          className="flex items-center justify-center w-8 h-8 -ml-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
        >
          <PanelLeft size={18} aria-hidden />
        </button>
      )}

      {title && (
        <h1 className="text-sm font-medium text-text-secondary">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" aria-hidden />
          <span>BNB Chain</span>
        </div>
        <ThemeToggle />
        <WalletButton />
      </div>
    </header>
  );
}
