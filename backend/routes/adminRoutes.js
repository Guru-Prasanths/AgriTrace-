const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.use(authenticate);
router.use(requireAdmin);

router.get("/rewards/config", adminController.getConfig);
router.put("/rewards/config", adminController.updateConfig);
router.post("/rewards/trigger-daily", adminController.triggerDailyRun);
router.get("/rewards/logs", adminController.getSchedulerLogs);
router.get("/audit-logs", adminController.getAuditLogs);

module.exports = router;

