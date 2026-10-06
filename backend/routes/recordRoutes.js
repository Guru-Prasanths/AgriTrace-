const express = require("express");
const controller = require("../controllers/recordController");
const { parseNumericField } = require("../middleware/validate");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post(
  "/",
  parseNumericField("farmerPrice", { min: 0 }),
  parseNumericField("consumerPrice", { min: 0 }),
  parseNumericField("storageTemperatureC", { min: -50, max: 100 }),
  parseNumericField("storageHumidityPct", { min: 0, max: 100 }),
  controller.create
);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
