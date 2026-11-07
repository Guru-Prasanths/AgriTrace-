/**
 * AgriTrace - Tamil Nadu Agricultural Market Intelligence Routes
 */

const express = require("express");
const router = express.Router();
const tnMarketController = require("../controllers/tnMarketController");

router.get("/markets", tnMarketController.getMarkets);
router.get("/comparison", tnMarketController.getComparison);
router.post("/profit-calculator", tnMarketController.calculateProfit);
router.get("/trends", tnMarketController.getTrends);
router.get("/weather-advisory", tnMarketController.getWeatherAdvisory);
router.get("/nearby", tnMarketController.getNearby);
router.get("/schemes", tnMarketController.getSchemes);
router.get("/voice-query", tnMarketController.handleVoiceQuery);

module.exports = router;

