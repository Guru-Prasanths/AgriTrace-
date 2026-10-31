const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, orderController.createOrder);
router.get("/", authenticate, orderController.listOrders);
router.get("/:id", authenticate, orderController.getOrder);
router.patch("/:id/status", authenticate, orderController.updateStatus);

module.exports = router;

