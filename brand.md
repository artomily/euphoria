# Brand — Euphoria

_Status: configured_

## Design Direction

**Bloomberg Terminal × Perplexity × Polymarket** — dense, fast, professional. A tool traders trust, not a crypto-bro hype machine.

- Dark mode only — no light mode
- Glassmorphism cards with backdrop blur
- High information density
- Numbers always in Geist Mono, `tabular-nums`
- Alive: metrics animate, numbers count up, signals pulse

## Color Palette

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0a0a0a` | Page background |
| `--bg-surface` | `#111111` | Sidebar, elevated sections |
| `--bg-elevated` | `#141414` | Card backgrounds |
| `--text-primary` | `#ededed` | Body text, headings |
| `--text-secondary` | `#888888` | Labels, secondary copy |
| `--text-muted` | `#444444` | Timestamps, footnotes |
| `--accent-emerald` | `#10b981` | Primary CTA, BUY signals, active nav |
| `--accent-cyan` | `#06b6d4` | Data highlights, Scout scores |
| `--accent-purple` | `#a855f7` | Narrative badges, Judge agent |
| `--signal-buy` | `#10b981` | BUY decision |
| `--signal-sell` | `#ef4444` | SELL decision, Reverse agent |
| `--signal-watch` | `#f59e0b` | WATCH decision, Crowd agent |
| `--border-subtle` | `rgba(255,255,255,0.08)` | All card borders |

## FOMO Score Color Ramp

| Range | Color |
|---|---|
| 0–19 | `#10b981` emerald (Calm) |
| 20–39 | `#84cc16` lime (Interest) |
| 40–59 | `#eab308` yellow (Bullish) |
| 60–79 | `#f97316` orange (FOMO) |
| 80–100 | `#ef4444` red (Euphoria) |

## Typography

- **UI text**: Geist Sans — headings, labels, body, CTAs
- **Data/numbers**: Geist Mono — all prices, scores, percentages, addresses, tickers

Rules:
- All changing numbers use `font-mono tabular-nums` to prevent digit jitter
- Heading scale: 7xl hero → 3xl section → lg card → sm label
- No semibold below `text-sm`

## Voice & Tone

- Direct, confident, never hypey
- Active voice: "Analyze", not "Start your analysis"
- Specific numbers, not vague claims
- Acknowledge uncertainty: "confidence 87%" not "definitely BUY"
- Disclaimer always present near every decision signal

## Component Patterns

- **Glass cards**: `bg-white/5 border border-white/[0.08] rounded-xl backdrop-blur-sm`
- **Elevated cards**: `bg-white/[0.05] border border-white/[0.12] backdrop-blur-[16px]`
- **Focus rings**: `focus-visible:ring-2 focus-visible:ring-accent-emerald`
- **Active states**: `active:scale-[0.98] active:translate-y-px`
- **Transitions**: always specify properties, never `transition-all`, 100ms for micro-interactions
