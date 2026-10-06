const sensorModel = require("../models/sensorModel");
const recordModel = require("../models/recordModel");

function validateSensorBody(body) {
  const errors = [];
  const { lotId, temperatureC, humidityPct, spoilageRiskPct } = body;

  if (!lotId && !body.produceRecordId) {
    errors.push("lotId or produceRecordId is required");
  }

  if (temperatureC === undefined || isNaN(Number(temperatureC))) {
    errors.push("temperatureC is required and must be a number");
  } else if (Number(temperatureC) < -50 || Number(temperatureC) > 100) {
    errors.push("temperatureC must be between -50°C and 100°C");
  }

  if (humidityPct === undefined || isNaN(Number(humidityPct))) {
    errors.push("humidityPct is required and must be a number");
  } else if (Number(humidityPct) < 0 || Number(humidityPct) > 100) {
    errors.push("humidityPct must be between 0% and 100%");
  }

  if (spoilageRiskPct !== undefined) {
    if (isNaN(Number(spoilageRiskPct)) || Number(spoilageRiskPct) < 0 || Number(spoilageRiskPct) > 100) {
      errors.push("spoilageRiskPct must be between 0% and 100%");
    }
  }

  return errors;
}

// Calculate realistic spoilage risk based on temperature and humidity thresholds
function calculateRisk(temperatureC, humidityPct) {
  const temp = Number(temperatureC);
  const hum = Number(humidityPct);
  // Ideal cold-chain produce range: 2-8°C, 60-85% humidity
  let risk = 5.0; // Base baseline risk
  if (temp > 8) {
    risk += (temp - 8) * 4.5;
  } else if (temp < 0) {
    risk += Math.abs(temp) * 3.0; // Freeze damage
  }

  if (hum > 90) {
    risk += (hum - 90) * 2.5; // Moisture decay
  } else if (hum < 50) {
    risk += (50 - hum) * 1.5; // Dehydration
  }

  return Math.min(100.0, Math.max(0.0, Number(risk.toFixed(2))));
}

async function getByBatchId(req, res, next) {
  try {
    const { batchId } = req.params;
    const readings = await sensorModel.listReadingsByLotId(batchId);
    res.json({
      batchId,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const errors = validateSensorBody(req.body);
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

    const temp = Number(req.body.temperatureC);
    const hum = Number(req.body.humidityPct);
    const risk = req.body.spoilageRiskPct !== undefined
      ? Number(req.body.spoilageRiskPct)
      : calculateRisk(temp, hum);

    const reading = await sensorModel.createSensorReading({
      produceRecordId: record.id,
      temperatureC: temp,
      humidityPct: hum,
      spoilageRiskPct: risk,
      sourceDevice: req.body.sourceDevice || "manual-entry",
      blockchainTxHash: req.body.blockchainTxHash || null
    });

    res.status(201).json({
      data: reading,
      message: "Sensor reading recorded successfully"
    });
  } catch (error) {
    next(error);
  }
}

/**
 * IoT / ESP32 Gateway Ingestion Interface
 * Endpoint for physical ESP32 or MQTT gateway forwarder in future hardware setup.
 */
async function ingest(req, res, next) {
  try {
    const readings = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (let i = 0; i < readings.length; i++) {
      const item = readings[i];
      const valErrors = validateSensorBody(item);
      if (valErrors.length > 0) {
        errors.push({ index: i, errors: valErrors });
        continue;
      }

      const lotId = item.lotId ? String(item.lotId).trim() : null;
      const record = await recordModel.getRecordByLotId(lotId);
      if (!record) {
        errors.push({ index: i, error: `Lot ${lotId} not found` });
        continue;
      }

      const temp = Number(item.temperatureC);
      const hum = Number(item.humidityPct);
      const risk = item.spoilageRiskPct !== undefined
        ? Number(item.spoilageRiskPct)
        : calculateRisk(temp, hum);

      const saved = await sensorModel.createSensorReading({
        produceRecordId: record.id,
        temperatureC: temp,
        humidityPct: hum,
        spoilageRiskPct: risk,
        sourceDevice: item.sourceDevice || req.headers["x-device-id"] || "esp32-gateway",
        blockchainTxHash: item.blockchainTxHash || null
      });

      results.push(saved);
    }

    res.status(201).json({
      received: readings.length,
      saved: results.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      data: results
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getByBatchId,
  create,
  ingest
};
