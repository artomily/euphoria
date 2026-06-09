import type { Metadata } from "next";
import { Scale, Sparkles } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import PredictionPasteBar from "@/components/predictions/prediction-paste-bar";
import TrendingMarkets from "@/components/predictions/trending-markets";
import BetFomoCard from "@/components/predictions/bet-fomo-card";
import { analyzeBet, parsePolymarketSlug } from "@/lib/predictions";

export const metadata: Metadata = {
  title: "Prediction FOMO · Euphoria",
  description: "Paste a Polymarket link and Euphoria scores the crowd psychology driving the bet.",
};

interface PredictionsPageProps {
  searchParams: Promise<{ m?: string }>;
}

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Paste a bet",
    body: "Drop any Polymarket event link — crypto, politics, sports, or macro.",
  },
  {
    step: "2",
    title: "Agents read the crowd",
    body: "We scan X, TikTok, YouTube, Reddit & news for chatter around the question.",
  },
  {
    step: "3",
    title: "Get a FOMO verdict",
    body: "A FOMO score plus a Fade / Follow / Watch call — with every source shown.",
  },
];

export default async function PredictionsPage({ searchParams }: PredictionsPageProps) {
  const { m } = await searchParams;
  const slug = m ? parsePolymarketSlug(m) : null;
  const analysis = slug ? analyzeBet(slug) : null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title="Prediction FOMO" />
        <main className="flex-1 overflow-y-auto px-6 py-6" id="main-content">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Intro */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
                <Scale size={13} className="text-blue-600" aria-hidden />
                <span className="text-xs font-medium text-blue-600">Polymarket × Euphoria</span>
              </div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                Score the FOMO behind any bet
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
                Prediction markets price the odds. Euphoria reads the crowd psychology around them —
                so you can tell genuine momentum from a herd about to be faded.
              </p>
            </div>

            {/* Paste bar */}
            <PredictionPasteBar autoFocus={!analysis} />

            {/* Result or discovery */}
            {analysis ? (
              <div className="space-y-6">
                <BetFomoCard analysis={analysis} />
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Sparkles size={13} aria-hidden />
                  Scan another market with the bar above, or explore what&apos;s trending below.
                </div>
                <TrendingMarkets />
              </div>
            ) : (
              <>
                <TrendingMarkets />

                {/* How it works */}
                <section aria-labelledby="how-heading" className="pt-2">
                  <h2 id="how-heading" className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    How it works
                  </h2>
                  <ol className="grid sm:grid-cols-3 gap-3">
                    {HOW_IT_WORKS.map(({ step, title, body }) => (
                      <li
                        key={step}
                        className="p-4 rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-card)]"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-2.5">
                          {step}
                        </span>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{body}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-[var(--text-muted)] pb-2">
              <strong className="text-[var(--text-secondary)]">Not financial advice.</strong>{" "}
              Euphoria measures crowd psychology, not bet outcomes. Prediction markets are speculative.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
