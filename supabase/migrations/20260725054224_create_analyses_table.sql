/*
# Create analyses table for saved numerology readings

1. New Tables
- `analyses`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to the authenticated user, references auth.users with cascade delete)
  - `mobile` (text, not null) — the mobile number analyzed
  - `dob` (date, nullable) — optional date of birth used for root number check
  - `mobile_total` (integer, not null) — reduced mobile total
  - `result` (jsonb, not null) — full structured analysis output
  - `label` (text, nullable) — optional user-given name for the reading
  - `created_at` (timestamptz, defaults to now)
2. Security
- Enable RLS on `analyses`.
- Owner-scoped CRUD: each authenticated user can only access rows they own.
3. Indexes
- Index on `user_id` for fast per-user listing.
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  mobile text NOT NULL,
  dob date,
  mobile_total integer NOT NULL,
  result jsonb NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_analyses" ON analyses;
CREATE POLICY "select_own_analyses" ON analyses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_analyses" ON analyses;
CREATE POLICY "insert_own_analyses" ON analyses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_analyses" ON analyses;
CREATE POLICY "update_own_analyses" ON analyses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_analyses" ON analyses;
CREATE POLICY "delete_own_analyses" ON analyses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses (user_id);
