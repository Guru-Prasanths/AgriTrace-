const crypto = require("crypto");
const model = require("../models/recordModel");

function normalizeDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid harvestDate");
  }

  return date.toISOString();
}

function validateCreate(body) {
  const errors = [];

  if (!body.lotId || String(body.lotId).trim().length < 3) {
    errors.push("lotId is required");
  }

  if (!body.cropName || String(body.cropName).trim().length < 2) {
    errors.push("cropName is required");
  }

  if (!body.origin || String(body.origin).trim().length < 2) {
    errors.push("origin is required");
  }

  try {
    normalizeDate(body.harvestDate);
  } catch {
    errors.push("harvestDate must be a valid date");
  }

  if (
    body.farmerPrice !== undefined &&
    Number(body.farmerPrice) < 0
  ) {
    errors.push("farmerPrice must be >= 0");
  }

  if (
    body.consumerPrice !== undefined &&
    Number(body.consumerPrice) < 0
  ) {
    errors.push("consumerPrice must be >= 0");
  }

  if (
    body.metadataHash &&
    !/^0x[a-fA-F0-9]{64}$/.test(body.metadataHash)
  ) {
    errors.push(
      "metadataHash must be a 32-byte hex hash"
    );
  }

  return errors;
}

async function list(req, res, next) {
  try {
    res.json({
      data: await model.listRecords()
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const record =
      await model.getRecordById(req.params.id);

    if (!record) {
      return res.status(404).json({
        error: "Record not found"
      });
    }

    res.json({ data: record });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const errors = validateCreate(req.body);

    if (errors.length) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    const lotId =
      String(req.body.lotId).trim();

    // Prevent duplicate records with a clean response.
    const existing =
      await model.getRecordByLotId(lotId);

    if (existing) {
      return res.status(409).json({
        error: "Lot ID already exists",
        message:
          `${lotId} is already registered. ` +
          "Use a different Lot ID.",
        data: existing
      });
    }

    const canonical = JSON.stringify({
      lotId,
      cropName:
        String(req.body.cropName).trim(),
      origin:
        String(req.body.origin).trim(),
      harvestDate:
        new Date(req.body.harvestDate).toISOString(),
      qualityGrade:
        req.body.qualityGrade || null
    });

    const metadataHash =
      req.body.metadataHash ||
      `0x${crypto
        .createHash("sha256")
        .update(canonical)
        .digest("hex")}`;

    const record =
      await model.createRecord({
        ...req.body,
        lotId,
        harvestDate:
          normalizeDate(req.body.harvestDate),
        metadataHash
      });

    res.status(201).json({
      data: record,
      message:
        "Off-chain record created. " +
        "Submit the blockchain transaction next."
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const record =
      await model.updateRecord(
        req.params.id,
        req.body
      );

    if (!record) {
      return res.status(404).json({
        error: "Record not found"
      });
    }

    res.json({ data: record });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const deleted =
      await model.deleteRecord(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Record not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
};