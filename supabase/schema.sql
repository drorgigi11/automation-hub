-- ================================
-- Automation Hub - Supabase Schema
-- ================================

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source          TEXT NOT NULL CHECK (source IN ('facebook', 'elementor', 'lovable')),
  name            TEXT,
  email           TEXT,
  phone           TEXT,
  message         TEXT,
  raw_data        JSONB DEFAULT '{}'::jsonb,
  synced_to_sheets BOOLEAN DEFAULT FALSE,
  sheet_id        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Sheet connections table
CREATE TABLE IF NOT EXISTS sheet_connections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  sheet_id    TEXT NOT NULL,
  sheet_tab   TEXT NOT NULL DEFAULT 'Sheet1',
  sources     TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads(source);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_synced_idx ON leads(synced_to_sheets);

-- Hard guarantee against duplicate Facebook leads even under race conditions
-- (webhook + cron firing simultaneously, retries, etc.). Code-level dedup
-- has a SELECT-then-INSERT window; this index closes it at the DB level.
CREATE UNIQUE INDEX IF NOT EXISTS leads_facebook_leadgen_id_unique
  ON leads ((raw_data->>'leadgen_id'))
  WHERE source = 'facebook' AND raw_data->>'leadgen_id' IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_connections ENABLE ROW LEVEL SECURITY;

-- Allow public read on leads (for dashboard)
CREATE POLICY "Allow public read leads"
  ON leads FOR SELECT
  USING (true);

-- Allow service role full access (for webhooks)
-- (service role bypasses RLS by default — no policy needed)

-- Allow public read on connections (for dashboard)
CREATE POLICY "Allow public read connections"
  ON sheet_connections FOR SELECT
  USING (true);

-- Enable Realtime for leads
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

