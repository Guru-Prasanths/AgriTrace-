const express = require("express");
const controller = require("../controllers/priceController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Public read endpoint
router.get("/:batchId", controller.getByBatchId);

// Protected write endpoint
router.post("/", authenticate, controller.create);

module.exports = router;
