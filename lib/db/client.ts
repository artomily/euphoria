// ─── Neon Postgres client ─────────────────────────────────────────────────────
// Serverless HTTP driver — one-shot queries over fetch, ideal for Vercel
// functions (no pooling/socket to manage, fits the project's serverless-first,
// "No Redis / no standing workers" rules). Use the tagged-template `sql` for
// parameterized, injection-safe queries: sql`select ... where x = ${value}`.

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

/** Lazily create (and reuse) the Neon query function. Throws only when actually used without DATABASE_URL. */
export function getSql(): NeonQueryFunction<false, false> {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Missing required env var: DATABASE_URL");
    cached = neon(url);
  }
  return cached;
}

/** True when a database connection is configured. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
