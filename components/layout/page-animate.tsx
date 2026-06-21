"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ─── Ease-out cubic-bezier used throughout ─────────────────────────────────
const EASE_OUT = [0, 0, 0.2, 1] as const;

// ─── FadeUp ────────────────────────────────────────────────────────────────

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Single element fade-up entrance. Respects prefers-reduced-motion. */
export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerList + StaggerItem ─────────────────────────────────────────────

interface StaggerListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/** Wraps a list so direct children stagger in. Each direct child needs a key. */
export function StaggerList({ children, className, staggerDelay = 0.09 }: StaggerListProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 14 },
        visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.35, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── CountUp ───────────────────────────────────────────────────────────────

interface CountUpProps {
  value: number;
  duration?: number; // seconds
  className?: string;
}

/**
 * Animated number count-up from 0 to `value`.
 * Uses requestAnimationFrame for smooth easing.
 * Instant when prefers-reduced-motion is enabled.
 */
export function CountUp({ value, duration = 1.4, className }: CountUpProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    // Reduced motion: render the final value directly (see return), no animation.
    if (reduced) return;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration, reduced]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {reduced ? value : display}
    </span>
  );
}

// ─── SpringIn ──────────────────────────────────────────────────────────────

interface SpringInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Scale-in with spring physics — used for Judge verdict badge reveal. */
export function SpringIn({ children, delay = 0, className }: SpringInProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: reduced ? 1 : 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.2, delay },
        scale: {
          type: reduced ? "tween" : "spring",
          stiffness: 280,
          damping: 22,
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
