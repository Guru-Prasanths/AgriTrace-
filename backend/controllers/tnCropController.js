/**
 * AgriTrace - Tamil Nadu Crop Dataset Controller
 * REST API Endpoints for Official Agricultural Datasets & Mandi Benchmarks
 */

const tnCropModel = require("../models/tnCropModel");

/**
 * GET /api/tn-crops
 * List crops with optional filters (?search=...&category=...&district=...)
 */
async function getCrops(req, res) {
  try {
    const { search, category, district } = req.query;
    const crops = await tnCropModel.getAllCrops({ search, category, district });

    // Lightweight summary for catalogue view
    const catalogue = crops.map(c => ({
      id: c.id,
      slug: c.slug,
      crop_name: c.crop_name,
      crop_tamil: c.crop_tamil,
      scientific_name: c.scientific_name,
      category: c.category,
      category_label: c.category_label,
      category_label_ta: c.category_label_ta,
      icon: c.icon,
      image_url: c.image_url,
      short_description: c.description,
      suitable_regions: c.suitable_regions,
      official_source_id: c.official_source_id,
      official_source_name: c.official_source_name,
      official_source_url: c.official_source_url,
      last_updated: c.last_updated,
      mandi_price_kg: (Number(c.market.modal_price_quintal) / 100).toFixed(2),
      mandi_price_quintal: c.market.modal_price_quintal,
      shelf_life_ambient: c.care_storage.shelf_life_ambient
    }));

    return res.json({
      ok: true,
      count: catalogue.length,
      data: catalogue
    });
  } catch (err) {
    console.error("[tnCropController] getCrops error:", err);
    return res.status(500).json({ ok: false, error: "Failed to retrieve Tamil Nadu crop catalogue" });
  }
}

/**
 * GET /api/tn-crops/:slugOrId
 * Detailed crop view containing all 7 verified sections:
 * A. Crop Overview
 * B. Seasonal Information
 * C. Market Information
 * D. Shelf Life and Spoilage
 * E. Crop Protection
 * F. Harvesting and Transportation
 * G. Post-Harvest Management
 */
async function getCropDetails(req, res) {
  try {
    const { slugOrId } = req.params;
    const crop = await tnCropModel.getCropBySlugOrId(slugOrId);

    if (!crop) {
      return res.status(404).json({
        ok: false,
        error: `Crop '${slugOrId}' not found in Tamil Nadu Agricultural Datasets`
      });
    }

    return res.json({
      ok: true,
      data: crop
    });
  } catch (err) {
    console.error("[tnCropController] getCropDetails error:", err);
    return res.status(500).json({ ok: false, error: "Failed to load crop details" });
  }
}

/**
 * GET /api/tn-crops/:slugOrId/market-prices
 * Mandi price observations and historical trend
 */
async function getMarketPrices(req, res) {
  try {
    const { slugOrId } = req.params;
    const priceData = await tnCropModel.getMarketPricesByCrop(slugOrId);

    if (!priceData) {
      return res.status(404).json({
        ok: false,
        error: `Market prices not found for crop '${slugOrId}'`
      });
    }

    return res.json({
      ok: true,
      data: priceData
    });
  } catch (err) {
    console.error("[tnCropController] getMarketPrices error:", err);
    return res.status(500).json({ ok: false, error: "Failed to retrieve market prices" });
  }
}

/**
 * GET /api/tn-crops/meta/sources
 * List verified official Tamil Nadu agricultural sources
 */
async function getSources(req, res) {
  try {
    const sources = await tnCropModel.getGovernmentSources();
    return res.json({
      ok: true,
      count: sources.length,
      data: sources
    });
  } catch (err) {
    console.error("[tnCropController] getSources error:", err);
    return res.status(500).json({ ok: false, error: "Failed to retrieve official sources" });
  }
}

/**
 * POST /api/tn-crops/refresh
 * Sync and refresh crop records from official datasets
 */
async function refreshData(req, res) {
  try {
    const audit = await tnCropModel.refreshDataset();
    return res.json({
      ok: true,
      message: "Tamil Nadu agricultural datasets refreshed successfully",
      audit
    });
  } catch (err) {
    console.error("[tnCropController] refreshData error:", err);
    return res.status(500).json({ ok: false, error: "Failed to refresh agricultural datasets" });
  }
}

module.exports = {
  getCrops,
  getCropDetails,
  getMarketPrices,
  getSources,
  refreshData
};

