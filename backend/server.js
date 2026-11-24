const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");

const { port, frontendOrigin, nodeEnv } = require("./config/env");
const { sanitizeBody, sanitizeQuery, sanitizeParams } = require("./middleware/sanitize");

const recordRoutes = require("./routes/recordRoutes");
const healthRoutes = require("./routes/healthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const traceabilityRoutes = require("./routes/traceabilityRoutes");
const authRoutes = require("./routes/authRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tnCropRoutes = require("./routes/tnCropRoutes");
const tnMarketRoutes = require("./routes/tnMarketRoutes");
const { initRewardScheduler } = require("./services/rewardScheduler");

/* =========================================================
   APP
   ========================================================= */

const app = express();

/* =========================================================
   SECURITY — Helmet with Content Security Policy
   ========================================================= */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://cdn.jsdelivr.net",
          "https://translate.google.com",
          "https://translate.googleapis.com",
          "https://translate-pa.googleapis.com"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://www.gstatic.com",
          "https://translate.googleapis.com"
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://*.infura.io",
          "https://rpc.sepolia.org",
          "https://sepolia.etherscan.io",
          "https://translate.googleapis.com",
          "https://translate-pa.googleapis.com",
          "wss:"
        ],
        frameSrc: ["https://accounts.google.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  })
);

/* =========================================================
   ADDITIONAL SECURITY HEADERS
   ========================================================= */

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

/* =========================================================
   CORS — Whitelist specific origins only
   ========================================================= */

const allowedOrigins = [
  frontendOrigin,
  "http://localhost:5500",
  "http://localhost:4001",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:4001"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || /^https:\/\/.*\.github\.io$/.test(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS policy violation: origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Device-Id"],
    credentials: true,
    maxAge: 86400
  })
);

/* =========================================================
   RATE LIMITING
   ========================================================= */

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests", message: "Please try again later." }
});
app.use("/api/", globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts", message: "Account temporarily locked. Try again in 15 minutes." }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many admin requests", message: "Please try again later." }
});

/* =========================================================
   BODY PARSER
   ========================================================= */

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

/* =========================================================
   INPUT SANITIZATION — XSS Prevention
   ========================================================= */

app.use(sanitizeBody);
app.use(sanitizeQuery);
app.use(sanitizeParams);

/* =========================================================
   STATIC FRONTEND HOSTING
   ========================================================= */

app.use(express.static(path.join(__dirname, "../frontend"), {
  dotfiles: "deny",
  index: ["index.html"]
}));

/* =========================================================
   ROOT & API INFO
   ========================================================= */

app.get("/api", (req, res) => {
  res.json({
    name: "AgriTrace API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      records: "/api/records",
      batches: "/api/batches",
      prices: "/api/prices",
      environment: "/api/environment",
      sensors: "/api/sensors",
      traceability: "/api/traceability/:batchId",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
        verifyEmail: "POST /api/auth/verify-email"
      },
      rewards: {
        dashboard: "GET /api/rewards/dashboard",
        transactions: "GET /api/rewards/transactions"
      },
      orders: {
        list: "GET /api/orders",
        create: "POST /api/orders",
        detail: "GET /api/orders/:id",
        updateStatus: "PATCH /api/orders/:id/status"
      },
      admin: {
        config: "GET/PUT /api/admin/rewards/config",
        triggerDaily: "POST /api/admin/rewards/trigger-daily",
        logs: "GET /api/admin/rewards/logs",
        auditLogs: "GET /api/admin/audit-logs"
      },
      tnCrops: {
        list: "GET /api/tn-crops",
        detail: "GET /api/tn-crops/:slugOrId",
        marketPrices: "GET /api/tn-crops/:slugOrId/market-prices",
        sources: "GET /api/tn-crops/sources",
        refresh: "POST /api/tn-crops/refresh"
      }
    }
  });
});

/* =========================================================
   API ROUTES (with endpoint-specific rate limiting)
   ========================================================= */

app.use("/api/health", healthRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/batches", recordRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/environment", sensorRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/traceability", traceabilityRoutes);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/google", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminLimiter, adminRoutes);
app.use("/api/tn-crops", tnCropRoutes);
app.use("/api/tn-market", tnMarketRoutes);

// Initialize background 24h daily reward scheduler
if (nodeEnv !== "test") {
  initRewardScheduler();
}

/* =========================================================
   404 HANDLER
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

/* =========================================================
   ERROR HANDLER (Secure — no stack traces in production)
   ========================================================= */

app.use((error, req, res, next) => {
  if (nodeEnv === "development") {
    console.error("[api error]", error.message || error);
  }

  // Check for PostgreSQL connection, auth, or query errors
  if (
    error.code === "ECONNREFUSED" ||
    error.code === "ENOTFOUND" ||
    error.code === "28P01" ||
    error.code === "28000" ||
    error.code === "3D000" ||
    /password authentication failed|role .* does not exist|database .* does not exist|connect ECONNREFUSED|Connection terminated/i.test(error.message || "")
  ) {
    return res.status(503).json({
      error: "Database unavailable",
      message: "The database is currently unreachable. Please try again later.",
      ...(nodeEnv === "development" && { detail: error.message })
    });
  }

  // CORS errors
  if (error.message && error.message.includes("CORS policy violation")) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Cross-origin request blocked."
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: nodeEnv === "development" ? error.message : "An unexpected error occurred",
    ...(nodeEnv === "development" && { stack: error.stack })
  });
});

/* =========================================================
   START SERVER
   ========================================================= */

if (require.main === module) {
  app.listen(port, () => {
    console.log(`========================================`);
    console.log(`AgriTrace API listening on http://localhost:${port}`);
    console.log(`Environment: ${nodeEnv}`);
    console.log(`CORS origins: ${allowedOrigins.join(", ")}`);
    console.log(`Database: ${process.env.DATABASE_URL ? "configured" : "MISSING"}`);
    console.log(`JWT Secret: ${process.env.JWT_SECRET ? "configured" : "auto-generated (set JWT_SECRET in .env)"}`);
    console.log(`Rate limiting: enabled`);
    console.log(`========================================`);
  });
}

module.exports = app;
