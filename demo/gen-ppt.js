const pptxgen = require("pptxgenjs");
const path = require("path");

const DEMO = path.resolve(__dirname);

// ─── Platform design system (from app/globals.css) ─────────────────────────
const C = {
  app:      "F5F6FA", // --bg-app (cool light gray)
  surface:  "FFFFFF", // --bg-surface (white cards)
  border:   "E6E7EE", // ~ border rgba(0,0,0,0.07) solidified
  ink:      "0D0D1A", // --text-primary
  sec:      "6B6B85", // --text-secondary
  muted:    "A0A0B8", // --text-muted
  blue:     "3B82F6", // --accent-blue (primary)
  purple:   "8B5CF6", // --accent-purple
  emerald:  "10B981", // --accent-emerald / signal-buy
  cyan:     "06B6D4", // --accent-cyan
  red:      "EF4444", // signal-sell / reverse
  amber:    "F59E0B", // signal-watch
  orange:   "F97316", // agent-scout
  // orb gradient
  orb1:     "93C5FD",
  orb2:     "A5B4FC",
  orb3:     "C4B5FD",
};

// agent avatar colors (architecture)
const AGENT = { scout: C.orange, narrative: C.purple, crowd: C.blue, reverse: C.red, judge: C.emerald };

const SANS = "Helvetica Neue"; // clean UI sans (Geist-like)
const MONO = "Menlo";          // numbers / tickers (Geist Mono-like)

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "artomily";
pres.title  = "Euphoria — Trade Market Emotions, Not Charts";

const W = 10, H = 5.625, M = 0.65;
const shadow = () => ({ type: "outer", color: "1A1A2E", blur: 9, offset: 2, angle: 135, opacity: 0.08 });

function slide(bg) {
  const s = pres.addSlide();
  s.background = { color: bg || C.app };
  return s;
}

// soft pastel orb (two translucent overlapping ovals → fake gradient)
function orb(s, x, y, size) {
  s.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: C.orb1, transparency: 60 }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: x + size * 0.28, y: y + size * 0.18, w: size * 0.85, h: size * 0.85, fill: { color: C.orb3, transparency: 58 }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: x + size * 0.12, y: y + size * 0.4, w: size * 0.7, h: size * 0.7, fill: { color: C.orb2, transparency: 62 }, line: { type: "none" } });
}

function sectionLabel(s, text, x, y, color) {
  s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.04, w: 0.11, h: 0.11, fill: { color: color || C.blue }, line: { type: "none" } });
  s.addText(text, { x: x + 0.22, y, w: 7, h: 0.25, fontFace: MONO, fontSize: 10, bold: true, charSpacing: 2, color: C.sec, margin: 0 });
}

// ═══════════════════════════════════════════════════════════════════════
// 1 — TITLE
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  orb(s, 6.6, -1.6, 5.4);

  sectionLabel(s, "BNB HACK  ·  TRACK 2 — STRATEGY SKILLS", M, 0.6);

  s.addText("Euphoria", { x: M - 0.04, y: 1.45, w: 8.5, h: 1.4, fontFace: SANS, fontSize: 90, bold: true, color: C.ink, margin: 0 });
  s.addText("Trade market emotions, not charts.", { x: M, y: 2.95, w: 8.5, h: 0.6, fontFace: SANS, fontSize: 26, bold: true, color: C.blue, margin: 0 });
  s.addText(
    "An AI market-psychology engine that turns crowd FOMO, narrative, and bubble-risk into a deterministic, backtestable trading strategy on BNB Chain.",
    { x: M, y: 3.75, w: 7.4, h: 0.9, fontFace: SANS, fontSize: 13, color: C.sec, lineSpacingMultiple: 1.3, margin: 0 }
  );

  s.addShape(pres.shapes.LINE, { x: M, y: 5.0, w: W - 2 * M, h: 0, line: { color: C.border, width: 1 } });
  s.addText("Sponsor capability — CoinMarketCap", { x: M, y: 5.12, w: 5, h: 0.3, fontFace: SANS, fontSize: 10, color: C.sec, margin: 0 });
  s.addText("github.com/artomily/euphoria", { x: W - M - 4, y: 5.12, w: 4, h: 0.3, fontFace: MONO, fontSize: 10, color: C.sec, align: "right", margin: 0 });
}

// ═══════════════════════════════════════════════════════════════════════
// 2 — PROBLEM
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  sectionLabel(s, "01 — PROBLEM", M, 0.6);

  s.addText([
    { text: "Traders have every chart.", options: { breakLine: true, color: C.ink } },
    { text: "They’re still losing.", options: { color: C.blue } },
  ], { x: M - 0.03, y: 1.15, w: 4.4, h: 2.0, fontFace: SANS, fontSize: 33, bold: true, lineSpacingMultiple: 1.08, margin: 0 });

  s.addText("Every tool measures price. None measures the emotion driving it.", {
    x: M, y: 3.65, w: 4.0, h: 1.1, fontFace: SANS, fontSize: 13, italic: true, color: C.sec, lineSpacingMultiple: 1.3, margin: 0,
  });

  const pts = [
    { c: C.red,     t: "They buy euphoria", b: "Crowd excitement peaks, retail piles in at the top — then price collapses." },
    { c: C.amber,   t: "They sell fear",    b: "Panic at the bottom shakes them out, right before the recovery they miss." },
    { c: C.blue,    t: "No instrument",     b: "RSI, MACD, candlesticks — none quantify when the crowd is over-extended." },
  ];
  const rx = 5.55, rw = W - M - rx;
  pts.forEach((p, i) => {
    const y = 1.2 + i * 1.32;
    if (i > 0) s.addShape(pres.shapes.LINE, { x: rx, y: y - 0.18, w: rw, h: 0, line: { color: C.border, width: 1 } });
    s.addText(String(i + 1).padStart(2, "0"), { x: rx, y, w: 0.6, h: 0.5, fontFace: MONO, fontSize: 20, bold: true, color: p.c, margin: 0 });
    s.addText(p.t, { x: rx + 0.7, y: y - 0.02, w: rw - 0.7, h: 0.35, fontFace: SANS, fontSize: 15, bold: true, color: C.ink, margin: 0 });
    s.addText(p.b, { x: rx + 0.7, y: y + 0.36, w: rw - 0.7, h: 0.7, fontFace: SANS, fontSize: 11.5, color: C.sec, lineSpacingMultiple: 1.25, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 3 — SOLUTION
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  sectionLabel(s, "02 — SOLUTION", M, 0.6);

  s.addText("A market-psychology engine for BNB Chain.", {
    x: M - 0.03, y: 1.0, w: W - 2 * M, h: 0.7, fontFace: SANS, fontSize: 30, bold: true, color: C.ink, margin: 0,
  });

  const pillars = [
    { c: C.blue,   tag: "LIVE AI PIPELINE", title: "Five agents debate, one judge decides", body: "Scout reads the market. Narrative explains the move. Crowd scores the FOMO. Reverse hunts the bubble. Judge returns BUY / SELL / WATCH — with reasoning, never a black box." },
    { c: C.purple, tag: "STRATEGY SKILL",   title: "Deterministic & backtestable", body: "The same thesis as a pure, reproducible rule set — shipped as euphoria-strategy, a zero-dependency npm package. Same candles in, same signals out. Unit-tested." },
  ];
  const cw = (W - 2 * M - 0.5) / 2;
  pillars.forEach((p, i) => {
    const x = M + i * (cw + 0.5), y = 2.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 2.95, fill: { color: C.surface }, line: { color: C.border, width: 1 }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.3, y: y + 0.32, w: 0.45, h: 0.06, fill: { color: p.c }, line: { type: "none" } });
    s.addText(p.tag, { x: x + 0.3, y: y + 0.5, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 10, bold: true, charSpacing: 1, color: p.c, margin: 0 });
    s.addText(p.title, { x: x + 0.3, y: y + 0.85, w: cw - 0.6, h: 0.75, fontFace: SANS, fontSize: 19, bold: true, color: C.ink, lineSpacingMultiple: 1.05, margin: 0 });
    s.addText(p.body, { x: x + 0.3, y: y + 1.65, w: cw - 0.6, h: 1.1, fontFace: SANS, fontSize: 12, color: C.sec, lineSpacingMultiple: 1.3, margin: 0 });
  });

  s.addText("Ride healthy momentum — step aside to cash the moment the crowd turns euphoric or fearful.", {
    x: M, y: 5.15, w: W - 2 * M, h: 0.35, fontFace: SANS, italic: true, fontSize: 12.5, color: C.ink, align: "center", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 4 — ARCHITECTURE (per-agent platform colors)
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  sectionLabel(s, "03 — ARCHITECTURE", M, 0.6);

  s.addText("One request → full debate + verdict", {
    x: M - 0.03, y: 1.0, w: W - 2 * M, h: 0.6, fontFace: SANS, fontSize: 26, bold: true, color: C.ink, margin: 0,
  });

  const agents = [
    { name: "Scout",     tier: "heuristic", c: AGENT.scout,     desc: "market data\nmomentum" },
    { name: "Narrative", tier: "pro",        c: AGENT.narrative, desc: "why it moves\ncatalysts" },
    { name: "Crowd",     tier: "flash",      c: AGENT.crowd,     desc: "FOMO score\n0–100" },
    { name: "Reverse",   tier: "flash",      c: AGENT.reverse,   desc: "bubble risk\ncontrarian" },
    { name: "Judge",     tier: "pro",        c: AGENT.judge,     desc: "BUY / SELL\nWATCH" },
  ];
  const bw = 1.6, bh = 1.55, gap = 0.26;
  const total = agents.length * bw + (agents.length - 1) * gap;
  const sx = (W - total) / 2, sy = 1.95;

  agents.forEach((a, i) => {
    const x = sx + i * (bw + gap);
    s.addShape(pres.shapes.RECTANGLE, { x, y: sy, w: bw, h: bh, fill: { color: C.surface }, line: { color: C.border, width: 1 }, shadow: shadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: sy, w: bw, h: 0.07, fill: { color: a.c }, line: { type: "none" } });
    s.addText(a.name, { x, y: sy + 0.2, w: bw, h: 0.35, fontFace: SANS, fontSize: 15, bold: true, color: C.ink, align: "center", margin: 0 });
    s.addText(a.tier, { x, y: sy + 0.56, w: bw, h: 0.24, fontFace: MONO, fontSize: 8.5, bold: true, color: a.c, align: "center", margin: 0 });
    s.addText(a.desc, { x, y: sy + 0.84, w: bw, h: 0.65, fontFace: SANS, fontSize: 10, color: C.sec, align: "center", lineSpacingMultiple: 1.1, margin: 0 });
    if (i < agents.length - 1) s.addText("→", { x: x + bw, y: sy + bh / 2 - 0.18, w: gap, h: 0.36, fontFace: SANS, fontSize: 14, color: C.muted, align: "center", valign: "middle", margin: 0 });
  });

  s.addText("Crowd ∥ Reverse run in parallel — two independent verdicts, shown as a debate", {
    x: sx + 2 * (bw + gap), y: sy + bh + 0.12, w: 2 * bw + gap, h: 0.3, fontFace: SANS, italic: true, fontSize: 9, color: C.sec, align: "center", margin: 0,
  });

  const stack = [
    ["Frontend", "Next.js 16 · TypeScript strict · Vercel serverless"],
    ["Data",     "CoinMarketCap (sponsor) · DexScreener · Binance klines"],
    ["LLM",      "OpenAI-compatible gateway · Gemini 2.5 Pro / Flash · Zod-validated"],
    ["Strategy", "euphoria-strategy · zero-dependency npm · unit-tested (Vitest)"],
  ];
  stack.forEach((row, i) => {
    const y = 4.15 + i * 0.34;
    s.addText(row[0], { x: M, y, w: 1.3, h: 0.28, fontFace: SANS, fontSize: 9.5, bold: true, color: C.blue, margin: 0 });
    s.addText(row[1], { x: M + 1.35, y, w: W - 2 * M - 1.35, h: 0.28, fontFace: SANS, fontSize: 9.5, color: C.sec, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 5 — BACKTEST (native chart)
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  sectionLabel(s, "04 — DOES IT WORK?", M, 0.6, C.emerald);

  s.addText("Beats buy & hold with 2–4× smaller drawdowns", {
    x: M - 0.03, y: 1.0, w: W - 2 * M, h: 0.6, fontFace: SANS, fontSize: 26, bold: true, color: C.ink, margin: 0,
  });

  const labels = ["BTC", "ETH", "SOL", "CAKE", "BNB"];
  s.addChart(pres.charts.BAR, [
    { name: "Euphoria strategy", labels, values: [6, 2, 2, -11, -16] },
    { name: "Buy & hold",        labels, values: [-32, -47, -49, -33, -38] },
  ], {
    x: M, y: 1.75, w: 5.7, h: 3.1, barDir: "col",
    chartColors: [C.emerald, C.muted],
    chartArea: { fill: { color: C.app } }, plotArea: { fill: { color: C.app } },
    valAxisMinVal: -50, valAxisMaxVal: 10, valAxisMajorUnit: 10,
    valAxisLabelColor: C.sec, valAxisLabelFontFace: MONO, valAxisLabelFontSize: 9,
    catAxisLabelColor: C.ink, catAxisLabelFontFace: MONO, catAxisLabelFontSize: 11,
    valGridLine: { color: C.border, size: 0.5 }, catGridLine: { style: "none" },
    showValue: false,
    showLegend: true, legendPos: "b", legendColor: C.sec, legendFontFace: SANS, legendFontSize: 9,
    barGapWidthPct: 60,
  });

  const rx = 6.7, rw = W - M - rx;
  s.addText("+6%", { x: rx, y: 1.85, w: rw, h: 0.7, fontFace: MONO, fontSize: 46, bold: true, color: C.emerald, margin: 0 });
  s.addText("BTC strategy return vs −32% buy & hold", { x: rx, y: 2.6, w: rw, h: 0.5, fontFace: SANS, fontSize: 11, color: C.sec, lineSpacingMultiple: 1.2, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: rx, y: 3.3, w: rw, h: 0, line: { color: C.border, width: 1 } });
  s.addText("Capital preserved on every BNB-ecosystem asset tested by stepping aside before crashes.", {
    x: rx, y: 3.45, w: rw, h: 1.0, fontFace: SANS, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.3, margin: 0,
  });

  s.addText("Deterministic · unit-tested (Vitest) · reproduce live at /backtest — figures move with daily data.", {
    x: M, y: 5.15, w: W - 2 * M, h: 0.35, fontFace: SANS, italic: true, fontSize: 9, color: C.sec, align: "center", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 6 — INNOVATION (2x2, four platform accents)
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  sectionLabel(s, "05 — INNOVATION", M, 0.6);

  s.addText("Not another GPT-wrapper bot", {
    x: M - 0.03, y: 1.0, w: W - 2 * M, h: 0.6, fontFace: SANS, fontSize: 26, bold: true, color: C.ink, margin: 0,
  });

  const diffs = [
    { n: "01", c: C.blue,    t: "Emotion is the signal", b: "FOMO, narrative & bubble-risk are the strategy — not a footnote on top of RSI." },
    { n: "02", c: C.purple,  t: "A debate, not a prompt", b: "Bull and bear agents argue in parallel; an independent judge synthesizes. Both sides, every call." },
    { n: "03", c: C.emerald, t: "Reproducible by design", b: "LLMs for nuance, but the shipped strategy is pure & replayable. Most AI strategies aren’t. Ours is." },
    { n: "04", c: C.cyan,    t: "Traceable, never breaks", b: "Every score attributed to its source. Zod-validated output. Agents degrade gracefully on failure." },
  ];
  const cw = (W - 2 * M - 0.5) / 2, ch = 1.45;
  diffs.forEach((d, i) => {
    const x = M + (i % 2) * (cw + 0.5);
    const y = 1.95 + Math.floor(i / 2) * (ch + 0.35);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: C.surface }, line: { color: C.border, width: 1 }, shadow: shadow() });
    s.addText(d.n, { x: x + 0.3, y: y + 0.22, w: 1, h: 0.4, fontFace: MONO, fontSize: 22, bold: true, color: d.c, margin: 0 });
    s.addText(d.t, { x: x + 0.95, y: y + 0.24, w: cw - 1.2, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: C.ink, margin: 0 });
    s.addText(d.b, { x: x + 0.95, y: y + 0.64, w: cw - 1.2, h: 0.7, fontFace: SANS, fontSize: 11, color: C.sec, lineSpacingMultiple: 1.25, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 7 — AMBITION (3 columns)
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  sectionLabel(s, "06 — THE AMBITION", M, 0.6);

  s.addText("Market psychology as a first-class data layer for crypto.", {
    x: M - 0.03, y: 1.0, w: W - 2 * M, h: 0.6, fontFace: SANS, fontSize: 24, bold: true, color: C.ink, margin: 0,
  });

  const phases = [
    { p: "NOW",    c: C.emerald, items: ["5-agent live pipeline, real LLM verdicts", "euphoria-strategy npm — unit-tested", "Backtest UI + API on live history", "CoinMarketCap sponsor capability"] },
    { p: "NEXT",   c: C.blue,    items: ["Deeper CMC Agent Hub signals", "Live FOMO Radar across narratives", "Real-time signal streaming", "Watchlists + portfolio emotion"] },
    { p: "FUTURE", c: C.purple,  items: ["Trust Wallet Agent Kit execution", "Social + on-chain behavioral data", "Strategy Skill marketplace", "Institutional psychology API"] },
  ];
  const cw = (W - 2 * M - 0.7) / 3;
  phases.forEach((ph, i) => {
    const x = M + i * (cw + 0.35), y = 1.95;
    s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.32, w: 0.45, h: 0.06, fill: { color: ph.c }, line: { type: "none" } });
    s.addText(ph.p, { x, y: y + 0.48, w: cw, h: 0.35, fontFace: MONO, fontSize: 13, bold: true, charSpacing: 1, color: C.ink, margin: 0 });
    const bl = ph.items.map((t, bi) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, breakLine: bi < ph.items.length - 1, color: C.sec, fontSize: 11, paraSpaceAfter: 8 } }));
    s.addText(bl, { x, y: y + 0.95, w: cw, h: 2.3, fontFace: SANS, lineSpacingMultiple: 1.15, margin: 0 });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 8 — CLOSING
// ═══════════════════════════════════════════════════════════════════════
{
  const s = slide(C.app);
  orb(s, 6.9, 2.4, 5.0);

  s.addText("Euphoria", { x: M - 0.04, y: 1.0, w: 8.5, h: 1.2, fontFace: SANS, fontSize: 74, bold: true, color: C.ink, margin: 0 });
  s.addText("Trade market emotions, not charts.", { x: M, y: 2.25, w: 8.5, h: 0.5, fontFace: SANS, fontSize: 22, bold: true, color: C.blue, margin: 0 });

  const links = [
    ["Live demo",   "euphoria-agent.vercel.app"],
    ["GitHub",      "github.com/artomily/euphoria"],
    ["npm package", "euphoria-strategy"],
    ["Demo video",  "youtu.be/jZCJwJTpH4c"],
  ];
  links.forEach((l, i) => {
    const y = 3.1 + i * 0.48;
    s.addText(l[0], { x: M, y, w: 1.9, h: 0.35, fontFace: SANS, fontSize: 11, bold: true, color: C.sec, margin: 0 });
    s.addText(l[1], { x: M + 2.0, y, w: 6, h: 0.35, fontFace: MONO, fontSize: 11, color: C.ink, margin: 0 });
  });

  s.addShape(pres.shapes.LINE, { x: M, y: 5.05, w: W - 2 * M, h: 0, line: { color: C.border, width: 1 } });
  s.addText("Psychological signals for research & education — not financial advice.", {
    x: M, y: 5.15, w: 6, h: 0.3, fontFace: SANS, italic: true, fontSize: 9, color: C.sec, margin: 0,
  });
  s.addText("BNB Hack · Track 2 · CoinMarketCap", {
    x: W - M - 4, y: 5.15, w: 4, h: 0.3, fontFace: MONO, fontSize: 9, color: C.sec, align: "right", margin: 0,
  });
}

pres.writeFile({ fileName: `${DEMO}/euphoria-dorahacks.pptx` })
  .then(() => console.log("✓ Written: demo/euphoria-dorahacks.pptx (platform colors, links baked in)"))
  .catch(err => { console.error(err); process.exit(1); });
