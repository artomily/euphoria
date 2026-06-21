// POST /api/analyze — run the full agent pipeline for a token symbol.

import { z, ZodError } from "zod";
import { orchestrate } from "@/lib/agents/orchestrator";
import type { AnalyzeResponse, AnalyzeErrorResponse } from "@/types/api";

// The Judge uses the Pro tier; give the pipeline room beyond the default.
export const maxDuration = 60;

const analyzeSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1)
    .max(15)
    .regex(/^[a-zA-Z0-9]+$/, "Symbol must be alphanumeric"),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { symbol } = analyzeSchema.parse(body);

    const result = await orchestrate(symbol);
    return Response.json({ result } satisfies AnalyzeResponse);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: "Invalid input", details: error.issues } satisfies AnalyzeErrorResponse,
        { status: 400 },
      );
    }
    console.error("[api/analyze] failed:", error);
    return Response.json(
      { error: "Analysis failed" } satisfies AnalyzeErrorResponse,
      { status: 500 },
    );
  }
}
