 CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS produce_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id VARCHAR(80) NOT NULL UNIQUE,
  crop_name VARCHAR(120) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  harvest_date TIMESTAMPTZ NOT NULL,
  quality_grade VARCHAR(30),
  storage_temperature_c NUMERIC(6,2),
  storage_humidity_pct NUMERIC(5,2),
  farmer_price NUMERIC(14,2),
  consumer_price NUMERIC(14,2),
  metadata_hash VARCHAR(66),
  blockchain_key VARCHAR(66),
  blockchain_tx_hash VARCHAR(66),
  blockchain_network VARCHAR(40) NOT NULL DEFAULT 'sepolia',
  blockchain_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  produce_record_id UUID NOT NULL REFERENCES produce_records(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  temperature_c NUMERIC(6,2) NOT NULL,
  humidity_pct NUMERIC(5,2) NOT NULL CHECK (humidity_pct BETWEEN 0 AND 100),
  spoilage_risk_pct NUMERIC(5,2) NOT NULL CHECK (spoilage_risk_pct BETWEEN 0 AND 100),
  source_device VARCHAR(120),
  blockchain_tx_hash VARCHAR(66)
);

CREATE TABLE IF NOT EXISTS price_snapshots (
  id BIGSERIAL PRIMARY KEY,
  produce_record_id UUID NOT NULL REFERENCES produce_records(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  farmer_price NUMERIC(14,2) NOT NULL CHECK (farmer_price >= 0),
  trader_price NUMERIC(14,2) NOT NULL CHECK (trader_price >= 0),
  market_price NUMERIC(14,2) NOT NULL CHECK (market_price >= 0),
  consumer_price NUMERIC(14,2) NOT NULL CHECK (consumer_price >= 0),
  blockchain_tx_hash VARCHAR(66)
);

CREATE INDEX IF NOT EXISTS idx_produce_records_lot_id ON produce_records(lot_id);
CREATE INDEX IF NOT EXISTS idx_produce_records_created_at ON produce_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_recorded_at ON sensor_readings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_record ON sensor_readings(produce_record_id);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_recorded_at ON price_snapshots(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_record ON price_snapshots(produce_record_id);

-- ---------------------------------------------------------
-- AUTH & REWARDS TABLES
-- ---------------------------------------------------------

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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_normalized_email ON users(LOWER(TRIM(email)));

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

CREATE TABLE IF NOT EXISTS reward_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(80) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target VARCHAR(100),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at DESC);

-- ON-CHAIN: lot identity, crop/origin anchor, harvest timestamp, metadata hash,
-- verification state, price snapshots, sensor reading anchors.
-- OFF-CHAIN: application UUIDs, richer metadata, operational sensor streams,
-- analytics, and large files/documents.
