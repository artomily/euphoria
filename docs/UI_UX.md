# Euphoria — Design System & UI/UX Specification

> **Premium fintech. Bloomberg Terminal meets Perplexity.**

This document defines the complete design system for Euphoria — covering brand identity, color, typography, spacing, components, layouts, motion, and accessibility.

**Visual Reference:** [Dribbble Design Inspiration](https://cdn.dribbble.com/userupload/47531199/file/56abfcdd7cf977539f4447279ff2ae26.png?resize=2048x1536&vertical=center)

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Library](#component-library)
6. [Dashboard Layouts](#dashboard-layouts)
7. [Mobile Layouts](#mobile-layouts)
8. [Interaction Patterns](#interaction-patterns)
9. [Motion Design](#motion-design)
10. [Accessibility Rules](#accessibility-rules)

---

## Brand Identity

### Personality
Euphoria is where **Bloomberg Terminal meets Perplexity meets Polymarket**. It should feel:

- **Professional** — institutional-grade, not a toy
- **Intelligent** — the UI surfaces insight, not just data
- **Alive** — metrics pulse, numbers animate, agents appear as they think
- **Precise** — every number is there for a reason, displayed with intention
- **Dark** — deep black backgrounds signal seriousness, like a professional trading terminal

### Design Keywords
`Premium` `Terminal` `Dark` `Dense` `Animated` `Precise` `Glassmorphism` `Emerald`

### Brand Voice
- Confident, not arrogant
- Analytical, not cold
- Accessible, not dumbed-down
- Urgent when it matters, calm otherwise

### What Euphoria Is Not
- ❌ Consumer social app (no emojis in UI chrome, no playfulness)
- ❌ Traditional fintech (no boring blue/white corporate look)
- ❌ Crypto casino (no red/green flashing everywhere)
- ❌ Dashboard overload (no 20+ widgets competing for attention)

---

## Color Palette

### Core Colors

All colors defined as CSS custom properties in `app/globals.css`:

```css
@theme {
  /* ─── Backgrounds ──────────────────────────────────── */
  --color-bg-base:       #0a0a0a;  /* Page background */
  --color-bg-surface:    #111111;  /* Card/panel background */
  --color-bg-elevated:   #141414;  /* Elevated card, dropdown */
  --color-bg-overlay:    #1a1a1a;  /* Modal background */

  /* ─── Borders ──────────────────────────────────────── */
  --color-border:        rgba(255, 255, 255, 0.08);
  --color-border-strong: rgba(255, 255, 255, 0.16);
  --color-border-focus:  rgba(16, 185, 129, 0.5);  /* Emerald focus ring */

  /* ─── Text ─────────────────────────────────────────── */
  --color-text-primary:  #ededed;  /* Body text */
  --color-text-secondary:#888888;  /* Subtext, labels */
  --color-text-muted:    #444444;  /* Disabled, placeholder */
  --color-text-inverse:  #0a0a0a;  /* Text on colored backgrounds */

  /* ─── Accents ──────────────────────────────────────── */
  --color-emerald:       #10b981;  /* Primary accent — actions, BUY */
  --color-emerald-dim:   #059669;  /* Darker emerald — hover states */
  --color-emerald-glow:  rgba(16, 185, 129, 0.15);  /* Glow bg */
  --color-cyan:          #06b6d4;  /* Data points, highlights */
  --color-cyan-dim:      #0891b2;
  --color-purple:        #a855f7;  /* Narrative indicators */
  --color-purple-dim:    #9333ea;

  /* ─── Trading Signals ──────────────────────────────── */
  --color-signal-buy:    #10b981;  /* BUY — emerald green */
  --color-signal-sell:   #ef4444;  /* SELL — red */
  --color-signal-watch:  #f59e0b;  /* WATCH — amber */

  /* ─── FOMO Gradient Stops ──────────────────────────── */
  --color-fomo-0:        #10b981;  /* Calm (0-20) */
  --color-fomo-20:       #84cc16;  /* Interest (20-40) */
  --color-fomo-40:       #eab308;  /* Bullish (40-60) */
  --color-fomo-60:       #f97316;  /* FOMO (60-80) */
  --color-fomo-80:       #ef4444;  /* Euphoria (80-100) */
}
```

### FOMO Color Scale

The FOMO gradient is used everywhere a FOMO score is displayed — bars, gauges, badges, borders.

```
  0 ──── 20 ──── 40 ──── 60 ──── 80 ──── 100
  │      │       │       │       │       │
Calm  Interest Bullish  FOMO  Euphoria   │
  │      │       │       │       │       │
#10b981 #84cc16 #eab308 #f97316 #ef4444  │
```

**Function to get FOMO color:**
```typescript
export function getFomoColor(score: number): string {
  if (score < 20) return '#10b981';
  if (score < 40) return '#84cc16';
  if (score < 60) return '#eab308';
  if (score < 80) return '#f97316';
  return '#ef4444';
}
```

### Color Semantic Mapping

| Context | Color | Usage |
|---|---|---|
| Primary action | `--color-emerald` | Buttons, links, active states |
| BUY signal | `--color-signal-buy` | Decision badges, score highlights |
| SELL signal | `--color-signal-sell` | Warning indicators |
| WATCH signal | `--color-signal-watch` | Neutral/cautious states |
| Data values | `--color-cyan` | Numbers, metrics, data points |
| Narratives | `--color-purple` | Narrative badges, category labels |
| Danger/Bubble | `--color-signal-sell` | Reverse Agent, red flags |

---

## Typography

### Font Stack

```css
/* Geist Sans — all UI text */
font-family: var(--font-geist-sans), 'Inter', system-ui, sans-serif;

/* Geist Mono — all data, numbers, tickers */
font-family: var(--font-geist-mono), 'JetBrains Mono', monospace;
```

**Rule:** Every number, score, percentage, price, and ticker symbol uses `font-mono`. Everything else uses `font-sans`.

### Type Scale

| Token | Size | Line Height | Weight | Use Case |
|---|---|---|---|---|
| `text-xs` | 12px | 1.5 | 400 | Labels, metadata, timestamps |
| `text-sm` | 14px | 1.5 | 400 | Secondary text, card descriptions |
| `text-base` | 16px | 1.6 | 400 | Body text, reasoning, explanations |
| `text-lg` | 18px | 1.5 | 500 | Section headings, card titles |
| `text-xl` | 20px | 1.4 | 600 | Page headings |
| `text-2xl` | 24px | 1.3 | 700 | Dashboard hero numbers (FOMO Index) |
| `text-3xl` | 30px | 1.2 | 700 | Judge decision badge |
| `text-4xl` | 36px | 1.1 | 800 | Landing hero headline |

### Number Display Conventions

```
Price:              $2.84          →  Geist Mono, text-base or text-lg
Percentage:         +12.7%         →  Geist Mono, colored (green/red)
FOMO Score:         74/100         →  Geist Mono, text-2xl, FOMO gradient color
Volume:             $48.2M         →  Geist Mono, text-base
Market Cap:         $542M          →  Geist Mono, text-sm, text-secondary
Confidence:         79%            →  Geist Mono, text-lg, text-emerald
Agent Score:        82 / 100       →  Geist Mono, score + "/100" in text-muted
```

---

## Spacing System

### Base Grid: 4px

All spacing is multiples of 4px. Tailwind's default 4px grid is used.

```
4px   = gap-1, p-1   (tight, internal card spacing)
8px   = gap-2, p-2   (compact, icon + label)
12px  = gap-3, p-3   (small, tag groups)
16px  = gap-4, p-4   (standard, card padding)
24px  = gap-6, p-6   (comfortable, section padding)
32px  = gap-8, p-8   (wide, page-level padding)
48px  = gap-12, p-12 (large, hero section spacing)
```

### Layout Spacing

| Element | Spacing |
|---|---|
| Card internal padding | `p-4` (16px) or `p-5` (20px) |
| Card gap in grid | `gap-4` (16px) |
| Section spacing | `mb-8` (32px) |
| Page padding | `px-6` (24px) desktop, `px-4` (16px) mobile |
| Sidebar width | 240px (fixed) |
| Sidebar collapsed | 0px (hidden on mobile) |
| Header height | 60px |
| Content area max-width | 1400px (centered) |

---

## Component Library

### Card

The base container for all content. Multiple density variants.

```tsx
// Default card — glass effect
<div className="bg-white/5 border border-white/[0.08] rounded-xl backdrop-blur-sm p-5">
  {children}
</div>

// Elevated card — slightly brighter for nested content
<div className="bg-white/[0.07] border border-white/[0.1] rounded-xl p-4">
  {children}
</div>

// Accent card — emerald border for highlighted content
<div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
  {children}
</div>
```

**Visual spec:**
- Background: `rgba(255,255,255,0.05)` = `bg-white/5`
- Border: `rgba(255,255,255,0.08)` = `border-white/[0.08]`
- Border radius: `rounded-xl` (12px)
- Backdrop blur: `backdrop-blur-sm`
- Hover: border slightly brightens `border-white/[0.12]`

---

### Button

```tsx
// Primary button — emerald fill
<button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold
  px-4 py-2 rounded-lg transition-colors duration-150">
  Connect Wallet
</button>

// Secondary button — ghost with border
<button className="border border-white/[0.12] hover:bg-white/[0.05] text-white
  px-4 py-2 rounded-lg transition-colors duration-150">
  View History
</button>

// Destructive button (rare)
<button className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
  text-red-400 px-4 py-2 rounded-lg">
  Disconnect
</button>
```

---

### Decision Badge

The most prominent component in the UI — the Judge's BUY/SELL/WATCH verdict.

> **Compliance microcopy is part of this component.** Immediately beneath the badge, render muted text: *"Market-psychology signal — not financial advice."* This is a hard requirement (see PRD F6.6), not optional chrome. A global footer carries the full disclaimer.

```tsx
// BUY badge
<span className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30
  text-emerald-400 font-bold text-3xl px-6 py-3 rounded-2xl">
  <ArrowUpIcon className="w-8 h-8" />
  BUY
</span>

// SELL badge
<span className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30
  text-red-400 font-bold text-3xl px-6 py-3 rounded-2xl">
  <ArrowDownIcon className="w-8 h-8" />
  SELL
</span>

// WATCH badge
<span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30
  text-amber-400 font-bold text-3xl px-6 py-3 rounded-2xl">
  <EyeIcon className="w-8 h-8" />
  WATCH
</span>
```

---

### Score Bar

Used for Volume Score, Momentum Score, and Confidence.

```tsx
<div className="space-y-1">
  <div className="flex justify-between text-xs text-secondary font-mono">
    <span>Volume Score</span>
    <span className="text-white">{score}/100</span>
  </div>
  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{ backgroundColor: getFomoColor(score) }}
      initial={{ width: 0 }}
      animate={{ width: `${score}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
</div>
```

---

### FOMO Meter (Gauge)

The central visualization of the platform. An arc/semicircle gauge from 0 to 100.

**Spec:**
- SVG arc gauge, not a CSS bar (allows arc shape)
- Width: 280px standard, 200px on mobile
- 5 color zones painted directly on the arc track
- Animated needle/fill sweeps to final value over 1.5s
- Zone labels: Calm / Interest / Bullish / FOMO / Euphoria
- Current score displayed large in Geist Mono at center of arc
- Current level name below the score

---

### Narrative Badge

```tsx
const narrativeColors = {
  AI: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Memecoin: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  DeFi: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  RWA: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  DePIN: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Gaming: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  Layer1: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Layer2: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
};

<span className={cn(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
  narrativeColors[narrative]
)}>
  {narrative}
</span>
```

---

### Agent Status Indicator

Used in the execution timeline while agents are running.

```tsx
// Pending
<div className="w-2 h-2 rounded-full bg-white/20" />

// Running
<div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />

// Complete
<div className="w-2 h-2 rounded-full bg-emerald-400" />

// Failed
<div className="w-2 h-2 rounded-full bg-red-400" />
```

---

### Skeleton Loader

```tsx
// Card skeleton
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-white/10 rounded w-1/3" />
  <div className="h-8 bg-white/10 rounded" />
  <div className="h-3 bg-white/10 rounded w-2/3" />
</div>
```

---

### Token Pill (in Narrative Cards)

```tsx
<span className="bg-white/5 border border-white/[0.08] text-secondary
  text-xs px-2 py-0.5 rounded font-mono hover:border-white/[0.16] transition-colors cursor-pointer">
  CAKE
</span>
```

---

## Dashboard Layouts

### Desktop Layout (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar (240px fixed)    │  Header (full width minus 240px) │
│                          │                                   │
│  🌟 Euphoria             │  FOMO Radar    [0x1234...5678 ▼] │
│  ─────────────           │                                   │
│  📊 Dashboard            ├───────────────────────────────────┤
│  📡 FOMO Radar    ← active│                                   │
│  🔍 Analyze Token        │  GLOBAL FOMO INDEX                │
│                          │  ┌──────────────────────────────┐ │
│  ─────────────           │  │   [FOMO METER GAUGE]         │ │
│  Wallet                  │  │   74 / Fomo                  │ │
│  0x1234...5678           │  └──────────────────────────────┘ │
│  [Disconnect]            │                                   │
│                          │  NARRATIVE RADAR                  │
│                          │  ┌──────┐ ┌──────┐ ┌──────┐     │
│                          │  │  AI  │ │DeFi  │ │Meme  │     │
│                          │  │  81  │ │  74  │ │  62  │     │
│                          │  └──────┘ └──────┘ └──────┘     │
│                          │  ┌──────┐ ┌──────┐ ┌──────┐     │
│                          │  │DePIN │ │Gaming│ │ RWA  │     │
│                          │  │  55  │ │  48  │ │  31  │     │
│                          │  └──────┘ └──────┘ └──────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Token Analysis Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │  CAKE / PancakeSwap    [Analyze Another Token]      │
│         ├────────────────────────────────────────────────────┤
│         │  $2.84 +12.7% ▲  │  Market Cap: $542M             │
│         │                                                     │
│         │  ┌─ AGENT PIPELINE PROGRESS ─────────────────────┐ │
│         │  │  Scout ✓ → [Narrative ✓ | Crowd ✓ | Rev ✓] → Judge ✓│
│         │  └──────────────────────────────────────────────-─┘ │
│         │                                                     │
│         │  ┌─ SCOUT ──────┐ ┌─ NARRATIVE ─┐ ┌─ FOMO ──────┐│
│         │  │ Vol: 82/100  │ │ DeFi  88%   │ │    74       ││
│         │  │ Mom: 71/100  │ │ Hot 🔥      │ │   FOMO      ││
│         │  └─────────────┘ └─────────────┘ └─────────────┘│
│         │                                                     │
│         │  ──── AI DEBATE ────────────────────────────────── │
│         │  ┌─ CROWD (Bull) ───────┐  VS ┌─ REVERSE (Bear) ─┐│
│         │  │ 74/100 FOMO          │     │ 31% Bubble Risk  ││
│         │  │ Volume spike signal  │     │ 7d decline caution│
│         │  └──────────────────────┘     └──────────────────┘│
│         │                                                     │
│         │  ┌─ JUDGE DECISION ──────────────────────────────┐ │
│         │  │           [ ↑ BUY ]  79% confidence           │ │
│         │  │  Volume-to-price ratio suggests institutions...│ │
│         │  │  Key insight: "Someone large is accumulating..." │
│         │  └───────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Content Grid Patterns

**Dashboard Grid:**
```css
/* 3-column narrative grid */
.narrative-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 2-column agent grid (Scout + Narrative side by side, etc.) */
.agent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* At md: 2 col; at lg: 3 col */
@responsive:
  md:grid-cols-2 lg:grid-cols-3
```

---

## Mobile Layouts

### Mobile Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| `sm` | ≥ 640px | 2-col grids allowed |
| `md` | ≥ 768px | Sidebar still hidden, better spacing |
| `lg` | ≥ 1024px | Sidebar visible, desktop layout |
| `xl` | ≥ 1280px | Max content width enforced |

### Mobile Navigation

```
┌──────────────────────────┐
│ ☰  Euphoria   [0x...] ▼ │  ← Header (60px)
├──────────────────────────┤
│                          │
│  [FOMO METER]            │
│  74 / FOMO               │
│                          │
│  Top Narratives          │
│  ┌─────────────────────┐ │
│  │ AI    81  ████████░ │ │
│  │ DeFi  74  ███████░░ │ │
│  │ Meme  62  ██████░░░ │ │
│  └─────────────────────┘ │
│                          │
│  [Search Token Symbol]   │
│                          │
└──────────────────────────┘

Sidebar slide-in (overlay):
┌──────────────────────────┐
│  ← Close  │              │
│           │  Main        │
│ 🌟 Logo   │  Content     │
│           │              │
│ Dashboard │              │
│ FOMO Radar│              │
│ Analyze   │              │
│           │              │
│ 0x1234... │              │
│ Disconnect│              │
└──────────────────────────┘
```

### Mobile Token Analysis

```
┌──────────────────────────┐
│ ← Back  CAKE    +12.7%  │
├──────────────────────────┤
│ $2.84    Vol: $48.2M     │
├──────────────────────────┤
│ Scout ✓ → Analysis → ✓  │
├──────────────────────────┤
│ ┌────────────────────┐  │
│ │ FOMO METER         │  │
│ │      74/100        │  │
│ │     [ FOMO ]       │  │
│ └────────────────────┘  │
├──────────────────────────┤
│ Volume Score   82/100   │
│ Momentum       71/100   │
│ Narrative      DeFi 88% │
├──────────────────────────┤
│ DEBATE                   │
│ ┌────────────────────┐  │
│ │ Bull 🟢  74/100    │  │
│ │ Strong vol signal  │  │
│ └────────────────────┘  │
│ ┌────────────────────┐  │
│ │ Bear 🔴  31/100    │  │
│ │ 7d decline caution │  │
│ └────────────────────┘  │
├──────────────────────────┤
│ ┌────────────────────┐  │
│ │   ↑  BUY  79%      │  │
│ │ Volume-to-price... │  │
│ └────────────────────┘  │
└──────────────────────────┘
```

---

## Interaction Patterns

### Hover States

```css
/* Card hover — subtle border brightening */
.card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

/* Button primary hover — slightly lighter */
.btn-primary:hover {
  background: #34d399; /* emerald-400 */
}

/* Narrative card hover — adds glow */
.narrative-card:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.08);
}

/* Token pill hover */
.token-pill:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}
```

### Focus States

```css
/* All interactive elements */
.focusable:focus-visible {
  outline: 2px solid rgba(16, 185, 129, 0.6);
  outline-offset: 2px;
}
```

Tailwind: `focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none`

### Active/Selected States

```css
/* Active sidebar link */
.nav-link.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-right: 2px solid #10b981; /* accent indicator */
}
```

### Loading States

Three types of loading in Euphoria:

1. **Page skeleton** — Full card placeholders with shimmer animation
2. **Agent loading** — Pulsing dot + "Analyzing..." text in agent cards
3. **Button loading** — Spinner replaces button text during submission

```tsx
// Shimmer skeleton
<div className="animate-pulse bg-white/5 rounded-xl h-[120px]" />

// Agent loading state
<div className="flex items-center gap-2 text-secondary text-sm">
  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
  <span>Crowd Agent analyzing...</span>
</div>
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
    <SearchIcon className="w-5 h-5 text-muted" />
  </div>
  <p className="text-secondary text-sm">No analyses yet</p>
  <p className="text-muted text-xs mt-1">Enter a token symbol above to get started</p>
</div>
```

**FOMO Radar cold-start:** on a fresh deploy, `narratives.heat_score` is all zeros until the Cron job (or `npm run warm`) runs — the radar would look dead. The radar must therefore (a) seed visible baseline heat at deploy time, and (b) show a subtle "warming up — first scan in progress" state rather than empty cards if no precomputed data exists yet. Never present a blank radar to a hackathon judge.

---

## Motion Design

### Principles

1. **Purposeful** — every animation communicates something (data loading, state change, result arrival)
2. **Fast** — no animation over 0.6s for interactive feedback
3. **Alive** — metrics feel live, not static
4. **Staggered** — related items appear sequentially, not all at once
5. **Physical** — spring physics for "impact" moments (judge decision)

### Animation Tokens

```typescript
// Transition presets
export const transitions = {
  fast:   { duration: 0.15, ease: "easeInOut" },
  normal: { duration: 0.25, ease: "easeOut" },
  slow:   { duration: 0.5,  ease: "easeOut" },
  spring: { type: "spring", stiffness: 400, damping: 25 },
  bounce: { type: "spring", stiffness: 300, damping: 15 },
};

// Common variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: transitions.normal,
};

export const slideUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: transitions.normal,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: transitions.spring,
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};
```

### Choreographed Animations

> **The reveal sells the product — but never blocks on the network.** Baseline behavior: `/api/analyze` returns the full result in one response, and the timeline below is a purely client-side choreography played once the data lands (no per-agent network dependency, so it can't half-fail live). First meaningful paint should be fast — render the Scout/token header and skeletons immediately, then play the reveal. **Streaming** each agent as it actually completes (SSE / `ReadableStream`) is a P1 enhancement layered on top, not a prerequisite. Choose the safe version for the demo.

**Agent Pipeline Reveal:**
```
t=0ms    Scout card fades in (slideUp, 250ms)
t=200ms  Narrative card slides in (slideUp, 250ms)
t=300ms  Crowd card slides in (slideUp, 250ms)
t=400ms  Reverse card slides in (slideUp, 250ms)
t=600ms  "AI Debate" label fades in
t=800ms  Crowd agent (bull) slides from left
t=900ms  Reverse agent (bear) slides from right
t=1100ms "VS" badge scales in
t=1500ms Judge card appears (scaleIn with spring)
t=1700ms BUY/SELL/WATCH badge scales 0→1.05→1.0
t=1900ms Confidence bar animates left→right
t=2100ms Reasoning text fades in line by line
```

**FOMO Score Counter:**
```typescript
// Count from 0 to final score over 1.5s
const count = useMotionValue(0);
const displayScore = useTransform(count, Math.round);

useEffect(() => {
  animate(count, finalScore, { duration: 1.5, ease: "easeOut" });
}, [finalScore]);
```

**FOMO Meter Gauge:**
```
t=0     Needle at 0 position
t=0→1500ms  Needle sweeps to final score (ease-out)
t=1000ms Track color fills progressively
t=1500ms Zone label fades in
```

**Dashboard Pulse (30s interval):**
```
Every 30 seconds:
- Global FOMO Index number briefly scales to 1.02 and back
- "Live" indicator dot pulses (opacity 1 → 0.4 → 1)
- Most active narrative card border briefly glows emerald
```

**Narrative Card Hover:**
```
onHover:
- Card y: 0 → -2px (subtle lift)
- Border opacity: 0.08 → 0.16
- Shadow: none → 0 0 20px rgba(16,185,129,0.08)
Duration: 200ms ease-out
```

---

## Accessibility Rules

### WCAG 2.1 Level AA Requirements

All UI must meet or exceed WCAG 2.1 Level AA. The dark theme makes contrast particularly critical.

### Color Contrast

| Element | Foreground | Background | Ratio | Requirement |
|---|---|---|---|---|
| Body text | `#ededed` | `#0a0a0a` | 17.3:1 | ≥ 4.5:1 ✅ |
| Secondary text | `#888888` | `#0a0a0a` | 5.1:1 | ≥ 4.5:1 ✅ |
| Muted text | `#444444` | `#0a0a0a` | 2.4:1 | ≥ 3:1 for large text ⚠️ |
| Emerald on black | `#10b981` | `#0a0a0a` | 7.1:1 | ≥ 4.5:1 ✅ |
| BUY badge text | `#10b981` | `#0a0a0a` | 7.1:1 | ≥ 4.5:1 ✅ |
| SELL badge text | `#ef4444` | `#0a0a0a` | 5.0:1 | ≥ 4.5:1 ✅ |
| WATCH badge text | `#f59e0b` | `#0a0a0a` | 8.1:1 | ≥ 4.5:1 ✅ |

**Note:** Use `#444444` (muted) only for decorative or non-informational text. Never for interactive labels.

### Keyboard Navigation

All interactive elements must be reachable and operable via keyboard:

```
Tab: Cycle through all interactive elements
Enter/Space: Activate buttons and links
Escape: Close modals, dropdowns, sidebars
Arrow keys: Navigate within grouped controls (narrative grid)
```

Tailwind pattern for all clickable elements:
```
focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none
```

Never use `outline: none` without a visible replacement.

### ARIA Roles & Labels

| Component | ARIA |
|---|---|
| FOMO Meter gauge | `role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label="FOMO Score"` |
| Decision badge | `role="status" aria-live="polite" aria-label="{Decision}: {Confidence}% confidence"` |
| Agent loading | `role="status" aria-label="{Agent} analyzing"` |
| Navigation | `<nav aria-label="Main navigation">` |
| Sidebar | `<aside aria-label="App navigation">` |
| Score bars | `aria-label="{Name}: {score} out of 100"` |
| Wallet button | `aria-label="Wallet: {address}. Click to disconnect."` |

### Screen Reader Announcements

Use `aria-live` regions for dynamic content:

```tsx
// Analysis result — announce when complete
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {result && `Analysis complete: ${result.decision}, ${result.confidence}% confidence`}
</div>
```

### Reduced Motion

Respect `prefers-reduced-motion` for all animations:

```typescript
// In Framer Motion config
const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fadeIn = {
  initial: { opacity: shouldReduceMotion ? 1 : 0 },
  animate: { opacity: 1 },
  transition: { duration: shouldReduceMotion ? 0 : 0.25 },
};
```

### Semantic HTML Checklist

Every page must use:
```html
<main>        <!-- One per page, wraps primary content -->
<nav>         <!-- Navigation sidebar -->
<header>      <!-- Page header -->
<aside>       <!-- Sidebar (supplementary content) -->
<section>     <!-- Logical content sections with headings -->
<article>     <!-- Self-contained analysis cards -->
<h1>          <!-- One per page — page title -->
<h2-h6>       <!-- Hierarchical headings, never skip levels -->
<button>      <!-- All click actions (not <div onClick>) -->
<a>           <!-- All navigational links (not <div onClick>) -->
```

### Icon Accessibility

All icons must have accessible labels:

```tsx
// Decorative icon — hidden from screen readers
<ArrowUpIcon className="w-5 h-5" aria-hidden="true" />

// Functional icon (no label text) — needs aria-label
<button aria-label="Share analysis">
  <ShareIcon className="w-5 h-5" aria-hidden="true" />
</button>
```

### Touch Target Sizes

All interactive elements on mobile: minimum 44×44px touch target.

```css
/* Ensure touch targets are large enough on mobile */
@media (pointer: coarse) {
  .btn, .nav-link, .token-pill {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## Design Anti-Patterns (What NOT to Do)

- ❌ Never use light mode, even optionally
- ❌ Never show raw JSON or stack traces in the UI
- ❌ Never use more than 3 colors in a single card
- ❌ Never use spinning loaders — use skeleton shimmer
- ❌ Never use inline styles — Tailwind classes only
- ❌ Never animate two things simultaneously in the same card
- ❌ Never use emoji in UI chrome (buttons, labels, headings)
- ❌ Never show empty states without actionable guidance
- ❌ Never use text like "Error occurred" — always explain and offer a solution
- ❌ Never clip the FOMO Meter at the component boundary — give it breathing room
