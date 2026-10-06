const recordModel = require("../models/recordModel");
const priceModel = require("../models/priceModel");
const sensorModel = require("../models/sensorModel");

async function getTraceability(req, res, next) {
  try {
    const { batchId } = req.params;
    let record = await recordModel.getRecordByLotId(batchId);
    if (!record) {
      record = await recordModel.getRecordById(batchId);
    }

    if (!record) {
      return res.status(404).json({
        error: "Batch not found",
        message: `No traceability record found for Lot ID: ${batchId}`
      });
    }

    const prices = await priceModel.listPricesByLotId(record.lot_id);
    const sensors = await sensorModel.listReadingsByLotId(record.lot_id);

    // Build timeline events
    const timeline = [];

    // Event 1: Creation & Harvest
    timeline.push({
      stage: "HARVESTED",
      title: "Harvested at Origin",
      timestamp: record.harvest_date,
      location: record.origin,
      details: `Crop: ${record.crop_name}, Quality Grade: ${record.quality_grade || "Standard"}`,
      verified: true
    });

    // Event 2: Off-chain Registration
    timeline.push({
      stage: "REGISTERED",
      title: "Registered in AgriTrace Registry",
      timestamp: record.created_at,
      details: `Lot ID: ${record.lot_id}`,
      verified: true
    });

    // Event 3: Blockchain Anchor
    if (record.blockchain_tx_hash) {
      timeline.push({
        stage: "BLOCKCHAIN_ANCHORED",
        title: record.blockchain_verified ? "Verified on Blockchain" : "Anchored on Blockchain",
        timestamp: record.updated_at,
        txHash: record.blockchain_tx_hash,
        network: record.blockchain_network,
        verified: record.blockchain_verified
      });
    }

    // Event 4: Price discovery events
    for (const p of prices) {
      timeline.push({
        stage: "PRICED",
        title: "Price Discovery Snapshot",
        timestamp: p.recorded_at,
        farmerPrice: p.farmer_price,
        traderPrice: p.trader_price,
        marketPrice: p.market_price,
        consumerPrice: p.consumer_price,
        txHash: p.blockchain_tx_hash
      });
    }

    // Event 5: Environmental observations
    for (const s of sensors) {
      timeline.push({
        stage: "MONITORED",
        title: "Cold-Chain Sensor Observation",
        timestamp: s.recorded_at,
        temperatureC: s.temperature_c,
        humidityPct: s.humidity_pct,
        spoilageRiskPct: s.spoilage_risk_pct,
        device: s.source_device,
        txHash: s.blockchain_tx_hash
      });
    }

    // Sort timeline chronologically
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json({
      lotId: record.lot_id,
      cropName: record.crop_name,
      origin: record.origin,
      harvestDate: record.harvest_date,
      qualityGrade: record.quality_grade,
      status: record.blockchain_verified ? "VERIFIED" : record.blockchain_tx_hash ? "ANCHORED" : "REGISTERED",

      // Explicit separation of On-Chain vs Off-Chain
      onChain: {
        lotId: record.lot_id,
        blockchainKey: record.blockchain_key,
        blockchainTxHash: record.blockchain_tx_hash,
        blockchainNetwork: record.blockchain_network,
        blockchainVerified: record.blockchain_verified,
        metadataHash: record.metadata_hash
      },

      offChain: {
        id: record.id,
        storageTemperatureC: record.storage_temperature_c,
        storageHumidityPct: record.storage_humidity_pct,
        farmerPrice: record.farmer_price,
        consumerPrice: record.consumer_price,
        createdAt: record.created_at,
        updatedAt: record.updated_at
      },

      priceHistory: prices,
      sensorHistory: sensors,
      timeline
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTraceability
};
