# Engineering.md

## Project

**Euphoria**

AI-Powered Market Psychology Agent

**Tagline:** Trade Market Emotions, Not Charts.

---

# Engineering Philosophy

This project is built for speed, iteration, and hackathon execution.

Priorities:

1. User Experience
2. Agent Intelligence
3. Demo Quality
4. Deployment Simplicity
5. Scalability (Later)

We intentionally optimize for:

- Fast shipping
- Clean architecture
- Full serverless deployment
- Minimal infrastructure

No VPS. No Docker. No Kubernetes.

Everything runs on Vercel.

---

# Tech Stack

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.7 | Framework (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | ^5 | Type Safety |
| Tailwind CSS | ^4 | Styling |
| shadcn/ui | latest | Component Library |
| Framer Motion | latest | Animations |

## AI

| Technology | Purpose |
|------------|---------|
| Vercel AI SDK | AI Integration |
| OpenRouter | LLM Gateway |
| Gemini 2.5 Flash | Fast Agent Responses |
| Gemini 2.5 Pro | Complex Agent Reasoning |

## Backend

| Technology | Purpose |
|------------|---------|
| Next.js Route Handlers | API Layer |
| Server Actions | Data Mutations |

## Database

| Technology | Purpose |
|------------|---------|
| Supabase | PostgreSQL + Auth |
| Row Level Security | Data Protection |

## Authentication

| Technology | Purpose |
|------------|---------|
| Privy | Wallet Authentication |

## Blockchain

| Technology | Purpose |
|------------|---------|
| BNB Chain | Target Blockchain |
| Viem | Low-level Blockchain Interaction |
| Wagmi | React Hooks for Blockchain |

## Data Sources

| Technology | Purpose |
|------------|---------|
| CoinMarketCap API | Market Data |
| DexScreener API | DEX Data |
| BNB Chain RPC | On-chain Data |

## Deployment & Monitoring

| Technology | Purpose |
|------------|---------|
| Vercel | Hosting + Deployment |
| Vercel Analytics | User Analytics |
| Vercel Observability | Monitoring |

---

# Project Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       Vercel Edge                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │   Dashboard   │  │  FOMO Radar  │  │  Token Page   │ │
│  │    (SSR)      │  │    (SSR)     │  │    (SSR)      │ │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
│         │                  │                   │         │
│         └──────────────────┼───────────────────┘         │
│                            │                             │
│              ┌─────────────▼─────────────┐               │
│              │    Agent Orchestrator     │               │
│              │   (Route Handler / SA)    │               │
│              └─────────────┬─────────────┘               │
│                            │                             │
│     ┌──────────────────────┼──────────────────────┐      │
│     │                      │                      │      │
│  ┌──▼─────┐  ┌─────────┐  ┌▼────────┐  ┌───────▼──┐  │
│  │ Scout  │  │Narrative│  │  Crowd  │  │ Reverse  │  │
│  │ Agent  │  │  Agent  │  │  Agent  │  │  Agent   │  │
│  └──┬─────┘  └────┬────┘  └───┬─────┘  └────┬─────┘  │
│     │              │           │              │         │
│     └──────────────┼───────────┼──────────────┘         │
│                    │           │                         │
│              ┌─────▼───────────▼─────┐                   │
│              │     Judge Agent       │                   │
│              └──────────┬────────────┘                   │
│                         │                                │
│              ┌──────────▼──────────┐                    │
│              │   Decision Output   │                    │
│              │  BUY / SELL / WATCH │                    │
│              └─────────────────────┘                    │
└─────────────────────────────────────────────────────────┘

                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     External APIs                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ CoinMarketCap │  │ DexScreener  │  │  OpenRouter  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘

                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      Supabase                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL   │  │    Auth      │  │  Row Level   │  │
│  │   Database    │  │  (via Privy) │  │   Security   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action (Select Token / View Radar)
    │
    ▼
Client Component calls API Route or Server Action
    │
    ▼
Agent Orchestrator initializes agent pipeline
    │
    ├──► Scout Agent fetches market data (CMC, DexScreener)
    │       Returns: { symbol, volume_score, momentum_score }
    │
    ├──► Narrative Agent analyzes market context (OpenRouter)
    │       Returns: { narrative, confidence }
    │
    ├──► Crowd Agent measures market excitement (OpenRouter)
    │       Returns: { fomo_score }
    │
    ├──► Reverse Agent detects overcrowded trades (OpenRouter)
    │       Returns: { bubble_probability }
    │
    ▼
Judge Agent aggregates all agent outputs (OpenRouter)
    │
    ▼
Returns: { decision, confidence, fomo_score, reasoning }
    │
    ▼
Client renders results + saves to Supabase
```

## Request-Response Flow

```
1. Client → POST /api/analyze { symbol: "TOKEN" }
2. API Route → Agent Orchestrator
3. Orchestrator → Execute agents in parallel where possible
4. Agents → Call external APIs (CMC, DexScreener, OpenRouter)
5. Agents → Return structured outputs
6. Orchestrator → Judge Agent synthesizes final decision
7. API Route → Save analysis to Supabase
8. API Route → Return JSON response to client
9. Client → Render UI with streaming where applicable
```

## Streaming Architecture

- Dashboard page uses Suspense boundaries for progressive loading
- Agent outputs stream via Server-Sent Events (SSE) for real-time feel
- FOMO Radar loads with skeleton placeholders, then populates
- Debate view shows agent responses as they arrive

---

# Agent System

## Agent Execution Model

All agents execute inside Next.js Route Handlers. No persistent workers. No background infrastructure.

```
POST /api/analyze
    │
    ▼
Agent Orchestrator (lib/agents/orchestrator.ts)
    │
    ├──► Scout Agent (lib/agents/scout.ts)
    │       - Fetch token metrics from CMC + DexScreener
    │       - Calculate volume_score, momentum_score
    │       - Return structured data
    │
    ├──► Narrative Agent (lib/agents/narrative.ts)
    │       - Analyze token context with LLM
    │       - Identify market narrative (AI, Memecoin, RWA, etc.)
    │       - Return narrative + confidence
    │
    ├──► Crowd Agent (lib/agents/crowd.ts)
    │       - Measure market excitement with LLM
    │       - Analyze volume/price acceleration
    │       - Return fomo_score (0-100)
    │
    ├──► Reverse Agent (lib/agents/reverse.ts)
    │       - Detect overcrowded trades with LLM
    │       - Analyze momentum extremes
    │       - Return bubble_probability
    │
    ▼
Judge Agent (lib/agents/judge.ts)
    - Aggregate all agent outputs
    - Synthesize final decision with LLM
    - Return BUY / SELL / WATCH + confidence
```

## Scout Agent

**Goal:** Find opportunities.

**Input:**
- Trending Tokens (via CMC)
- Top Gainers (via DexScreener)
- Volume Spikes (via DexScreener)

**Output:**
```typescript
{
  symbol: string;
  volume_score: number;      // 0-100
  momentum_score: number;    // 0-100
}
```

---

## Narrative Agent

**Goal:** Understand why the market is moving.

**Input:**
- Token data (from Scout Agent)
- Market data (from CMC + DexScreener)

**Output:**
```typescript
{
  narrative: string;         // AI, Memecoin, RWA, DePIN, Gaming, DeFi, Layer1, Layer2
  confidence: number;        // 0-100
}
```

**Narrative Categories:**
- AI
- Memecoin
- RWA
- DePIN
- Gaming
- DeFi
- Layer1
- Layer2

---

## Crowd Agent

**Goal:** Measure market excitement.

**Output:**
```typescript
{
  fomo_score: number;       // 0-100
}
```

**Factors:**
- Volume acceleration
- Price acceleration
- Narrative heat
- Market attention

**Range:** 0-100

---

## Reverse Agent

**Goal:** Detect overcrowded trades.

**Output:**
```typescript
{
  bubble_probability: number; // 0-100
}
```

**Factors:**
- Extreme momentum
- Excessive attention
- Unsustainable growth

---

## Judge Agent

**Goal:** Make final decision.

**Input:** Scout Agent, Narrative Agent, Crowd Agent, Reverse Agent

**Output:**
```typescript
{
  decision: "BUY" | "SELL" | "WATCH";
  confidence: number;       // 0-100
}
```

---

# Core Features

## FOMO Radar

Shows hottest narratives.

Narratives: AI, DePIN, Memecoin, Gaming

---

## FOMO Meter

Displays market excitement.

| Range | Level |
|-------|-------|
| 0-20 | Calm |
| 20-40 | Interest |
| 40-60 | Bullish |
| 60-80 | FOMO |
| 80-100 | Euphoria |

---

## Narrative Discovery

AI explains:
- Why token is moving
- Why people care
- What narrative drives demand

---

## AI Debate

Crowd Agent vs Reverse Agent before final decision.

---

# API Structure

## `GET /api/fomo`

Returns: FOMO Index for all tracked narratives.

```typescript
{
  fomo_index: number;
  narratives: Array<{
    name: string;
    heat_score: number;
  }>;
}
```

## `GET /api/narratives`

Returns: Trending narratives.

```typescript
{
  narratives: Array<{
    id: string;
    name: string;
    heat_score: number;
    tokens: string[];
  }>;
}
```

## `POST /api/analyze`

Request:
```typescript
{
  symbol: string;
}
```

Response:
```typescript
{
  symbol: string;
  fomo_score: number;
  decision: "BUY" | "SELL" | "WATCH";
  confidence: number;
  narrative: string;
  reasoning: string;
}
```

## `POST /api/debate`

Request:
```typescript
{
  symbol: string;
}
```

Response:
```typescript
{
  crowd_agent: {
    argument: string;
    fomo_score: number;
  };
  reverse_agent: {
    argument: string;
    bubble_probability: number;
  };
  verdict: {
    decision: "BUY" | "SELL" | "WATCH";
    confidence: number;
  };
}
```

---

# Database Schema

## `users`

```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet      TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (wallet = auth.jwt()->>'wallet');
```

## `analyses`

```sql
CREATE TABLE analyses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  symbol      TEXT NOT NULL,
  fomo_score  INTEGER CHECK (fomo_score >= 0 AND fomo_score <= 100),
  decision    TEXT CHECK (decision IN ('BUY', 'SELL', 'WATCH')),
  confidence  INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses"
  ON analyses FOR SELECT
  USING (user_id = (SELECT id FROM users WHERE wallet = auth.jwt()->>'wallet'));

CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM users WHERE wallet = auth.jwt()->>'wallet'));
```

## `narratives`

```sql
CREATE TABLE narratives (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  heat_score  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE narratives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read narratives"
  ON narratives FOR SELECT
  USING (true);
```

## `agent_logs`

```sql
CREATE TABLE agent_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id),
  agent_type  TEXT CHECK (agent_type IN ('scout', 'narrative', 'crowd', 'reverse', 'judge')),
  input       JSONB,
  output      JSONB,
  latency_ms  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own agent logs"
  ON agent_logs FOR SELECT
  USING (analysis_id IN (
    SELECT id FROM analyses WHERE user_id = (
      SELECT id FROM users WHERE wallet = auth.jwt()->>'wallet'
    )
  ));
```

## Entity Relationship

```
users 1 ──── * analyses
analyses 1 ──── * agent_logs
narratives (standalone, global)
```

---

# Folder Structure

```
euphoria/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles + Tailwind
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   ├── radar/
│   │   └── page.tsx            # FOMO Radar page
│   ├── token/
│   │   └── [symbol]/
│   │       └── page.tsx        # Token analysis page
│   └── api/
│       ├── analyze/
│       │   └── route.ts        # POST /api/analyze
│       ├── fomo/
│       │   └── route.ts        # GET /api/fomo
│       ├── narratives/
│       │   └── route.ts        # GET /api/narratives
│       └── debate/
│           └── route.ts        # POST /api/debate
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── wallet-button.tsx
│   ├── dashboard/
│   │   ├── fomo-meter.tsx
│   │   ├── fomo-radar.tsx
│   │   ├── narrative-heatmap.tsx
│   │   └── recent-analyses.tsx
│   ├── token/
│   │   ├── token-header.tsx
│   │   ├── agent-debate.tsx
│   │   ├── judge-decision.tsx
│   │   └── token-metrics.tsx
│   ├── agents/
│   │   ├── scout-card.tsx
│   │   ├── narrative-card.tsx
│   │   ├── crowd-card.tsx
│   │   ├── reverse-card.tsx
│   │   └── judge-card.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── meter.tsx
│       ├── skeleton.tsx
│       └── ...
├── lib/
│   ├── agents/
│   │   ├── orchestrator.ts     # Agent pipeline coordinator
│   │   ├── scout.ts            # Scout Agent
│   │   ├── narrative.ts        # Narrative Agent
│   │   ├── crowd.ts            # Crowd Agent
│   │   ├── reverse.ts          # Reverse Agent
│   │   ├── judge.ts            # Judge Agent
│   │   └── prompts.ts          # LLM prompt templates
│   ├── cmc.ts                  # CoinMarketCap API client
│   ├── dexscreener.ts          # DexScreener API client
│   ├── openrouter.ts           # OpenRouter LLM client
│   ├── supabase/
│   │   ├── client.ts           # Supabase client (browser)
│   │   ├── server.ts           # Supabase client (server)
│   │   └── middleware.ts        # Auth middleware helpers
│   ├── privy/
│   │   ├── client.ts           # Privy client config
│   │   └── provider.tsx        # Privy context provider
│   ├── blockchain/
│   │   ├── config.ts           # BNB Chain config
│   │   ├── client.ts           # Viem public client
│   │   └── wagmi.ts            # Wagmi config
│   ├── format.ts               # Number/currency formatters
│   └── utils.ts                # General utilities
├── types/
│   ├── index.ts                # Shared types
│   ├── agents.ts               # Agent input/output types
│   ├── api.ts                  # API request/response types
│   └── database.ts             # Database row types
├── supabase/
│   └── migrations/
│       └── 001_initial.sql     # Initial schema migration
├── public/
│   └── ...                     # Static assets
├── engineering.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── .env.local                  # Environment variables (gitignored)
```

---

# Code Rules

## General Principles

1. **TypeScript strict mode** — all code must pass with `strict: true`. No `any` unless absolutely necessary.
2. **Server-first data fetching** — prefer Server Components and Route Handlers over client-side fetches.
3. **One file, one responsibility** — components, agents, and API routes each do one thing.
4. **No barrel exports in lib/** — import directly from the file. Barrel files in `components/` and `types/` only.
5. **All external calls must have error handling** — every fetch, API call, and agent invocation is wrapped in try/catch with meaningful fallbacks.

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Files (components) | `kebab-case.tsx` | `fomo-meter.tsx` |
| Files (lib) | `kebab-case.ts` | `openrouter.ts` |
| Files (types) | `kebab-case.ts` | `agents.ts` |
| React Components | `PascalCase` | `FomoMeter` |
| Functions | `camelCase` | `calculateFomoScore` |
| Types / Interfaces | `PascalCase` | `AgentOutput` |
| Environment Variables | `UPPER_SNAKE_CASE` | `OPENROUTER_API_KEY` |
| Database Tables | `snake_case` | `agent_logs` |
| Database Columns | `snake_case` | `created_at` |

## Component Rules

1. **Use Server Components by default.** Only add `"use client"` when interacting with browser APIs, React state, or event handlers.
2. **Components export as default** unless there are multiple exports from the same file.
3. **Props interfaces are named `{ComponentName}Props`** and defined in the same file.
4. **Style with Tailwind only** — no inline styles, no CSS modules. Use the `cn()` utility from `lib/utils.ts` for conditional classes.
5. **No prop drilling past 1 level** — use composition or context for deeply nested data.

```typescript
// ✅ Good — Server Component
export default function FomoMeter({ score }: { score: number }) {
  return <div className="...">{score}</div>;
}

// ❌ Bad — unnecessary client component
"use client";
export default function StaticText({ text }: { text: string }) {
  return <p>{text}</p>;
}
```

## Agent Rules

1. **Agent functions are pure** — they take input and return output. No side effects (database writes happen in the orchestrator or API route).
2. **Agents live in `lib/agents/`** — one file per agent.
3. **Each agent exposes a single `execute()` function** that accepts typed input and returns typed output.
4. **LLM prompts are centralized in `lib/agents/prompts.ts`** as template literals with typed parameters.
5. **Agents must return within 15 seconds** — Vercel function timeout.
6. **Parallelize independent agents** in the orchestrator using `Promise.all()`.

```typescript
// ✅ Good — pure agent function
export async function execute(input: ScoutInput): Promise<ScoutOutput> {
  const data = await fetchTokenData(input.symbol);
  return {
    symbol: input.symbol,
    volume_score: calculateVolumeScore(data),
    momentum_score: calculateMomentum(data),
  };
}
```

## API Route Rules

1. **Route Handlers should be thin** — validate input, call orchestrator, return response.
2. **Use zod for request validation** at the route boundary.
3. **Return consistent error shapes:**
   ```typescript
   { error: string; details?: unknown }
   ```
4. **Cache where appropriate** — use Next.js `revalidate` and `stale-while-revalidate` for GET endpoints.

```typescript
// ✅ Good — thin route handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol } = analyzeSchema.parse(body);
    const result = await analyze(symbol);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
```

## Database Rules

1. **All database writes go through Supabase server client** (`lib/supabase/server.ts`).
2. **Row Level Security is enforced on every table** — never query without an auth context.
3. **No raw SQL in application code** — use Supabase SDK `from().select().eq()` pattern.
4. **Migration files tracked in `supabase/migrations/`** — one file per schema change, timestamped.

## Blockchain Rules

1. **Wagmi for wallet interactions** — use `useAccount`, `useConnect`, etc.
2. **Viem for raw RPC calls and contract interactions** — keep it in `lib/blockchain/`.
3. **BNB Chain only** — hardcode chain config, no multi-chain support for MVP.
4. **No transactions without user confirmation** — all writes require explicit wallet approval.

## Environment Variables

```
# Required
OPENROUTER_API_KEY=
COINMARKETCAP_API_KEY=
DEXSCREENER_API_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PRIVY_APP_ID=
PRIVY_APP_SECRET=
PRIVY_VERIFIER_KEY=

# Optional
NEXT_PUBLIC_APP_URL=
OPENROUTER_REFERRER_URL=
```

`.env.local` is gitignored. Template available at `.env.example`.

## Error Handling

1. **External API failures must degrade gracefully** — show cached data or a meaningful fallback UI, never a blank screen.
2. **Agent failures are isolated** — if one agent fails, others continue. Judge Agent weights missing data appropriately.
3. **LLM failures retry once** with backoff, then fall back to heuristic scoring.
4. **Never expose internal error details to the client** — sanitize error messages.

## Git Workflow

1. **Branch naming:** `feature/description`, `fix/description`, `chore/description`
2. **Commit messages:** imperative, concise. Prefix with scope: `feat:`, `fix:`, `chore:`, `docs:`
3. **No committing `.env` files, node_modules, or `.next/`**
4. **Commit engineering.md updates** as scope evolves

---

# Design System

**Theme:** Dark

**Inspiration:** Bloomberg Terminal, Perplexity, Polymarket

**Visual Keywords:**
- Premium
- Fast
- Futuristic
- Minimal

**Typography:**
- Geist Sans (headings + body)
- Geist Mono (data, tickers, numbers)

**Colors:**
- Background: `#0a0a0a`
- Foreground: `#ededed`
- Primary accent: To be defined (shadcn setup)
- FOMO scale: Green → Yellow → Orange → Red

---

# MVP Scope

## Must Have

- [ ] Wallet Connect (Privy)
- [ ] FOMO Radar page
- [ ] Token Analysis page
- [ ] Multi-Agent Debate view
- [ ] FOMO Meter component
- [ ] Judge Decision display
- [ ] Analysis history

## Nice To Have

- [ ] Portfolio Analysis
- [ ] Auto Trade
- [ ] Agent Memory
- [ ] Push Notifications
- [ ] Real-time streaming

---

# Hackathon Demo Flow

```
Connect Wallet
    ↓
Open Dashboard
    ↓
Select Token
    ↓
Agents Analyze (parallel)
    ↓
AI Debate (Crowd vs Reverse)
    ↓
Judge Decision
    ↓
FOMO Score Generated
    ↓
Trade Recommendation (BUY / SELL / WATCH)
```

The demo must feel alive, fast, and visually impressive.

---

# Installation & Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in all required environment variables

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

---

# Dependencies to Install

```bash
# UI
npx shadcn@latest init
npm install framer-motion

# AI
npm install ai @ai-sdk/openai

# Database
npm install @supabase/supabase-js

# Auth
npm install @privy-io/react-auth @privy-io/server

# Blockchain
npm install viem wagmi @tanstack/react-query

# Validation
npm install zod

# Utilities
npm install clsx tailwind-merge
```
