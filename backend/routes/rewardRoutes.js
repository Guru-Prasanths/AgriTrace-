const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewardsController");
const { authenticate } = require("../middleware/auth");

router.get("/dashboard", authenticate, rewardsController.getDashboard);
router.get("/transactions", authenticate, rewardsController.getTransactions);

module.exports = router;

