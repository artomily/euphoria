"use client";

import { useState } from "react";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { truncateAddress } from "@/lib/format";

interface WalletButtonProps {
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function WalletButton({ address, onConnect, onDisconnect }: WalletButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!address) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onConnect}
        className="gap-1.5"
      >
        <Wallet className="w-3.5 h-3.5" aria-hidden />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
          "border border-border-subtle bg-bg-elevated",
          "text-text-primary",
          "motion-safe:transition-colors motion-safe:duration-100",
          "hover:border-white/20 hover:bg-white/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        )}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={`Wallet: ${address}`}
      >
        <span className="w-2 h-2 rounded-full bg-accent-emerald shrink-0" aria-hidden />
        <span className="font-mono text-xs">{truncateAddress(address)}</span>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
          <div
            className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl glass-elevated overflow-hidden shadow-xl"
            role="menu"
            aria-label="Wallet options"
          >
            <button
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 motion-safe:transition-colors motion-safe:duration-100 focus-visible:outline-none focus-visible:bg-white/5"
              onClick={handleCopy}
              role="menuitem"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-accent-emerald" aria-hidden />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden />
              )}
              {copied ? "Copied!" : "Copy address"}
            </button>
            <div className="h-px bg-border-subtle mx-3" role="separator" />
            <button
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-signal-sell hover:bg-red-500/5 motion-safe:transition-colors motion-safe:duration-100 focus-visible:outline-none focus-visible:bg-red-500/5"
              onClick={() => { setMenuOpen(false); onDisconnect?.(); }}
              role="menuitem"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
