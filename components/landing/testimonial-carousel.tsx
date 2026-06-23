"use client";

import { useState } from "react";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Euphoria turned market noise into a clear read on the crowd. I check the Judge's verdict before every entry — it's become part of my routine.",
    name: "Savannah Watson",
    role: "Swing trader",
    initials: "SW",
  },
  {
    quote:
      "The agent debate is the part that sold me. Seeing the bull and bear cases side by side keeps me honest about my own FOMO.",
    name: "Marcus Lim",
    role: "DeFi researcher",
    initials: "ML",
  },
  {
    quote:
      "I stopped chasing green candles. Now I read the narrative and the FOMO score first — calmer decisions, fewer regrets.",
    name: "Priya Anand",
    role: "Long-term holder",
    initials: "PA",
  },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="flex flex-col gap-6">
      {/* Light card on the dark section */}
      <div className="rounded-3xl bg-[#ede9fe] p-7 sm:p-9">
        <Quote className="w-7 h-7 text-[#6d28d9] mb-4" aria-hidden />
        <blockquote className="text-lg sm:text-xl text-[#2e1065] leading-relaxed font-medium">
          {t.quote}
        </blockquote>
        <div className="flex items-center gap-3 mt-7 pt-5 border-t border-[#6d28d9]/15">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7c3aed] text-white text-sm font-semibold shrink-0"
            aria-hidden
          >
            {t.initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-[#2e1065]">{t.name}</p>
            <p className="text-xs text-[#6d28d9]/70">{t.role}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-white/50" aria-hidden>
          {String(index + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ArrowLeft size={16} aria-hidden />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
