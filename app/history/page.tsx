import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = { title: "Analysis History" };

// Shown when the user has no wallet connected yet
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

export default function HistoryPage() {
  // Will be replaced with real Supabase data in a future sprint
  const isConnected = false;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Analysis History" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="max-w-5xl mx-auto space-y-5">
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
              <CardContent>
                {!isConnected ? (
                  <EmptyHistory />
                ) : (
                  <p className="text-sm text-text-secondary">History loaded here.</p>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-text-muted">
              <strong className="text-text-secondary">Not financial advice.</strong>{" "}
              Analysis history is stored locally to your wallet connection.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
