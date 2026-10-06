-- Optional OFF-CHAIN demo records for testing the dashboard.
-- These rows intentionally have no fake transaction hashes.
-- After contract deployment, use the frontend to create real on-chain anchors.

INSERT INTO produce_records
(lot_id, crop_name, origin, harvest_date, quality_grade, storage_temperature_c, storage_humidity_pct, farmer_price, consumer_price)
VALUES
('DEMO-AGR-0001', 'Mango', 'Salem, Tamil Nadu, India', NOW() - INTERVAL '3 days', 'A+', 7.2, 71.0, 30.00, 52.00),
('DEMO-AGR-0002', 'Tomato', 'Hosur, Tamil Nadu, India', NOW() - INTERVAL '2 days', 'A', 11.0, 78.0, 19.00, 36.00),
('DEMO-AGR-0003', 'Chilli', 'Guntur, Andhra Pradesh, India', NOW() - INTERVAL '1 day', 'A+', 8.0, 69.0, 28.00, 51.00)
ON CONFLICT (lot_id) DO NOTHING;

INSERT INTO price_snapshots (produce_record_id, farmer_price, trader_price, market_price, consumer_price)
SELECT id, farmer_price, farmer_price * 1.18, farmer_price * 1.35, consumer_price
FROM produce_records
WHERE lot_id LIKE 'DEMO-%'
  AND NOT EXISTS (SELECT 1 FROM price_snapshots p WHERE p.produce_record_id = produce_records.id);

INSERT INTO sensor_readings (produce_record_id, temperature_c, humidity_pct, spoilage_risk_pct, source_device)
SELECT id, storage_temperature_c, storage_humidity_pct, 8.5, 'demo-sensor-01'
FROM produce_records
WHERE lot_id LIKE 'DEMO-%'
  AND NOT EXISTS (SELECT 1 FROM sensor_readings s WHERE s.produce_record_id = produce_records.id);
