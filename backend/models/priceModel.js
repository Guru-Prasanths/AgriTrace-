const pool = require("../config/db");

async function listPricesByLotId(lotId) {
  const { rows } = await pool.query(
    `SELECT ps.id, ps.produce_record_id, ps.recorded_at, ps.farmer_price,
            ps.trader_price, ps.market_price, ps.consumer_price, ps.blockchain_tx_hash,
            pr.lot_id, pr.crop_name
     FROM price_snapshots ps
     JOIN produce_records pr ON pr.id = ps.produce_record_id
     WHERE pr.lot_id = $1 OR pr.id::text = $1
     ORDER BY ps.recorded_at DESC`,
    [lotId]
  );
  return rows;
}

async function listPricesByRecordId(recordId) {
  const { rows } = await pool.query(
    `SELECT * FROM price_snapshots WHERE produce_record_id = $1 ORDER BY recorded_at DESC`,
    [recordId]
  );
  return rows;
}

async function createPriceSnapshot(data) {
  const { rows } = await pool.query(
    `INSERT INTO price_snapshots
      (produce_record_id, farmer_price, trader_price, market_price, consumer_price, blockchain_tx_hash)
     VALUES
      ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.produceRecordId,
      data.farmerPrice,
      data.traderPrice,
      data.marketPrice,
      data.consumerPrice,
      data.blockchainTxHash || null
    ]
  );
  return rows[0];
}

async function getLatestPrice(lotId) {
  const { rows } = await pool.query(
    `SELECT ps.*
     FROM price_snapshots ps
     JOIN produce_records pr ON pr.id = ps.produce_record_id
     WHERE pr.lot_id = $1 OR pr.id::text = $1
     ORDER BY ps.recorded_at DESC
     LIMIT 1`,
    [lotId]
  );
  return rows[0] || null;
}

module.exports = {
  listPricesByLotId,
  listPricesByRecordId,
  createPriceSnapshot,
  getLatestPrice
};
