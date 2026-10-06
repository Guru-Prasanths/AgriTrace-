const pool = require("../config/db");

async function listReadingsByLotId(lotId) {
  const { rows } = await pool.query(
    `SELECT sr.id, sr.produce_record_id, sr.recorded_at, sr.temperature_c,
            sr.humidity_pct, sr.spoilage_risk_pct, sr.source_device, sr.blockchain_tx_hash,
            pr.lot_id, pr.crop_name
     FROM sensor_readings sr
     JOIN produce_records pr ON pr.id = sr.produce_record_id
     WHERE pr.lot_id = $1 OR pr.id::text = $1
     ORDER BY sr.recorded_at DESC`,
    [lotId]
  );
  return rows;
}

async function listReadingsByRecordId(recordId) {
  const { rows } = await pool.query(
    `SELECT * FROM sensor_readings WHERE produce_record_id = $1 ORDER BY recorded_at DESC`,
    [recordId]
  );
  return rows;
}

async function createSensorReading(data) {
  const { rows } = await pool.query(
    `INSERT INTO sensor_readings
      (produce_record_id, temperature_c, humidity_pct, spoilage_risk_pct, source_device, blockchain_tx_hash)
     VALUES
      ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.produceRecordId,
      data.temperatureC,
      data.humidityPct,
      data.spoilageRiskPct,
      data.sourceDevice || "manual-entry",
      data.blockchainTxHash || null
    ]
  );
  return rows[0];
}

async function getLatestReading(lotId) {
  const { rows } = await pool.query(
    `SELECT sr.*
     FROM sensor_readings sr
     JOIN produce_records pr ON pr.id = sr.produce_record_id
     WHERE pr.lot_id = $1 OR pr.id::text = $1
     ORDER BY sr.recorded_at DESC
     LIMIT 1`,
    [lotId]
  );
  return rows[0] || null;
}

module.exports = {
  listReadingsByLotId,
  listReadingsByRecordId,
  createSensorReading,
  getLatestReading
};
