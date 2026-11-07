/**
 * AgriTrace - Tamil Nadu Agriculture Datasets Routes
 */

const express = require("express");
const router = express.Router();
const tnCropController = require("../controllers/tnCropController");

// Public endpoints
router.get("/", tnCropController.getCrops);
router.get("/sources", tnCropController.getSources);
router.get("/:slugOrId/market-prices", tnCropController.getMarketPrices);
router.get("/:slugOrId", tnCropController.getCropDetails);

// Sync / refresh endpoint
router.post("/refresh", tnCropController.refreshData);

module.exports = router;

