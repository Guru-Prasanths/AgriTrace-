const pool = require("../config/db");

async function listRecords() {
  const { rows } = await pool.query(`
    SELECT id, lot_id, crop_name, origin, harvest_date, quality_grade,
           storage_temperature_c, storage_humidity_pct, farmer_price,
           consumer_price, metadata_hash, blockchain_key, blockchain_tx_hash,
           blockchain_network, blockchain_verified, created_at, updated_at
    FROM produce_records
    ORDER BY created_at DESC
  `);

  return rows;
}

async function getRecordByLotId(lotId) {
  const { rows } = await pool.query(
    `SELECT * FROM produce_records WHERE lot_id = $1`,
    [lotId]
  );

  return rows[0] || null;
}

async function getRecordById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM produce_records WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
}

async function createRecord(data) {
  const { rows } = await pool.query(
    `INSERT INTO produce_records
      (lot_id, crop_name, origin, harvest_date, quality_grade,
       storage_temperature_c, storage_humidity_pct,
       farmer_price, consumer_price,
       blockchain_key, blockchain_tx_hash,
       blockchain_network, blockchain_verified, metadata_hash)
     VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING *`,
    [
      data.lotId,
      data.cropName,
      data.origin,
      data.harvestDate,
      data.qualityGrade || null,

      data.storageTemperatureC ?? null,
      data.storageHumidityPct ?? null,

      data.farmerPrice ?? null,
      data.consumerPrice ?? null,

      data.blockchainKey || null,
      data.blockchainTxHash || null,

      data.blockchainNetwork || "hardhat-local",
      Boolean(data.blockchainVerified),

      data.metadataHash || null
    ]
  );

  return rows[0];
}

async function updateRecord(id, data) {
  const fields = [];
  const values = [];

  const allowed = {
    qualityGrade: "quality_grade",
    storageTemperatureC: "storage_temperature_c",
    storageHumidityPct: "storage_humidity_pct",
    farmerPrice: "farmer_price",
    consumerPrice: "consumer_price",
    blockchainKey: "blockchain_key",
    blockchainTxHash: "blockchain_tx_hash",
    blockchainNetwork: "blockchain_network",
    blockchainVerified: "blockchain_verified",
    metadataHash: "metadata_hash"
  };

  for (const [key, column] of Object.entries(allowed)) {
    if (data[key] !== undefined) {
      values.push(data[key]);
      fields.push(`${column} = $${values.length}`);
    }
  }

  if (!fields.length) {
    return getRecordById(id);
  }

  values.push(id);

  const { rows } = await pool.query(
    `UPDATE produce_records
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return rows[0] || null;
}

async function deleteRecord(id) {
  const result = await pool.query(
    `DELETE FROM produce_records WHERE id = $1`,
    [id]
  );

  return result.rowCount > 0;
}

module.exports = {
  listRecords,
  getRecordByLotId,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
};