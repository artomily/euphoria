"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  label: string;
  value: number;
  color?: string;
  className?: string;
}

function getAutoColor(value: number): string {
  if (value >= 70) return "var(--signal-buy)";
  if (value >= 40) return "var(--signal-watch)";
  return "var(--signal-sell)";
}

export default function ScoreBar({ label, value, color, className }: ScoreBarProps) {
  const barColor = color ?? getAutoColor(value);
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        <span className="text-xs font-mono text-[var(--text-primary)]">{clamped}/100</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: barColor }}
        />
      </div>
    </div>
  );
}
