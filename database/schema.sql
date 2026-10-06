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

-- ON-CHAIN: lot identity, crop/origin anchor, harvest timestamp, metadata hash,
-- verification state, price snapshots, sensor reading anchors.
-- OFF-CHAIN: application UUIDs, richer metadata, operational sensor streams,
-- analytics, and large files/documents.
