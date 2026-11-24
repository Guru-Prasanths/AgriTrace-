const express = require("express");
const controller = require("../controllers/recordController");
const { parseNumericField } = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Public read endpoints
router.get("/", controller.list);
router.get("/:id", controller.getById);

// Protected write endpoints (require authentication)
router.post(
  "/",
  authenticate,
  parseNumericField("farmerPrice", { min: 0 }),
  parseNumericField("consumerPrice", { min: 0 }),
  parseNumericField("storageTemperatureC", { min: -50, max: 100 }),
  parseNumericField("storageHumidityPct", { min: 0, max: 100 }),
  controller.create
);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);

module.exports = router;
