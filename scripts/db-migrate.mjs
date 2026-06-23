// Run SQL migrations in db/migrations against DATABASE_URL.
// Usage: node --env-file=.env scripts/db-migrate.mjs
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL. Run with: node --env-file=.env scripts/db-migrate.mjs");
  process.exit(1);
}

const sql = neon(url);
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
  const raw = readFileSync(join(dir, file), "utf8");
  // The HTTP driver runs one statement per request — split on semicolons.
  const statements = raw
    .split(";")
    .map((s) => s.replace(/--.*$/gm, "").trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log(`✓ applied ${file}`);
}
console.log("Migrations complete.");
