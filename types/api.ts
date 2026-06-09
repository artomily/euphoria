import type { AnalysisResult, NarrativeCategory } from "./agents";

export interface AnalyzeRequest {
  symbol: string;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
}

export interface AnalyzeErrorResponse {
  error: string;
  details?: unknown;
}

export interface NarrativeRow {
  id: string;
  name: NarrativeCategory;
  heat_score: number;
  top_tokens: string[];
  updated_at: string;
}

export interface FomoIndexResponse {
  fomo_index: number;
  narratives: NarrativeRow[];
  updated_at: string;
}

export interface NarrativesResponse {
  narratives: NarrativeRow[];
}
