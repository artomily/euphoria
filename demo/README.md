# Euphoria — Demo Video Assets

Demo video for **BNB Hack: AI Trading Agent Edition** (Track 2 — Strategy Skills).

## Files
- **`euphoria-demo.mp4`** — 1920×1080, ~62s, H.264 + AAC. The deliverable.
- `euphoria-demo.srt` — captions (upload these; most social video is watched muted).
- `landing.png`, `token_crop.png`, `bt_btc.png`, `bt_cake.png` — source frames (real app, production build, live data).

## Voiceover
Generated locally with macOS `say`, voice **Samantha** (en_US, female). No cloud TTS.

## Animation
- Per-scene Ken-Burns slow zoom.
- Analysis scene: a downward **pan that reveals the Judge verdict**.
- **Crossfade (xfade) transitions** between every scene + global fade in/out.

## Storyboard (Hook → Live Agents → Proof → CTA)
1. **Landing (0–12s)** — "Traders don't lose on bad charts — they lose buying euphoria, selling fear."
2. **Live multi-agent analysis (12–29s)** — $CAKE: Scout → Narrative (DeFi 92%) → Crowd (FOMO) ∥ Reverse (bubble risk) → Judge verdict (WATCH), every signal sourced. *Real LLM output via the live pipeline.*
3. **Backtest · BTC (29–44s)** — the deterministic, backtestable strategy beats buy & hold with a fraction of the drawdown.
4. **Backtest · CAKE (44–53s)** — edge holds across the BNB ecosystem; capital preserved.
5. **CTA (53–62s)** — pure, tested, CMC-powered. "Trade market emotions, not charts."

## Regenerate
1. `npm run build && PORT=3100 npm start`
2. Capture frames with headless Chrome, `--force-prefers-reduced-motion` (so count-up numbers render final), `--window-size=1920,1080` (backtest/landing) or `1920,2700` + crop (token analysis).
3. `say -v Samantha -o vN.aiff "..."` per scene.
4. Per scene → `ffmpeg` clip (zoompan / crop-pan); merge pairwise with `xfade`+`acrossfade`; global fade.

---

## Suggested post copy

**DoraHacks / submission blurb**
> Euphoria turns market *psychology* into a backtestable strategy for BNB Chain. Five AI agents score FOMO, narrative, and bubble risk into a BUY/SELL/WATCH verdict — then the same thesis, as a deterministic strategy, beats buy & hold with far lower drawdown. Track 2 — Strategy Skills. Powered by CoinMarketCap.

**Twitter/X**
> Most traders lose money buying euphoria and selling fear.
> @euphoria reads market *psychology* on BNB Chain — 5 agents → a verdict — then proves it as a backtestable strategy that beats buy & hold with a fraction of the drawdown.
> Powered by @CoinMarketCap. #BNBHack

**YouTube description**
> Euphoria is an AI market-psychology platform for BNB Chain. Five agents (Scout, Narrative, Crowd, Reverse, Judge) score crowd FOMO, narrative, and bubble risk into a BUY/SELL/WATCH verdict with full reasoning — every signal traced to its source. The same thesis ships as a pure, unit-tested, backtestable strategy that preserves capital through drawdowns where buy & hold bleeds out. Built for BNB Hack: AI Trading Agent Edition (Track 2 — Strategy Skills). Powered by CoinMarketCap.
> ⚠️ Research signals, not financial advice.
