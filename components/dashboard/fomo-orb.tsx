"use client";

import { motion } from "framer-motion";

type FomoLevel = "calm" | "interest" | "bullish" | "fomo" | "euphoria" | "ready";

interface FomoOrbProps {
  level?: FomoLevel;
  score?: number;
  label?: string;
  sublabel?: string;
}

const levelConfig: Record<
  FomoLevel,
  { from: string; via: string; to: string; glow: string; ambient: string }
> = {
  ready:    { from: "#bfdbfe", via: "#a5b4fc", to: "#c4b5fd", glow: "rgba(147,197,253,0.5)", ambient: "rgba(147,197,253,0.12)" },
  calm:     { from: "#6ee7b7", via: "#34d399", to: "#10b981", glow: "rgba(52,211,153,0.45)", ambient: "rgba(52,211,153,0.10)" },
  interest: { from: "#d9f99d", via: "#a3e635", to: "#84cc16", glow: "rgba(163,230,53,0.40)", ambient: "rgba(163,230,53,0.09)" },
  bullish:  { from: "#fef08a", via: "#fbbf24", to: "#f59e0b", glow: "rgba(251,191,36,0.45)", ambient: "rgba(251,191,36,0.10)" },
  fomo:     { from: "#fed7aa", via: "#fb923c", to: "#f97316", glow: "rgba(251,146,60,0.45)", ambient: "rgba(251,146,60,0.10)" },
  euphoria: { from: "#fca5a5", via: "#f87171", to: "#ef4444", glow: "rgba(248,113,113,0.45)", ambient: "rgba(248,113,113,0.10)" },
};

export default function FomoOrb({
  level = "ready",
  score,
  label = "AI is ready",
  sublabel = "Waiting for your instructions or voice command",
}: FomoOrbProps) {
  const { from, via, to, glow, ambient } = levelConfig[level];

  return (
    <div className="flex flex-col items-center gap-8 relative">
      {/* Ambient background glow (large, soft, behind everything) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -60%)",
          background: `radial-gradient(circle, ${ambient} 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
      />

      {/* Orb */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Mid glow ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-60px",
            background: `radial-gradient(circle, ${glow} 0%, transparent 65%)`,
            filter: "blur(24px)",
          }}
        />
        {/* Orb sphere */}
        <div
          className="relative w-56 h-56 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${from} 0%, ${via} 50%, ${to} 100%)`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.6) inset, 0 20px 60px ${glow}`,
          }}
        >
          {/* Specular highlight */}
          <div className="absolute top-7 left-9 w-10 h-10 rounded-full bg-white/40 blur-md" />
          <div className="absolute top-9 left-11 w-4 h-4 rounded-full bg-white/60 blur-sm" />
          <div className="absolute top-10 left-12 w-2 h-2 rounded-full bg-white/80" />
        </div>
      </motion.div>

      {/* Label */}
      <div className="text-center relative z-10">
        <p className="text-xl font-semibold text-[var(--text-primary)]">
          {label}
          {score !== undefined && (
            <span className="font-mono ml-2">{score}</span>
          )}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xs">
          {sublabel}
        </p>
      </div>
    </div>
  );
}
