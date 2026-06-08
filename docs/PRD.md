# Euphoria — Product Requirements Document

> **Trade Market Emotions, Not Charts.**

**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-06-08

---

## Table of Contents

1. [Vision & Mission](#vision--mission)
2. [Problem Statement](#problem-statement)
3. [Target Users](#target-users)
4. [User Personas](#user-personas)
5. [User Stories](#user-stories)
6. [Functional Requirements](#functional-requirements)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Success Metrics](#success-metrics)
9. [KPIs](#kpis)
10. [Risks & Mitigations](#risks--mitigations)
11. [Assumptions](#assumptions)
12. [Future Opportunities](#future-opportunities)

---

## Vision & Mission

### Vision
Euphoria is the first platform where market psychology — not technical charts — is the primary trading signal. We believe the most profitable trades come from understanding human emotions at scale, before the crowd realizes what's happening.

### Mission
Give traders a psychological edge by making crowd emotions, narrative momentum, and market psychology legible, actionable, and beautiful.

### Product Tagline
**Trade Market Emotions, Not Charts.**

### North Star
Become the definitive platform for understanding *why* markets move, not just *that* they moved.

---

## Problem Statement

### The Core Problem

Crypto traders are drowning in noise. Every platform offers:
- More charts
- More indicators
- More technical analysis

But charts only show *what happened*, not *why*. And the "why" — the narrative, the crowd behavior, the emotional state of the market — is where alpha actually lives.

### Specific Pain Points

**1. Information Overload**
Traders must synthesize price action, on-chain data, social sentiment, news, and technical indicators simultaneously. No tool helps them understand the *psychology* behind all of it.

**2. FOMO is Invisible**
By the time a trader recognizes FOMO, they're already late. There's no quantified score for "how much crowd excitement is in this token right now."

**3. Narrative Blindness**
Tokens move in narrative clusters (AI wave, DePIN summer, RWA season). Traders who understand narratives early capture asymmetric returns. Most traders have no systematic way to identify narrative momentum.

**4. Analysis Paralysis**
More data doesn't help if it can't be synthesized into a decision. Traders need an opinionated signal: BUY, SELL, or WATCH — with clear reasoning.

**5. Technical Analysis Theater**
Most retail traders use RSI, MACD, and Bollinger Bands without understanding the psychology those indicators are proxy-measuring. Euphoria makes the psychology direct and legible.

### Market Opportunity

The BNB Chain ecosystem has:
- $3B+ daily DEX volume
- Millions of active wallets
- A highly active memecoin and DeFi ecosystem
- Underserved retail traders who need an edge

---

## Target Users

### Primary Users
- **Active BNB Chain traders** (2–50 trades/week)
- **DeFi yield hunters** seeking narrative momentum in new protocols
- **Memecoin traders** trying to time entry before FOMO peaks

### Secondary Users
- **Crypto-curious users** who want to understand market psychology without deep technical knowledge
- **Portfolio managers** tracking multiple positions for psychological risk
- **Hackathon judges** evaluating the platform as an innovative application of AI

### User Segments by Sophistication

| Segment | % of Users | Description |
|---|---|---|
| Advanced traders | 15% | Use Euphoria as one signal among many; want raw scores and reasoning |
| Active traders | 45% | Use Euphoria as their primary decision support; value the debate view |
| Casual traders | 30% | Check FOMO Radar occasionally; use for narrative discovery |
| Curious browsers | 10% | Not yet trading; learning about market psychology |

---

## User Personas

### Persona 1: "The FOMO Hunter" — Marcus

**Background:** 26-year-old software engineer in Singapore. Has been trading BNB Chain tokens for 18 months. Made significant gains during the AI narrative wave but got caught bag-holding a memecoin when FOMO peaked.

**Goals:**
- Enter trends before the crowd arrives
- Exit before FOMO becomes Euphoria
- Understand which narratives are building momentum vs. cooling

**Pain Points:**
- No quantified signal for when FOMO is about to peak
- Spent hours scrolling Twitter to understand narrative momentum
- Got burned by reading chart patterns instead of crowd behavior

**How Euphoria Helps:**
- FOMO Meter shows exactly where crowd excitement is on the 0–100 scale
- Reverse Agent flags when FOMO score suggests exit rather than entry
- FOMO Radar shows narrative momentum across categories before price action

**Quote:** *"I don't need another RSI. I need to know when everyone else is about to panic-buy so I can be already positioned."*

---

### Persona 2: "The Narrative Analyst" — Priya

**Background:** 34-year-old crypto fund analyst in London. Covers BNB Chain DeFi protocols for a small fund. Needs to justify investment theses with qualitative research, not just charts.

**Goals:**
- Identify emerging narratives before they become mainstream
- Understand why specific tokens are outperforming within a narrative
- Produce investment memos with clear psychological context

**Pain Points:**
- No systematic way to track narrative momentum across chains
- Spends 3+ hours/day synthesizing social signals, news, and on-chain data
- Need to explain "the story" to fund partners who don't read charts

**How Euphoria Helps:**
- Narrative Agent provides institutional-quality narrative analysis
- Historical analyses in dashboard show narrative lifecycle (emerging → hot → cooling)
- Reasoning from Judge Agent directly usable in investment memos

**Quote:** *"The hardest part of my job is explaining WHY something is moving. Euphoria gives me the words, not just the numbers."*

---

### Persona 3: "The Fast Flipper" — Jake

**Background:** 22-year-old full-time crypto trader in Miami. Specializes in short-term plays on BNB Chain memecoins and new DeFi launches. High risk tolerance. Trades 10–30 times/week.

**Goals:**
- Get in and out of positions quickly with clear signals
- Find the next narrative before it goes viral
- Avoid exit liquidity traps where he buys someone else's dump

**Pain Points:**
- FOMO-buys at tops because he can't tell when the crowd is at peak excitement
- No systematic contrarian analysis to flag when a trade is overcrowded
- Too many apps — wants one clear BUY/SELL/WATCH signal with fast UI

**How Euphoria Helps:**
- Judge Agent produces clear BUY/SELL/WATCH with confidence in < 15 seconds
- Reverse Agent specifically designed to catch the traps Jake falls into
- Fast dark UI designed for high-frequency decision-making

**Quote:** *"Give me one clear signal in 10 seconds. I'll handle the rest."*

---

## User Stories

### Authentication & Onboarding

1. As a new user, I want to connect my BNB Chain wallet so I can access personalized features without creating a username/password.
2. As a connected user, I want to see my wallet address in the header so I can confirm I'm using the right wallet.
3. As a user, I want to disconnect my wallet from the platform at any time.
4. As a first-time user, I want a brief explanation of what FOMO score means before I see my first analysis.
5. As a user, I want the platform to remember I was logged in so I don't reconnect every visit.

### FOMO Radar

6. As a trader, I want to see which narrative sectors have the highest FOMO right now so I can focus my research.
7. As a trader, I want to see which tokens are driving each narrative's FOMO so I know where to look.
8. As a trader, I want to see the global market FOMO index so I understand the overall market psychology.
9. As a trader, I want FOMO scores to update regularly so I have current data when making decisions.
10. As a trader, I want to click on a narrative to see all tokens associated with it.

### Token Analysis

11. As a trader, I want to analyze any BNB Chain token by entering its symbol so I can get a psychological assessment.
12. As a trader, I want to see the complete agent pipeline running so I understand how the decision was reached.
13. As a trader, I want to see the Scout Agent's raw market data (volume score, momentum) as the first signal.
14. As a trader, I want to see the Narrative Agent explain *why* the token is moving in plain English.
15. As a trader, I want to see the Crowd Agent's FOMO score with the psychological level label.
16. As a trader, I want to see the Reverse Agent's contrarian case — why this might be a trap.
17. As a trader, I want to see the Crowd vs Reverse debate before the Judge decides.
18. As a trader, I want the Judge Agent to give a clear BUY/SELL/WATCH recommendation with a confidence score.
19. As a trader, I want to see the Judge's plain-English reasoning so I can validate or reject the decision.
20. As a trader, I want to see the "key insight" — the single most important thing about this trade.

### FOMO Meter

21. As a trader, I want to see a visual gauge showing the FOMO level (Calm/Interest/Bullish/FOMO/Euphoria) so I can understand the psychological state at a glance.
22. As a trader, I want the FOMO score to animate to its final value so it feels alive and informative.
23. As a trader, I want the FOMO Meter to use color coding that matches the urgency (green=calm, red=euphoria).

### Analysis History

24. As a trader, I want to see my past analyses so I can track how my decisions performed.
25. As a trader, I want to see when I analyzed a token and what the decision was.
26. As a trader, I want to click a past analysis to see its full results.
27. As a trader, I want to re-run an analysis on a previously analyzed token to see if conditions have changed.

### Dashboard

28. As a trader, I want a dashboard overview of the market psychological state when I open the app.
29. As a trader, I want to see the top 5 trending tokens by FOMO score on the dashboard.
30. As a trader, I want to see narrative heat at a glance without going to the Radar page.

### Sharing & Social

31. As a trader, I want to share my analysis with others by copying a link.
32. As a trader, I want the shared analysis page to work without requiring wallet connection.
33. As a trader, I want OG preview images when sharing on social media.

### Settings & Preferences

34. As a user, I want the platform to always use dark mode — no light mode option needed.
35. As a user, I want to see my analysis count (e.g., "47 analyses run") as a usage indicator.

### Mobile

36. As a mobile user, I want to run token analyses from my phone during commute.
37. As a mobile user, I want the FOMO Meter and agent debate to work well on a small screen.
38. As a mobile user, I want navigation to be accessible via a slide-in menu.

### Error States

39. As a user, when an analysis fails, I want a clear error message explaining what went wrong and how to retry.
40. As a user, when I enter an unknown token symbol, I want a clear "Token not found" message rather than a crash.

---

## Functional Requirements

### F1: Authentication System
- F1.1: Users must be able to connect BNB Chain wallets via Privy
- F1.2: Supported wallet types: MetaMask, WalletConnect, injected providers
- F1.3: JWT issued by Privy must be verified server-side on all authenticated requests
- F1.4: Session persists across browser refreshes
- F1.5: Users can disconnect wallet at any time

### F2: Agent Pipeline
- F2.1: System must support analysis of any BNB Chain token by symbol
- F2.2: Scout Agent must complete within 5 seconds
- F2.3: Narrative, Crowd, and Reverse agents must run in parallel
- F2.4: Full pipeline targets p95 ~10–17s with `maxDuration = 60`; Narrative may drop to Flash under load (`MODEL_TIER=lean`) leaving Judge as the only Pro call
- F2.5: Judge Agent must always produce a BUY/SELL/WATCH decision even with partial data
- F2.6: Agent failures must not block the pipeline — neutral fallbacks applied

### F3: FOMO Scoring
- F3.1: FOMO score must be 0–100 with defined levels (Calm/Interest/Bullish/FOMO/Euphoria)
- F3.2: Score must be calculated from volume acceleration, price momentum, and narrative heat
- F3.3: Global FOMO index must aggregate per-narrative scores
- F3.4: FOMO scores must refresh at minimum every 5 minutes for Radar view

### F4: Narrative System
- F4.1: System must support 8 narrative categories (AI, Memecoin, RWA, DePIN, Gaming, DeFi, Layer1, Layer2)
- F4.2: Narrative classification must include confidence score
- F4.3: Narrative heat scores must be persistently stored and updated

### F5: Data Persistence
- F5.1: All analyses must be saved to Supabase (anonymous analyses with `user_id = null`)
- F5.2: Agent logs (input/output/latency) saved best-effort — never blocking the response
- F5.3: User analysis history must be queryable
- F5.4: Cross-user access prevented by server-side scoping on the verified `user_id`, with RLS enabled as a backstop
- F5.5: Identical analyses (same symbol, short window) are cache-served to avoid redundant LLM spend

### F6: UI & Presentation
- F6.1: Platform must be dark mode only
- F6.2: All agent results must animate in progressively (not render all at once)
- F6.3: FOMO score must animate from 0 to final value
- F6.4: Judge decision must have a distinctive reveal animation
- F6.5: Loading states must use skeleton placeholders
- F6.6: A "not financial advice" disclaimer must appear in the footer and beside every verdict
- F6.7: Anonymous users can analyze a token and view shared analyses without connecting a wallet (try-before-connect funnel)

### F7: Mobile
- F7.1: All core features must be usable on mobile devices (320px–768px width)
- F7.2: Navigation must be accessible via collapsible sidebar on mobile

---

## Non-Functional Requirements

### Performance
| Requirement | Target |
|---|---|
| Token analysis total latency | target p95 ~10–17s; route `maxDuration = 60` (3 sequential LLM hops; cached repeats are instant) |
| Dashboard initial load (SSR) | < 2 seconds |
| FOMO Radar load (SSR + cache) | < 1 second |
| Vercel Function cold start impact | < 300ms additional |
| Largest Contentful Paint (LCP) | < 2.5 seconds |
| Cumulative Layout Shift (CLS) | < 0.1 |

### Scalability
- Platform must support 1,000 concurrent users without infrastructure changes
- Vercel serverless handles horizontal scaling automatically
- Supabase connection pooling enabled for > 50 concurrent DB connections

### Reliability
| Requirement | Target |
|---|---|
| Agent pipeline success rate | > 99% (with fallbacks) |
| LLM call success rate (with retry) | > 98% |
| API uptime | > 99.9% (Vercel SLA) |
| External API failure handling | Graceful degradation — no blank screens |

### Security
- All API keys stored as server-side environment variables only; no `NEXT_PUBLIC_*` for secrets
- Input validation on all API routes (Zod)
- **Prompt-injection defense:** untrusted token metadata is quarantined in delimited prompt blocks; `generateObject` schema-constrains all model output
- **Auth:** Privy access tokens verified server-side via `@privy-io/node`; the Privy DID is the auth subject
- **Authorization:** server-side service-role scoping by verified `user_id`, with Supabase RLS enabled as a deny-by-default backstop (Supabase `auth.jwt()` cannot read a Privy token — see ARCHITECTURE § Database)
- **Abuse limiting:** Supabase-backed or platform-firewall limiter (No Redis) — a production requirement, deferred for the hackathon
- Compliance: "not financial advice" disclaimer surfaced in-product

### Observability
- All agent executions logged with latency and outcome
- Vercel Analytics tracking Core Web Vitals
- Custom events: `wallet_connected`, `analysis_started`, `analysis_completed`
- Function invocation logs available in Vercel Dashboard

### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Color contrast ratio ≥ 4.5:1 for all text
- Screen reader compatible with semantic HTML

---

## Success Metrics

### Hackathon MVP (Phase 1)
- **Demo works end-to-end** — wallet connect → token analysis → BUY/SELL/WATCH in < 15s
- **5 successful test analyses** run before demo with consistent results
- **Visual quality** — judges experience the "alive" dashboard feel
- **Deployed** — live on Vercel, publicly accessible

### 30-Day Post-Hackathon
- **MAU ≥ 100** — 100 unique wallets connecting
- **Analyses run ≥ 500** — platform actively used, not just visited
- **Agent pipeline success rate ≥ 95%** — technical reliability
- **Average session duration ≥ 3 minutes** — users engaging meaningfully

### 90-Day
- **MAU ≥ 1,000**
- **FOMO score accuracy ≥ 55%** — tokens with FOMO > 70 outperform BNB Chain index over 24h at least 55% of the time
- **Narrative accuracy ≥ 85%** — classified narrative matches token's actual sector
- **Retention ≥ 30%** — users returning within 7 days

---

## KPIs

### Primary KPIs
| KPI | Measurement | Target (30d) | Target (90d) |
|---|---|---|---|
| Monthly Active Wallets | Unique wallet connects per month | 100 | 1,000 |
| Analyses Completed | Total successful analyses | 500 | 5,000 |
| Decision Accuracy | % of BUY decisions that outperform 24h later | — | ≥ 55% |
| Pipeline Success Rate | % of analysis requests returning valid output | ≥ 95% | ≥ 99% |

### Secondary KPIs
| KPI | Measurement | Target |
|---|---|---|
| Avg. Analysis Latency | Seconds from request to result | < 15s |
| Bounce Rate | % visitors who leave without analyzing | < 60% |
| Return Rate | % users who return within 7 days | ≥ 30% |
| Narrative Accuracy | % correct narrative classifications | ≥ 85% |
| Mobile Traffic Share | % analyses from mobile | Track only |

### Engagement KPIs
| KPI | Measurement | Target |
|---|---|---|
| Analyses per Session | Avg. number of analyses per visit | ≥ 2 |
| FOMO Radar Views per Session | Users visiting Radar | ≥ 70% |
| Debate View Completion | % who scroll to see Judge decision | ≥ 80% |

---

## Risks & Mitigations

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| OpenRouter rate limiting during demo | Medium | High | Demo mode with pre-computed results; analyze-by-symbol cache; warm before demo |
| CoinMarketCap free tier (333 req/day) exhausted | High | Medium | **DexScreener is primary**; CMC optional and hit only by the Cron batch, not user requests |
| Per-request latency near route ceiling | Medium | High | `maxDuration=60`; `MODEL_TIER=lean` (Narrative→Flash); Crowd∥Reverse; cache |
| **Privy↔Supabase RLS gap** (silent: policies never match Privy tokens) | High if unaddressed | High | Verify Privy server-side, use service-role + manual `user_id` scoping; documented production path |
| **Prompt injection via token name/symbol** | Medium | Medium | Delimited untrusted-data blocks; `generateObject` schema constrains output |
| Gemini model outage | Low | High | OpenRouter automatic fallback to equivalent model |
| Supabase connection exhaustion | Low | Medium | Use the Supabase pooler URL for serverless |
| Privy wallet auth complexity | Medium | Medium | MetaMask as primary; test before demo |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM produces inconsistent decisions for same token | Medium | High | Temperature 0.3; output validation and normalization |
| FOMO scores don't correlate with actual price moves | Medium | High | Frame as psychological signal, not price prediction |
| Traders dismiss AI analysis without charts | Medium | Medium | Show data sources; transparent reasoning builds trust |
| Low hackathon participation | Low | Medium | Pre-prepare demo flow, seed data, fallback mode |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Token not found for demo tokens | Low | High | Pre-test with 10 tokens; have backup symbols ready |
| Regulatory concerns around trading signals | Low | Low | Frame as educational/psychological tool, not financial advice |
| Competing products launch similar feature | Low | Low | Speed to market; hackathon as validation event |

---

## Assumptions

1. **BNB Chain as primary chain** — All token analysis scoped to BNB Chain for MVP
2. **English only** — All LLM prompts and outputs in English
3. **DexScreener (primary) + optional CMC sufficient** — DexScreener covers BNB Chain price/volume/liquidity for free; CMC adds market-cap/trending context but is optional. No on-chain RPC data for MVP. Privy DID is the auth subject; outputs are explicitly not financial advice.
4. **LLM outputs are reliable enough** — At temperature 0.3, Gemini produces consistent classifications
5. **FOMO as leading indicator** — The hypothesis that FOMO score precedes price movement is testable post-launch
6. **Serverless performance is sufficient** — 15 second timeout is acceptable for analysis
7. **Wallet-based authentication** — No email/social auth needed for crypto-native audience
8. **Dark mode preferred** — Target users prefer dark UIs; no light mode required
9. **No financial regulation** — Platform provides psychological signals, not regulated financial advice
10. **OpenRouter availability** — OpenRouter remains operational and accessible for hackathon duration
11. **Free-tier API limits** — DexScreener's free tier sustains the demo and early users; CMC's 333/day quota is respected by routing it through the scheduled Cron batch only (never user requests), and the app degrades gracefully without it

---

## Future Opportunities

### Short-Term (3–6 months)

**1. Social Signal Integration**
Incorporate Twitter/X mention volume and Telegram activity as inputs to the Crowd Agent. Moves the FOMO score from pure price-based to multi-signal.

**2. Real-Time Streaming**
Stream agent outputs via Server-Sent Events so the analysis feels live rather than batch-loaded. Narrative appears first, then Crowd, then Reverse, then Judge — each arriving as it's ready.

**3. Historical FOMO Charting**
Show FOMO score history for a token over the past 30 days as a line chart. Makes it clear visually when FOMO peaked and what happened to price.

**4. Notification System**
Push alerts when a watchlisted token crosses a FOMO threshold (e.g., "CAKE just entered Euphoria zone — check now").

---

### Medium-Term (6–12 months)

**5. Portfolio Psychology Score**
Analyze a user's wallet holdings and produce a combined psychological risk score — "Your portfolio is 73% in high-FOMO assets."

**6. Narrative Lifecycle Tracker**
Track individual narratives from birth (< 20 heat) through viral (80+) to cooling (declining), helping traders understand where each narrative is in its lifecycle.

**7. On-Chain Behavioral Signals**
Integrate Viem to detect large wallet movements (> $100k transfers) as input signals to the Scout and Reverse agents.

**8. Cross-Chain Support**
Expand beyond BNB Chain to Ethereum, Solana, and Base — using the same agent architecture with chain-specific data sources.

---

### Long-Term (12+ months)

**9. AI Agent Memory**
Agents that remember past analyses and improve recommendations based on what worked. "Last time CAKE was in Euphoria, it dropped 23% in 3 days — here's what's different this time."

**10. Institutional API**
B2B offering: hedge funds and market makers access Euphoria's FOMO scores and narrative classifications via REST API with higher rate limits.

**11. Community Signals**
Aggregate "crowd wisdom" — platform users vote on their own FOMO perception, creating a community-sourced signal layer.

**12. Auto-DCA based on FOMO**
With explicit user consent and appropriate regulation: automatically DCA into positions when FOMO is low (calm accumulation) and pause when FOMO is high (euphoria risk).

---

*This document is a living specification. Update it as the product evolves.*
