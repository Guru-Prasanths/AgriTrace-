const priceModel = require("../models/priceModel");
const recordModel = require("../models/recordModel");

function validatePriceBody(body) {
  const errors = [];
  const { lotId, farmerPrice, traderPrice, marketPrice, consumerPrice } = body;

  if (!lotId && !body.produceRecordId) {
    errors.push("lotId or produceRecordId is required");
  }

  const numericFields = { farmerPrice, traderPrice, marketPrice, consumerPrice };
  for (const [name, val] of Object.entries(numericFields)) {
    if (val === undefined || val === null || isNaN(Number(val))) {
      errors.push(`${name} is required and must be a number`);
    } else if (Number(val) < 0) {
      errors.push(`${name} must be >= 0`);
    }
  }

  if (errors.length === 0) {
    const f = Number(farmerPrice);
    const c = Number(consumerPrice);
    if (f > c) {
      errors.push("farmerPrice cannot exceed consumerPrice");
    }
  }

  return errors;
}

async function getByBatchId(req, res, next) {
  try {
    const { batchId } = req.params;
    const prices = await priceModel.listPricesByLotId(batchId);
    res.json({
      batchId,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const errors = validatePriceBody(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    const lotId = req.body.lotId ? String(req.body.lotId).trim() : null;
    let record = null;

    if (lotId) {
      record = await recordModel.getRecordByLotId(lotId);
    } else if (req.body.produceRecordId) {
      record = await recordModel.getRecordById(req.body.produceRecordId);
    }

    if (!record) {
      return res.status(404).json({
        error: "Produce record not found",
        message: `No registered produce record found for Lot ID: ${lotId || req.body.produceRecordId}`
      });
    }

    const snapshot = await priceModel.createPriceSnapshot({
      produceRecordId: record.id,
      farmerPrice: Number(req.body.farmerPrice),
      traderPrice: Number(req.body.traderPrice),
      marketPrice: Number(req.body.marketPrice),
      consumerPrice: Number(req.body.consumerPrice),
      blockchainTxHash: req.body.blockchainTxHash || null
    });

    res.status(201).json({
      data: snapshot,
      message: "Price snapshot recorded successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getByBatchId,
  create
};
