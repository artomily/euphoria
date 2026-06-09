import type { Decision, NarrativeCategory } from "./agents";

export interface UserRow {
  id: string;
  privy_user_id: string;
  wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisRow {
  id: string;
  user_id: string | null;
  symbol: string;
  decision: Decision;
  fomo_score: number;
  confidence: number;
  narrative: NarrativeCategory;
  result_json: unknown;
  created_at: string;
}

export interface NarrativeRow {
  id: string;
  name: NarrativeCategory;
  heat_score: number;
  top_tokens: string[];
  updated_at: string;
}

export interface AgentLogRow {
  id: string;
  analysis_id: string;
  agent_name: string;
  input_json: unknown;
  output_json: unknown;
  duration_ms: number;
  success: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: { Row: UserRow };
      analyses: { Row: AnalysisRow };
      narratives: { Row: NarrativeRow };
      agent_logs: { Row: AgentLogRow };
    };
  };
}
