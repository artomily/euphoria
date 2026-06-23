-- Euphoria schema — Neon Postgres.
-- Persists completed analyses, scoped to the SIWE wallet that requested them
-- (null = anonymous). result_json holds the full AnalysisResult for replay.

create table if not exists analyses (
  id             uuid primary key default gen_random_uuid(),
  wallet_address text,
  symbol         text        not null,
  decision       text        not null,
  fomo_score     integer     not null,
  confidence     integer     not null,
  narrative      text        not null,
  result_json    jsonb       not null,
  created_at     timestamptz not null default now()
);

create index if not exists analyses_wallet_created_idx
  on analyses (wallet_address, created_at desc);
