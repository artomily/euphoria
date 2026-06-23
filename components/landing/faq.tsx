"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

const ITEMS: FaqItem[] = [
  {
    q: "How does Euphoria read market emotion?",
    a: "Four AI agents work in sequence — Scout reads market data, Narrative finds the story, Crowd scores FOMO, and Reverse argues the bubble case. A Judge then weighs all four into a single BUY, SELL, or WATCH verdict with a confidence score.",
  },
  {
    q: "How much time does one analysis take?",
    a: "About six seconds end to end. Scout and the heuristics run instantly; the three language-model agents run in parallel where possible, so you get a full verdict without waiting on a slow pipeline.",
  },
  {
    q: "Can beginners use this?",
    a: "Yes. Search a token, read the conversation between the agents, and the Judge explains its reasoning in plain language. No charts or indicators to learn — the psychology is the signal.",
  },
  {
    q: "Where does the data come from?",
    a: "Public, traceable sources: DexScreener, CoinMarketCap and BscScan for market and on-chain data, plus social chatter. Every agent cites what it read, so you can verify the reasoning yourself.",
  },
  {
    q: "Is any of this financial advice?",
    a: "No. Euphoria produces psychological signals for research and education only. Never trade solely on an AI verdict — a disclaimer sits beside every decision for that reason.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-[var(--border)]">
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex items-center justify-between gap-4 w-full py-5 text-left motion-safe:transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)] rounded-sm"
              >
                <span className="text-base sm:text-lg font-medium text-[var(--text-primary)]">
                  {item.q}
                </span>
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] shrink-0 text-[var(--text-secondary)]"
                  aria-hidden
                >
                  {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className={cn(
                "grid motion-safe:transition-all motion-safe:duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-prose pr-12">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
