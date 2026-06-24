import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getSession } from "@/lib/auth/session";
import { listAnalyses, type AnalysisListItem } from "@/lib/db/analyses";
import { isDbConfigured } from "@/lib/db/client";

export const metadata: Metadata = { title: "Analysis History" };

// Analyses are read live from Neon, scoped to the verified wallet session.
export const dynamic = "force-dynamic";

// Shown when no wallet is verified yet, or there are no analyses.
function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-border-subtle">
        <Clock className="w-5 h-5 text-text-muted" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-text-primary">No analyses yet</p>
        <p className="text-xs text-text-secondary max-w-xs">
          Connect your wallet and analyze a token to start building your history.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-accent-emerald hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald focus-visible:rounded"
      >
        Analyze your first token
        <ArrowRight className="w-3.5 h-3.5" aria-hidden />
      </Link>
    </div>
  );
}

function decisionVariant(decision: string): "buy" | "sell" | "watch" {
  if (decision === "BUY") return "buy";
  if (decision === "SELL") return "sell";
  return "watch";
}

function HistoryRow({ item }: { item: AnalysisListItem }) {
  const when = new Date(item.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <Link
      href={`/token/${item.symbol}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald"
    >
      <span className="font-mono text-sm font-semibold text-text-primary w-20 shrink-0">${item.symbol}</span>
      <Badge variant={decisionVariant(item.decision)}>{item.decision}</Badge>
      <Badge variant="narrative">{item.narrative}</Badge>
      <span className="text-xs text-text-muted font-mono hidden sm:inline">
        FOMO {item.fomo_score} · {item.confidence}% conf
      </span>
      <span className="ml-auto text-xs text-text-muted">{when}</span>
      <ChevronRight className="w-4 h-4 text-text-muted shrink-0" aria-hidden />
    </Link>
  );
}

export default async function HistoryPage() {
  const session = isDbConfigured() ? await getSession() : null;
  const analyses = session ? await listAnalyses(session.address) : [];

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Analysis History" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="space-y-5">
            <div>
              <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-emerald" aria-hidden />
                Analysis History
              </h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Your past token analyses and Judge verdicts.
              </p>
            </div>

            <Card>
              <CardContent className={analyses.length > 0 ? "p-2" : undefined}>
                {!session || analyses.length === 0 ? (
                  <EmptyHistory />
                ) : (
                  <div className="flex flex-col">
                    {analyses.map((item) => (
                      <HistoryRow key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-text-muted">
              <strong className="text-text-secondary">Not financial advice.</strong>{" "}
              History is scoped to your verified wallet.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
