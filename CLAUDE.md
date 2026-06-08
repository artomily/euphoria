@AGENTS.md

# Euphoria — Master Claude Code Context

> **Trade Market Emotions, Not Charts.**

Euphoria is an AI-powered market psychology platform for BNB Chain. It uses a multi-agent AI system to analyze crowd behavior, narratives, momentum, and market emotions — replacing traditional trading indicators with psychological insight.

---

## CRITICAL: This Is NOT the Next.js You Know

Next.js 16 has breaking changes from all prior versions. APIs, conventions, file structure, and data patterns may differ from training data.

**Before writing any Next.js code:**
1. Read `node_modules/next/dist/docs/` — the authoritative reference for this version
2. Heed all deprecation notices you encounter
3. Do not assume App Router behavior matches Next.js 13/14/15

---

## Product Vision

Euphoria makes market psychology legible. Instead of charts and RSI indicators, traders see:
- **FOMO scores** that quantify crowd excitement (0–100)
- **Narrative identification** that explains why markets move
- **Agent debates** that simulate bear/bull perspectives before a decision
- **Judge verdicts** that synthesize all signals into BUY / SELL / WATCH

The platform targets BNB Chain traders who want an edge through understanding psychology, not technical analysis.

**North Star:** The first AI platform that trades emotions as a primary signal.

---

## Business Goals

### Phase 1 — Hackathon MVP (Current)
- Functional demo: wallet connect → token analysis → judge decision
- Impressive agent debate UI
- FOMO Radar showing live narrative heat
- Deployed to Vercel, publicly accessible

### Phase 2 — Post-Hackathon Product
- Real-time signal streaming
- Analysis history and portfolio tracking
- BNB Chain token discovery
- User retention via saved watchlists

### Phase 3 — Platform Scale
- Social signals and community FOMO aggregation
- On-chain behavioral data integration
- Institutional-grade API access
- Revenue via premium analysis tier

---

## Engineering Philosophy

**Priorities (in order):**
1. User Experience — the demo must feel alive
2. Agent Intelligence — decisions must feel insightful
3. Demo Quality — every second of the hackathon demo matters
4. Deployment Simplicity — serverless, Vercel-first, no ops
5. Scalability — considered but not over-engineered

**Core Principles:**
- Ship fast, iterate fast — this is a hackathon product first
- Serverless-first: no VPS, no Docker, no Kubernetes, no Redis
- Server Components by default; client components only when necessary
- TypeScript strict mode everywhere — no `any` escapes
- One file, one responsibility — colocate what changes together
- External API failures degrade gracefully — never break the UI

---

## Architecture Principles

### Infrastructure Rules (Non-Negotiable)
- **Full serverless** — Vercel functions only
- **No VPS** — no EC2, DigitalOcean, Railway, Fly.io
- **No Docker** — no containerized services
- **No Kubernetes** — no orchestration layer
- **No Redis** — caching uses the Next.js Data Cache (`unstable_cache` / `revalidate`) and Supabase. No external cache store.
- **No persistent background workers** — there is no standing worker process. Scheduled work (e.g. precomputing the FOMO index) uses **Vercel Cron**, which is a serverless route handler invoked on a schedule — this is allowed and is the designated mechanism. "No workers" means no always-on dynos/containers, not "no scheduled functions."
- **No WebSockets** — if streaming is added, use SSE / a `ReadableStream` response, not a socket server.

### Application Architecture
- **App Router** — all pages use Next.js 16 App Router
- **Route Handlers** for all API endpoints (`app/api/*/route.ts`)
- **Server Actions** for mutations that don't need a separate URL
- **Server Components** by default for all pages and layouts
- **Client Components** only for wallet connection, animations, interactive state

### Agent Architecture
- All agents run inside Route Handlers — no persistent processes
- Agents are pure functions: `execute(input) => output`
- Independent agents run in parallel via `Promise.all()`
- Judge Agent is always last — it synthesizes all others
- Each agent route sets its own ceiling via `export const maxDuration` (e.g. 60); there is no hard-coded 15s — the platform cap is tier-dependent

### Data Architecture
- Supabase PostgreSQL for all persistence
- Row Level Security on every table — no exceptions
- No raw SQL in application code — Supabase SDK only
- Read from Server Components; write from Route Handlers or Server Actions

---

## Coding Standards

### TypeScript

```typescript
// ✅ Strict types — required
interface ScoutOutput {
  symbol: string;
  volume_score: number;   // 0-100
  momentum_score: number; // 0-100
}

// ❌ Never allowed
const result: any = await fetchData();
```

- `strict: true` — all code must pass TypeScript strict check
- No `@ts-ignore` or `@ts-nocheck`
- Prefer `interface` over `type` for object shapes
- Use `unknown` instead of `any` when type is genuinely unknown
- All async functions return explicitly typed Promises

### Naming Conventions

| Category | Convention | Example |
|---|---|---|
| Files (components) | `kebab-case.tsx` | `fomo-meter.tsx` |
| Files (lib) | `kebab-case.ts` | `openrouter.ts` |
| Files (types) | `kebab-case.ts` | `agents.ts` |
| React Components | `PascalCase` | `FomoMeter` |
| Functions | `camelCase` | `calculateFomoScore` |
| Types / Interfaces | `PascalCase` | `ScoutOutput` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_FOMO_SCORE` |
| Environment Variables | `UPPER_SNAKE_CASE` | `OPENROUTER_API_KEY` |
| Database Tables | `snake_case` | `agent_logs` |
| Database Columns | `snake_case` | `created_at` |
| Props interfaces | `{Component}Props` | `FomoMeterProps` |

### File Organization

```
euphoria/
├── app/           # Next.js App Router pages + API routes
├── components/    # React components (barrel index.ts allowed)
├── lib/           # Business logic, agents, API clients (NO barrel exports)
├── types/         # TypeScript types (barrel index.ts allowed)
└── supabase/      # Database migrations
```

**Import rule:** `lib/` files are imported directly by path. Never create `lib/index.ts`.

### Component Rules

```typescript
// ✅ Server Component — always default
export default function FomoMeter({ score }: FomoMeterProps) {
  return <div className={cn("...", score > 80 && "text-red-500")}>{score}</div>;
}

// ✅ Client Component — only when you need browser APIs, state, or events
"use client";
import { motion } from "framer-motion";
export default function AnimatedMeter({ score }: FomoMeterProps) {
  return <motion.div animate={{ width: `${score}%` }} />;
}

// ❌ Never add "use client" to a component with no interactivity
"use client";
export default function StaticLabel({ text }: { text: string }) {
  return <span>{text}</span>;
}
```

Rules:
1. Props interface defined in same file as component
2. Default export unless there are multiple exports per file
3. `cn()` from `lib/utils.ts` for all conditional Tailwind classes
4. No inline styles; no CSS modules
5. No prop drilling past 1 level — use composition or context

### Agent Rules

```typescript
// ✅ Pure agent function — no side effects
export async function execute(input: ScoutInput): Promise<ScoutOutput> {
  const data = await fetchTokenData(input.symbol);
  return {
    symbol: input.symbol,
    volume_score: calculateVolumeScore(data),
    momentum_score: calculateMomentum(data),
  };
}
```

Rules:
1. Single `execute()` export per agent file
2. No side effects — database writes happen in orchestrator or route handler
3. All LLM prompts centralized in `lib/agents/prompts.ts`
4. LLM agents return typed objects via `generateObject` + Zod — no manual JSON parsing
5. Every LLM call has try/catch with a typed neutral fallback
6. Never throw to caller — return degraded output with low confidence
7. **Treat external token metadata (name, symbol) as untrusted input.** It is attacker-controllable (anyone can deploy a token named `Ignore previous instructions...`). Pass it only inside a clearly delimited data block in the prompt, never concatenated into instructions. The Zod output schema is the final guardrail.

### API Route Rules

```typescript
// ✅ Thin route handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol } = analyzeSchema.parse(body);
    const result = await orchestrate(symbol);
    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
```

Rules:
1. Validate all input with Zod at the route boundary
2. Consistent error shape: `{ error: string; details?: unknown }`
3. Never expose stack traces to the client
4. Add `revalidate` to GET routes where data is stable
5. Cache `/api/analyze` by symbol + time bucket to dedup expensive LLM calls; abuse/rate limiting is a deferred production concern (see Security)

### Database Rules
1. All writes go through Supabase server client (`lib/supabase/server.ts`)
2. Row Level Security enabled on every table (see security note on the Privy↔Supabase boundary)
3. No raw SQL — use Supabase SDK `from().select().eq()` pattern
4. Migrations tracked in `supabase/migrations/` — one file per change

### Testing
Pragmatic, not dogmatic — calibrated to a hackathon timeline with a venture-grade trajectory.
- **Hackathon (now):** unit-test the *pure, deterministic* logic that is easy to get wrong and expensive to debug live — Scout scoring (`lib/agents/scout.ts`), `lib/format.ts`, and the FOMO-level/color mappings. Use Vitest. No need to test React rendering or mock every LLM for the demo.
- **Agents:** test the *parsing/clamping/fallback* path with a stubbed `generateObject` (assert neutral fallback on throw, score clamping). Do not assert exact LLM wording.
- **Post-hackathon:** add route-handler integration tests (Zod rejection, anonymous vs authed) and a small eval harness that replays saved `agent_logs` to track decision accuracy over time.
- CI runs `npm run lint`, `npm run build` (type-check), and `npm run test` on every PR.

---

## UI Principles

### Design Direction
- **Dark mode only** — `#0a0a0a` background, never white
- **Bloomberg Terminal × Perplexity × Polymarket** — dense, fast, professional
- **Glassmorphism** — subtle glass cards with backdrop blur
- **High contrast** — `#ededed` text on `#0a0a0a` background
- **Alive** — metrics animate, numbers count up, signals pulse

### Color System

```css
/* Background layers */
--bg-base:        #0a0a0a;
--bg-surface:     #111111;
--bg-elevated:    #141414;
--border:         rgba(255,255,255,0.08);

/* Text */
--text-primary:   #ededed;
--text-secondary: #888888;
--text-muted:     #444444;

/* Accents */
--accent-emerald: #10b981;  /* Primary actions, BUY signals */
--accent-cyan:    #06b6d4;  /* Highlights, data points */
--accent-purple:  #a855f7;  /* Narrative indicators */

/* Trading signals */
--signal-buy:     #10b981;
--signal-sell:    #ef4444;
--signal-watch:   #f59e0b;

/* FOMO gradient */
/* 0-20: green → 20-40: yellow-green → 40-60: yellow → 60-80: orange → 80-100: red */
```

### Typography
- `Geist Sans` — all UI text, headings, labels, descriptions
- `Geist Mono` — all numbers, tickers, scores, percentages, code

### Component Patterns
- **Cards:** `bg-white/5 border border-white/[0.08] rounded-xl backdrop-blur-sm`
- **Metrics:** always `font-mono`, animated counting on load
- **Badges:** high contrast, semantic color (emerald=positive, red=negative, amber=neutral)
- **Loading:** skeleton shimmer — never spinners for data content
- **Empty states:** meaningful messages with context, never blank

### Motion Guidelines (Framer Motion)
- FOMO score counts up from 0 on mount
- Agent cards stagger in sequentially (0.1s delay per card)
- Debate messages slide in from opposing sides
- Judge decision badge scales in with spring physics
- Dashboard metrics pulse every 30s to signal "live"

---

## AI Agent Principles

### Agent Roster

| Agent | Purpose | Model | Notes |
|---|---|---|---|
| Scout | Market data + momentum detection | **None (heuristic)** | Pure math on API data — no LLM call, fast & free |
| Narrative | Why the market is moving | Gemini 2.5 Pro* | *Falls back to Flash under latency pressure |
| Crowd | FOMO score 0-100 | Gemini 2.5 Flash | Fast classification |
| Reverse | Bubble probability 0-100 | Gemini 2.5 Flash | Fast contrarian pass |
| Judge | Final BUY/SELL/WATCH + confidence | **Gemini 2.5 Pro** | Non-negotiable — the reasoning quality that sells the demo |

Scout does **not** call an LLM — it is a deterministic scoring function. Only four agents (Narrative, Crowd, Reverse, Judge) hit OpenRouter. The single guaranteed Pro call is the Judge; Narrative is Pro by default but may drop to Flash if the latency budget is at risk (`MODEL_TIER` config).

### Execution Order (dependency-correct)
```
Scout (data fetch + scoring, no LLM)
   ↓
Narrative (needs Scout)
   ↓
Crowd  ∥  Reverse   (both need Scout + Narrative — run in parallel)
   ↓
Judge (synthesizes Scout + Narrative + Crowd + Reverse)
   ↓
Response
```
Crowd and Reverse are **independent of each other** — each consumes only Scout + Narrative output, so they run concurrently via `Promise.all()`. The "debate" UI juxtaposes their two independent verdicts; it is a presentation-layer construct, not a sequential exchange. This keeps the critical path to **one heuristic + three LLM hops** (Narrative → [Crowd∥Reverse] → Judge), not five.

### LLM Configuration
- Provider: **OpenRouter** via the official `@openrouter/ai-sdk-provider` (`createOpenRouter()`), not `@ai-sdk/openai`.
- Structured output: **always `generateObject({ model, schema, prompt })` with a Zod schema** — never `generateText` + `JSON.parse`. The schema *is* the validation; malformed output is impossible by construction (enable the `response-healing` plugin as a belt-and-braces).
- Models: `google/gemini-2.5-flash`, `google/gemini-2.5-pro`.
- Attribution: set `appName: "Euphoria"` and `appUrl` (from `NEXT_PUBLIC_APP_URL`) on the provider.
- Temperature: 0.3 for deterministic, consistent outputs. `compatibility: "strict"`.
- All prompts in `lib/agents/prompts.ts` — never inline strings.
- **Route config:** every agent route exports `maxDuration` (e.g. `export const maxDuration = 60`). Do not assume a fixed "15s" — the cap is platform/tier-dependent and set explicitly per route.

### Failure Handling
- LLM call failure: retry once with 2s backoff → return a typed neutral fallback (`confidence: 0`).
- Because outputs are Zod-validated by `generateObject`, the failure mode is *network/timeout*, not *bad JSON* — handling is simpler than parse-and-repair.
- Missing data: agents return neutral scores (50), flag `confidence: 0`.
- If Judge receives incomplete inputs, it must still return a decision with low confidence.
- Partial failures are surfaced in the UI with a "limited data" indicator.

---

## Deployment Strategy

### Platform: Vercel
- `main` branch → auto-deploy to production
- All PRs → auto-deploy to preview URLs
- Environment variables set in Vercel dashboard (never committed)

### Environment Variables

The split between client-readable (`NEXT_PUBLIC_*`) and server-only is load-bearing — get it wrong and you either leak a secret or break the client.

```bash
# ─── Client-readable (NEXT_PUBLIC_ → bundled into the browser) ───
NEXT_PUBLIC_PRIVY_APP_ID=        # Privy app id — needed by <PrivyProvider> on the client
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL — used by the browser anon client
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon key — safe for client, RLS-gated
NEXT_PUBLIC_APP_URL=             # Public app URL — OG tags, OpenRouter attribution

# ─── Server-only (NEVER NEXT_PUBLIC_, never in a client component) ───
OPENROUTER_API_KEY=              # OpenRouter gateway key
COINMARKETCAP_API_KEY=           # Optional — CMC trending/market-cap (tight free quota)
DEXSCREENER_API_URL=             # DexScreener base URL (primary BNB Chain data source)
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role — full DB access, server only
PRIVY_APP_SECRET=                # Privy server secret — token verification
PRIVY_VERIFIER_KEY=              # Privy JWT verification key (passed as jwtVerificationKey
                                 # to skip a network round-trip per request)
```

- `NEXT_PUBLIC_*` prefix only for variables genuinely needed in the browser
- Server-only vars (API keys, service role, Privy secret) must never appear in client bundles — a `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is a critical incident, not a typo
- `COINMARKETCAP_API_KEY` is **optional** — the app must degrade to DexScreener-only if it is absent or quota-exhausted
- `.env.local` for local development (gitignored)
- `.env.example` committed with placeholder values
- A startup check should assert every required var is present and fail loudly with the missing name

### Build Gate
- `npm run build` must pass with zero TypeScript errors
- `npm run lint` must pass with zero ESLint errors
- No `console.log` in production code

---

## Security Principles

### Authentication
- Privy handles all wallet authentication.
- Server SDK is **`@privy-io/node`** (`new PrivyClient({ appId, appSecret, jwtVerificationKey })`). Verify the access token with `privy.utils().auth().verifyAccessToken({ access_token })`, which returns `{ userId, appId, ... }`. The `userId` (Privy DID) is the canonical auth subject; the wallet address is an attribute of the user.
- Pass `PRIVY_VERIFIER_KEY` as `jwtVerificationKey` to avoid a network round-trip on every verification.
- Verification lives in `lib/privy/` — never roll custom auth.

### Database & the Privy↔Supabase boundary (read this carefully)
- **Supabase RLS `auth.jwt()` does NOT see a Privy token.** Privy issues its own JWT; Supabase Auth issues a different one. A naive policy like `wallet = auth.jwt()->>'wallet'` will simply never match a Privy-authenticated request. This is the #1 integration trap in this stack.
- **MVP pattern (what we ship):** the server route verifies the Privy access token, derives the `user_id`, then talks to Supabase with the **service-role client** and *manually scopes every query* by that `user_id`. RLS stays enabled as **defense-in-depth** (deny-by-default; only the service role can write). The browser anon client is used only for genuinely public reads (e.g. `narratives`).
- **Production path (documented, not MVP):** mint a short-lived Supabase-compatible JWT signed with the Supabase JWT secret carrying the Privy `sub`, *or* register Privy as a Supabase third-party auth provider — then RLS `auth.jwt()` works natively. See `docs/ARCHITECTURE.md` § Security.
- `SUPABASE_SERVICE_ROLE_KEY` must never reach the client bundle.
- Migrations keep RLS `ENABLE`d on every table regardless of which pattern is active.

### API
- Validate all input with Zod before processing — never trust request bodies.
- **Abuse protection:** expensive LLM routes need a limiter, but **serverless has no shared memory** — an in-process counter is useless across lambda instances. Since we run **No Redis**, the limiter is backed by Supabase (an atomic upsert into a `rate_limits` table) or the Vercel platform firewall. This is a **production** concern and is explicitly **deferred for the hackathon** (see `docs/SPRINT_01.md`); do not let it block the demo.
- **Cost control:** identical analyses are cache-served (symbol + short time bucket) via the Next.js Data Cache / a recent-analysis lookup, so two users analyzing the same token within minutes don't double-spend LLM credits.
- Never proxy raw LLM responses — outputs are already typed via `generateObject`; shape and sanitize before returning.
- Sanitize all error messages before returning to client.

### Compliance
- Euphoria outputs are **psychological signals for research/education, not financial advice.** A persistent disclaimer must appear in the footer and adjacent to every BUY/SELL/WATCH verdict. This is a hard UI requirement, not a nicety.

### Blockchain
- No transactions without explicit user wallet approval
- Never store or handle private keys
- Read-only RPC calls only in server routes
- Validate all contract addresses before interaction

---

## Commit Conventions

Format: `<type>(<scope>): <description>`

| Type | Use For |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance (deps, config, tooling) |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `test` | Add or update tests |
| `perf` | Performance improvement |

Examples:
```
feat(agents): add Scout Agent with CMC integration
fix(fomo-meter): correct score animation direction
chore(deps): upgrade framer-motion to v12
docs(agents): document Judge Agent prompts
```

Rules:
- Imperative mood: "add", not "added" or "adds"
- No period at end of description
- Scope = affected module/feature
- Keep description under 72 characters
- Breaking changes: append `!` — `feat(api)!: rename analyze endpoint`

---

## Pull Request Conventions

Title format: `feat(scope): description`

Body template:
```markdown
## What
Brief description of the change.

## Why
Motivation — what problem does this solve?

## How
Key implementation decisions (skip if obvious from the diff).

## Testing
How was this manually tested?

## Screenshots
For UI changes — before/after.
```

Rules:
- Every PR must be reviewable in isolation
- Max ~500 lines changed — split larger features
- All CI checks pass before merge
- Squash merge to keep history linear

---

## Development Workflow

### Initial Setup
```bash
git clone <repo>
cd euphoria
npm install
cp .env.example .env.local
# Fill .env.local with real API keys
npm run dev
```

### Daily Workflow
```bash
git checkout -b feature/my-feature
# ... write code ...
npm run lint          # Fix before committing
npm run build         # Verify zero TS errors
git add <specific-files>   # Never git add -A
git commit -m "feat(scope): description"
git push origin feature/my-feature
# Open PR on GitHub
```

### Branch Naming
- `feature/description` — new features
- `fix/description` — bug fixes
- `chore/description` — maintenance

### Key Commands
```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build (catches TS errors)
npm run lint     # ESLint check
npm start        # Start production server locally
```

---

## Folder Structure

```
euphoria/
├── app/
│   ├── layout.tsx               # Root layout (Geist fonts, providers)
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Tailwind v4 imports + CSS variables
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── radar/page.tsx           # FOMO Radar page
│   ├── token/[symbol]/page.tsx  # Token analysis page
│   └── api/
│       ├── analyze/route.ts     # POST /api/analyze
│       ├── fomo/route.ts        # GET /api/fomo
│       ├── narratives/route.ts  # GET /api/narratives
│       └── cron/fomo/route.ts   # GET /api/cron/fomo (Vercel Cron — precompute heat)
├── components/
│   ├── layout/                  # Header, sidebar, wallet-button
│   ├── dashboard/               # Fomo-meter, fomo-radar, heatmap
│   ├── token/                   # Token-header, agent-debate, judge-decision
│   ├── agents/                  # Per-agent display cards
│   └── ui/                      # shadcn/ui + custom primitives
├── lib/
│   ├── agents/
│   │   ├── orchestrator.ts      # Pipeline coordinator
│   │   ├── scout.ts
│   │   ├── narrative.ts
│   │   ├── crowd.ts
│   │   ├── reverse.ts
│   │   ├── judge.ts
│   │   └── prompts.ts           # All LLM prompt templates
│   ├── cmc.ts                   # CoinMarketCap API client
│   ├── dexscreener.ts           # DexScreener API client
│   ├── openrouter.ts            # OpenRouter LLM client
│   ├── supabase/                # Browser + server Supabase clients
│   ├── privy/                   # Auth provider + JWT verification
│   ├── blockchain/              # BNB Chain config + Viem client
│   ├── format.ts                # Number / currency formatters
│   └── utils.ts                 # cn() and general utilities
├── types/
│   ├── index.ts                 # Barrel export
│   ├── agents.ts                # Agent input/output interfaces
│   ├── api.ts                   # API request/response types
│   └── database.ts              # Supabase row types
├── supabase/
│   └── migrations/              # SQL migration files
├── docs/                        # Project documentation
│   ├── ARCHITECTURE.md
│   ├── AGENTS.md
│   ├── TASKS.md
│   ├── PRD.md
│   ├── UI_UX.md
│   └── SPRINT_01.md
├── CLAUDE.md                    # This file
├── AGENTS.md                    # Next.js 16 agent instructions
├── engineering.md               # Internal engineering spec
└── README.md                    # Public-facing documentation
```
