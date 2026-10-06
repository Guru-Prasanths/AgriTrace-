const express = require("express");
const controller = require("../controllers/sensorController");

const router = express.Router();

router.get("/:batchId", controller.getByBatchId);
router.post("/", controller.create);
router.post("/readings", controller.ingest); // Hardware/ESP32 ingestion endpoint

module.exports = router;
