-- =============================================================================
-- AgriTrace: Official Tamil Nadu Agriculture Datasets & Market Price Schema
-- Migration: migration_tn_crops.sql
-- Covers: TNAU Agritech, AGMARKNET, TN Agrisnet, and TANHODA Official Datasets
-- =============================================================================

CREATE TABLE IF NOT EXISTS tn_crops (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    name_en VARCHAR(128) NOT NULL,
    name_ta VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    scientific_name VARCHAR(128) NOT NULL,
    released_varieties TEXT NOT NULL,
    short_description TEXT NOT NULL,
    primary_regions TEXT NOT NULL,
    icon VARCHAR(16) NOT NULL,
    image_url VARCHAR(255),
    source_name VARCHAR(128) NOT NULL,
    source_url VARCHAR(512) NOT NULL,
    verified_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tn_crop_seasonal_info (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES tn_crops(id) ON DELETE CASCADE,
    sowing_seasons TEXT NOT NULL,
    harvest_seasons TEXT NOT NULL,
    duration_days_min INTEGER NOT NULL,
    duration_days_max INTEGER NOT NULL,
    district_variations TEXT,
    irrigation_type VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tn_crop_care_storage (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES tn_crops(id) ON DELETE CASCADE,
    ambient_shelf_life VARCHAR(64) NOT NULL,
    cold_storage_shelf_life VARCHAR(64) NOT NULL,
    optimal_temp_c VARCHAR(32) NOT NULL,
    optimal_humidity_rh VARCHAR(32) NOT NULL,
    spoilage_factors TEXT NOT NULL,
    deterioration_signs TEXT NOT NULL,
    pests_diseases TEXT NOT NULL,
    protection_measures TEXT NOT NULL,
    maturity_indicators TEXT NOT NULL,
    harvest_precautions TEXT NOT NULL,
    grading_standards TEXT NOT NULL,
    packaging_transit TEXT NOT NULL,
    processing_possibilities TEXT NOT NULL,
    waste_reduction_tips TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tn_market_price_observations (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES tn_crops(id) ON DELETE CASCADE,
    mandi_name VARCHAR(128) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) DEFAULT 'Tamil Nadu',
    modal_price_quintal NUMERIC(10, 2) NOT NULL,
    min_price_quintal NUMERIC(10, 2) NOT NULL,
    max_price_quintal NUMERIC(10, 2) NOT NULL,
    price_per_kg NUMERIC(10, 2) GENERATED ALWAYS AS (modal_price_quintal / 100.0) STORED,
    observation_date DATE NOT NULL,
    source_authority VARCHAR(128) DEFAULT 'AGMARKNET / TN Agricultural Marketing Board',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tn_government_dataset_sources (
    id SERIAL PRIMARY KEY,
    source_code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    authority VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    official_url VARCHAR(512) NOT NULL,
    update_frequency VARCHAR(64) NOT NULL,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tn_source_update_history (
    id SERIAL PRIMARY KEY,
    source_code VARCHAR(32) NOT NULL,
    records_updated INTEGER DEFAULT 0,
    sync_status VARCHAR(32) DEFAULT 'SUCCESS',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid querying & search
CREATE INDEX IF NOT EXISTS idx_tn_crops_slug ON tn_crops(slug);
CREATE INDEX IF NOT EXISTS idx_tn_crops_category ON tn_crops(category);
CREATE INDEX IF NOT EXISTS idx_tn_mpo_crop_id ON tn_market_price_observations(crop_id);
CREATE INDEX IF NOT EXISTS idx_tn_mpo_obs_date ON tn_market_price_observations(observation_date DESC);

