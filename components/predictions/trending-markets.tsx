import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { TRENDING_MARKETS } from "@/lib/predictions";
import { formatUSD } from "@/lib/format";

export default function TrendingMarkets() {
  return (
    <section aria-labelledby="trending-heading">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={15} className="text-blue-500" aria-hidden />
        <h2 id="trending-heading" className="text-sm font-semibold text-[var(--text-primary)]">
          Trending bets to scan
        </h2>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3" role="list">
        {TRENDING_MARKETS.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/predictions?m=${encodeURIComponent(m.slug)}`}
              className="group flex flex-col gap-3 h-full p-4 rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)] hover:border-blue-300 hover:shadow-[var(--shadow-elevated)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                  {m.category}
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-[var(--text-muted)] group-hover:text-blue-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0"
                  aria-hidden
                />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] leading-snug flex-1">
                {m.question}
              </p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="font-mono tabular-nums">
                  YES <span className="text-[var(--text-secondary)]">{m.yesPrice}%</span>
                </span>
                <span className="font-mono tabular-nums">{formatUSD(m.volumeUsd)} vol</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
