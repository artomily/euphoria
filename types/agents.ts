export interface ScoutInput {
  symbol: string;
}

export interface ScoutOutput {
  symbol: string;
  name: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  volume_score: number;
  momentum_score: number;
  data_source: "cmc" | "dexscreener" | "mock";
}

export interface NarrativeInput {
  scout: ScoutOutput;
}

export type NarrativeCategory =
  | "AI"
  | "Memecoin"
  | "RWA"
  | "DePIN"
  | "Gaming"
  | "DeFi"
  | "Layer1"
  | "Layer2"
  | "Unknown";

export interface NarrativeOutput {
  narrative: NarrativeCategory;
  confidence: number;
  explanation: string;
  key_catalysts: string[];
}

export interface CrowdInput {
  scout: ScoutOutput;
  narrative: NarrativeOutput;
}

export type FomoLevel = "calm" | "interest" | "bullish" | "fomo" | "euphoria";

export interface CrowdOutput {
  fomo_score: number;
  fomo_level: FomoLevel;
  sentiment_drivers: string[];
  social_signals: string;
  crowd_narrative: string;
}

export interface ReverseInput {
  scout: ScoutOutput;
  narrative: NarrativeOutput;
}

export type BubbleRisk = "low" | "medium" | "high" | "extreme";

export interface ReverseOutput {
  bubble_probability: number;
  bubble_risk: BubbleRisk;
  red_flags: string[];
  contrarian_argument: string;
  historical_parallel?: string;
}

export interface JudgeInput {
  scout: ScoutOutput;
  narrative: NarrativeOutput;
  crowd: CrowdOutput;
  reverse: ReverseOutput;
}

export type Decision = "BUY" | "SELL" | "WATCH";

export interface JudgeOutput {
  decision: Decision;
  confidence: number;
  reasoning: string;
  bull_case: string;
  bear_case: string;
  key_insight: string;
  time_horizon: string;
}

export interface AnalysisResult {
  symbol: string;
  scout: ScoutOutput;
  narrative: NarrativeOutput;
  crowd: CrowdOutput;
  reverse: ReverseOutput;
  judge: JudgeOutput;
  duration_ms: number;
  cached: boolean;
}
