// ─── Live BNB Chain Markets ──────────────────────────────────────────────────
// Replaces the old hardcoded "Recent Agent Activity" demo cards with a real,
// volume-ranked market snapshot pulled from DexScreener. Server Component —
// fetched on the server and cached via the Next Data Cache (revalidate in the
// dexscreener client). Each card links into the live analysis for that token.

import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { fetchTrendingBscTokens } from "@/lib/dexscreener";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

function formatPrice(price: number): string {
  if (price <= 0) return "—";
  if (price < 1) return `$${price.toFixed(6)}`;
  return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export default async function LiveMarkets() {
  const tokens = await fetchTrendingBscTokens(8);

  // If the feed is unreachable, render nothing rather than fake placeholders.
  if (tokens.length === 0) return null;

  return (
    <section aria-labelledby="markets-heading">
      <div className="flex items-center justify-between mb-3">
        <h2
          id="markets-heading"
          className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]"
        >
          Live BNB Chain Markets
        </h2>
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" aria-hidden />
          Live · ranked by 24h volume
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tokens.map((t) => {
          const pct = Number(t.price_change_24h.toFixed(2));
          const up = pct >= 0;
          return (
            <Link
              key={t.symbol}
              href={`/token/${t.symbol}`}
              className="group rounded-xl bg-white border border-[var(--border)] shadow-[var(--shadow-card)] p-3.5 hover:shadow-[var(--shadow-elevated)] motion-safe:transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-sm text-[var(--text-primary)]">
                  {t.symbol}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-mono text-xs font-semibold",
                    up ? "text-signal-buy" : "text-signal-sell",
                  )}
                >
                  {up ? <ArrowUp className="w-3 h-3" aria-hidden /> : <ArrowDown className="w-3 h-3" aria-hidden />}
                  {up ? "+" : ""}
                  {pct.toFixed(2)}%
                </span>
              </div>
              <div className="font-mono text-lg font-bold text-[var(--text-primary)] mt-1.5">
                {formatPrice(t.price)}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Vol {formatUSD(t.volume_24h)} · 24h
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
