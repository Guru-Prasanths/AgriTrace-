const express = require("express");
const controller = require("../controllers/sensorController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Public read endpoint
router.get("/:batchId", controller.getByBatchId);

// Protected write endpoints
router.post("/", authenticate, controller.create);
router.post("/readings", authenticate, controller.ingest);

module.exports = router;
