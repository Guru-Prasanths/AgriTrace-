const express = require("express");
const controller = require("../controllers/traceabilityController");

const router = express.Router();

router.get("/:batchId", controller.getTraceability);

module.exports = router;
