-- =========================================================
-- AgriTrace Google Authentication Database Migration
-- Supports Sign in with Google (OAuth 2.0 / OpenID Connect)
-- Adds google_sub, auth_provider, picture_url, and unique index
-- Makes password_hash nullable for pure Google accounts
-- =========================================================

-- 1. Allow password_hash to be nullable for accounts created purely via Google OAuth
DO $$
BEGIN
  ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
EXCEPTION
  WHEN undefined_column THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

-- 2. Add google_sub column (Google subject identifier)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'google_sub'
  ) THEN
    ALTER TABLE users ADD COLUMN google_sub VARCHAR(255);
  END IF;
END $$;

-- 3. Add auth_provider column ('local', 'google', 'both')
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'auth_provider'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) NOT NULL DEFAULT 'local';
  END IF;
END $$;

-- 4. Add picture_url column for verified Google profile avatar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'picture_url'
  ) THEN
    ALTER TABLE users ADD COLUMN picture_url TEXT;
  END IF;
END $$;

-- 5. Create unique index on google_sub (ignoring nulls)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL;

-- 6. Create index on auth_provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

