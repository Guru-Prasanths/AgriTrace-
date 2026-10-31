const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleAuth);
router.get("/google/config", authController.getGoogleConfig);
router.post("/logout", authController.logout);
router.get("/profile", authenticate, authController.getProfile);
router.post("/verify-email", authenticate, authController.verifyEmail);

module.exports = router;

