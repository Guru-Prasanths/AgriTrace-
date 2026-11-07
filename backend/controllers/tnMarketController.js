/**
 * AgriTrace - Tamil Nadu Agricultural Market Intelligence Controller
 */

const tnMarketModel = require("../models/tnMarketModel");

/**
 * GET /api/tn-market/markets
 */
async function getMarkets(req, res) {
  try {
    const { district } = req.query;
    const markets = tnMarketModel.getAllMarkets(district);
    return res.json({ ok: true, count: markets.length, data: markets });
  } catch (err) {
    console.error("[tnMarketController] getMarkets error:", err);
    return res.status(500).json({ ok: false, error: "Failed to retrieve markets" });
  }
}

/**
 * GET /api/tn-market/comparison
 * Mode A: Strict Common Observation Date
 * Mode B: Latest Available Prices
 */
async function getComparison(req, res) {
  try {
    const { crop = "tomato", districts, mode = "common", date } = req.query;
    const parsedDistricts = districts ? districts.split(",") : [];
    const comparison = tnMarketModel.getMarketComparison({
      crop,
      districts: parsedDistricts,
      mode,
      customDate: date
    });
    return res.json({ ok: true, data: comparison });
  } catch (err) {
    console.error("[tnMarketController] getComparison error:", err);
    return res.status(500).json({ ok: false, error: "Failed to calculate market comparison" });
  }
}

/**
 * POST /api/tn-market/profit-calculator
 */
async function calculateProfit(req, res) {
  try {
    const payload = req.body || {};
    const result = tnMarketModel.calculateSellingProfit(payload);
    return res.json({ ok: true, data: result });
  } catch (err) {
    console.error("[tnMarketController] calculateProfit error:", err);
    return res.status(500).json({ ok: false, error: "Failed to calculate net selling return" });
  }
}

/**
 * GET /api/tn-market/trends
 */
async function getTrends(req, res) {
  try {
    const { crop = "tomato", district = "Salem", days = 30 } = req.query;
    const trends = tnMarketModel.getPriceTrends({ crop, district, days: Number(days) });
    return res.json({ ok: true, data: trends });
  } catch (err) {
    console.error("[tnMarketController] getTrends error:", err);
    return res.status(500).json({ ok: false, error: "Failed to load price trends" });
  }
}

/**
 * GET /api/tn-market/weather-advisory
 */
async function getWeatherAdvisory(req, res) {
  try {
    const { district = "Salem", crop = "tomato" } = req.query;
    const advisory = await tnMarketModel.getWeatherAdvisory({ district, crop });
    return res.json({ ok: true, data: advisory });
  } catch (err) {
    console.error("[tnMarketController] getWeatherAdvisory error:", err);
    return res.status(500).json({ ok: false, error: "Failed to retrieve weather advisory" });
  }
}

/**
 * GET /api/tn-market/nearby
 */
async function getNearby(req, res) {
  try {
    const { district = "Salem" } = req.query;
    const markets = tnMarketModel.getNearbyMarkets(district);
    return res.json({ ok: true, count: markets.length, data: markets });
  } catch (err) {
    console.error("[tnMarketController] getNearby error:", err);
    return res.status(500).json({ ok: false, error: "Failed to find nearby markets" });
  }
}

/**
 * GET /api/tn-market/schemes
 */
async function getSchemes(req, res) {
  try {
    const { category } = req.query;
    const schemes = tnMarketModel.getGovernmentSchemes(category);
    return res.json({ ok: true, count: schemes.length, data: schemes });
  } catch (err) {
    console.error("[tnMarketController] getSchemes error:", err);
    return res.status(500).json({ ok: false, error: "Failed to retrieve government schemes" });
  }
}

/**
 * GET /api/tn-market/voice-query
 */
async function handleVoiceQuery(req, res) {
  try {
    const { q, lang = "ta" } = req.query;
    const answer = await tnMarketModel.processVoiceQuery(q, lang);
    return res.json({ ok: true, data: answer });
  } catch (err) {
    console.error("[tnMarketController] handleVoiceQuery error:", err);
    return res.status(500).json({ ok: false, error: "Failed to process voice query" });
  }
}

module.exports = {
  getMarkets,
  getComparison,
  calculateProfit,
  getTrends,
  getWeatherAdvisory,
  getNearby,
  getSchemes,
  handleVoiceQuery
};

