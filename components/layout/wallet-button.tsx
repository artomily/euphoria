"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Wallet, LogOut, Copy, Check, ShieldCheck } from "lucide-react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  type Connector,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { truncateAddress } from "@/lib/format";
import {
  fetchVerifiedAddress,
  signInWithEthereum,
  signOut,
} from "@/lib/auth/siwe-client";

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [connectMenuOpen, setConnectMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  // Track which address we've already prompted to sign so we don't loop.
  const attemptedRef = useRef<string | null>(null);

  const isVerified =
    !!address && !!verifiedAddress && verifiedAddress === address.toLowerCase();

  const runSiwe = useCallback(async () => {
    if (!address || !chainId) return;
    setSigning(true);
    try {
      const verified = await signInWithEthereum({
        address,
        chainId,
        signMessageAsync,
      });
      setVerifiedAddress(verified);
    } catch {
      // User rejected or verification failed — stay connected but unverified.
    } finally {
      setSigning(false);
    }
  }, [address, chainId, signMessageAsync]);

  // On connect, hydrate the existing session, then auto-prompt SIWE once if the
  // connected wallet isn't the one already verified.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isConnected || !address) {
        attemptedRef.current = null;
        if (!cancelled) setVerifiedAddress(null);
        return;
      }
      const verified = await fetchVerifiedAddress();
      if (cancelled) return;
      setVerifiedAddress(verified);
      const lower = address.toLowerCase();
      if (verified !== lower && attemptedRef.current !== lower) {
        attemptedRef.current = lower;
        void runSiwe();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isConnected, address, runSiwe]);

  const handleConnect = (connector: Connector) => {
    setConnectMenuOpen(false);
    connect({ connector });
  };

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Fallback for when clipboard API is unavailable or permission denied.
      const el = document.createElement("textarea");
      el.value = address;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDisconnect = async () => {
    setAccountMenuOpen(false);
    await signOut();
    setVerifiedAddress(null);
    attemptedRef.current = null;
    disconnect();
  };

  // ─── Disconnected: connector picker ─────────────────────────────────────────
  if (!isConnected || !address) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConnectMenuOpen((o) => !o)}
          loading={connecting}
          className="gap-1.5"
          aria-haspopup="menu"
          aria-expanded={connectMenuOpen}
        >
          <Wallet className="w-3.5 h-3.5" aria-hidden />
          Connect Wallet
        </Button>

        {connectMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setConnectMenuOpen(false)} aria-hidden />
            <div
              className="absolute right-0 top-full mt-1 z-20 w-56 rounded-xl glass-elevated overflow-hidden"
              role="menu"
              aria-label="Choose a wallet"
            >
              <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                Connect a wallet
              </p>
              {connectors.length === 0 && (
                <p className="px-3 py-2.5 text-sm text-text-secondary">
                  No wallet detected. Install MetaMask or enable WalletConnect.
                </p>
              )}
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-black/[0.04] motion-safe:transition-colors motion-safe:duration-100 focus-visible:outline-none focus-visible:bg-black/[0.04]"
                  onClick={() => handleConnect(connector)}
                  role="menuitem"
                >
                  {connector.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={connector.icon} alt="" className="w-4 h-4 rounded" aria-hidden />
                  ) : (
                    <Wallet className="w-3.5 h-3.5" aria-hidden />
                  )}
                  {connector.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Connected: address pill + account menu ─────────────────────────────────
  return (
    <div className="relative">
      <button
        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
          "border border-border-subtle bg-bg-elevated",
          "text-text-primary",
          "motion-safe:transition-colors motion-safe:duration-100",
          "hover:border-black/15 hover:bg-black/[0.03]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-bg-app"
        )}
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
        aria-label={`Wallet: ${address}${isVerified ? " (verified)" : " (unverified)"}`}
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0",
            signing ? "bg-signal-watch motion-safe:animate-pulse" : isVerified ? "bg-accent-emerald" : "bg-signal-watch"
          )}
          aria-hidden
        />
        <span className="font-mono text-xs">{truncateAddress(address)}</span>
      </button>

      {accountMenuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAccountMenuOpen(false)} aria-hidden />
          <div
            className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl glass-elevated overflow-hidden"
            role="menu"
            aria-label="Wallet options"
          >
            <p className="px-3 pt-2.5 pb-1.5 text-[11px] text-text-muted">
              {signing
                ? "Awaiting signature…"
                : isVerified
                  ? "Verified · signed in"
                  : "Connected · not verified"}
            </p>

            <button
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-black/[0.04] motion-safe:transition-colors motion-safe:duration-100 focus-visible:outline-none focus-visible:bg-black/[0.04]"
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

            {!isVerified && (
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-black/[0.04] motion-safe:transition-colors motion-safe:duration-100 focus-visible:outline-none focus-visible:bg-black/[0.04] disabled:opacity-50"
                onClick={() => { setAccountMenuOpen(false); void runSiwe(); }}
                disabled={signing}
                role="menuitem"
              >
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                Verify wallet
              </button>
            )}

            <div className="h-px bg-border-subtle mx-3" role="separator" />
            <button
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-signal-sell hover:bg-red-500/5 motion-safe:transition-colors motion-safe:duration-100 focus-visible:outline-none focus-visible:bg-red-500/5"
              onClick={handleDisconnect}
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
