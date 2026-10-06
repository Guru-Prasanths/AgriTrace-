const express = require("express");
const controller = require("../controllers/priceController");

const router = express.Router();

router.get("/:batchId", controller.getByBatchId);
router.post("/", controller.create);

module.exports = router;
