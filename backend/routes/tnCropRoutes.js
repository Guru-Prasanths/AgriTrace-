/**
 * AgriTrace - Tamil Nadu Agriculture Datasets Routes
 */

const express = require("express");
const router = express.Router();
const tnCropController = require("../controllers/tnCropController");
const { authenticate, requireAdmin } = require("../middleware/auth");

// Public endpoints
router.get("/", tnCropController.getCrops);
router.get("/sources", tnCropController.getSources);
router.get("/:slugOrId/market-prices", tnCropController.getMarketPrices);
router.get("/:slugOrId", tnCropController.getCropDetails);

// Protected admin endpoint
router.post("/refresh", authenticate, requireAdmin, tnCropController.refreshData);

module.exports = router;
