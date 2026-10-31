-- =========================================================
-- AgriTrace Auth & Rewards Database Migration
-- Role-based authentication, orders, points transactions,
-- reward settings, and daily scheduler logs
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(30) NOT NULL CHECK (role IN ('farmer', 'seller', 'admin')),
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token VARCHAR(120),
  points_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (points_balance >= 0),
  total_points_earned NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (total_points_earned >= 0),
  phone VARCHAR(50),
  location VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce normalized unique email constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_normalized_email ON users(LOWER(TRIM(email)));
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_users_email'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
  END IF;
END $$;

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  produce_record_id VARCHAR(80),
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  crop_name VARCHAR(120) NOT NULL,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price > 0),
  total_price NUMERIC(14,2) NOT NULL CHECK (total_price > 0),
  status VARCHAR(30) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'in_progress', 'completed', 'cancelled', 'rejected', 'reversed')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 3. POINTS TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points NUMERIC(14,2) NOT NULL,
  transaction_type VARCHAR(40) NOT NULL CHECK (transaction_type IN ('order_completion', 'daily_reward', 'order_reversal', 'admin_adjustment')),
  reason TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reference_id VARCHAR(160) NOT NULL UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_points_tx_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_tx_type ON points_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_points_tx_created_at ON points_transactions(created_at DESC);

-- 4. REWARD SETTINGS TABLE
CREATE TABLE IF NOT EXISTS reward_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(80) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial reward settings
INSERT INTO reward_settings (setting_key, setting_value, description)
VALUES
  ('farmer_daily_points', '10', 'Daily reward points awarded to eligible farmers every 24 hours'),
  ('seller_daily_points', '15', 'Daily reward points awarded to eligible sellers every 24 hours'),
  ('farmer_order_completion_points', '50', 'Points awarded to farmer when an order is completed'),
  ('seller_order_completion_points', '50', 'Points awarded to seller when an order is completed'),
  ('daily_rewards_farmer_enabled', 'true', 'Whether 24h daily rewards for farmers are active'),
  ('daily_rewards_seller_enabled', 'true', 'Whether 24h daily rewards for sellers are active'),
  ('order_completion_rewards_enabled', 'true', 'Whether completion rewards for orders are active'),
  ('daily_reward_schedule_cron', '0 0 * * *', 'Cron schedule for automatic 24h daily rewards run (midnight UTC)'),
  ('daily_reward_timezone', 'UTC', 'Timezone for daily reward schedule'),
  ('daily_reward_require_verified', 'false', 'Require account email verification before daily rewards are awarded'),
  ('daily_reward_require_active', 'true', 'Require active account status before daily rewards are awarded')
ON CONFLICT (setting_key) DO NOTHING;

-- 5. DAILY REWARD LOGS TABLE
CREATE TABLE IF NOT EXISTS daily_reward_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date VARCHAR(20) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('awarded', 'skipped', 'failed')),
  points_awarded NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  reason TEXT,
  reference_id VARCHAR(160) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_reward_logs_date ON daily_reward_logs(run_date);
CREATE INDEX IF NOT EXISTS idx_daily_reward_logs_user ON daily_reward_logs(user_id);

-- 6. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target VARCHAR(100),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at DESC);

