const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const { port, frontendOrigin } = require("./config/env");

const recordRoutes = require("./routes/recordRoutes");
const healthRoutes = require("./routes/healthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const traceabilityRoutes = require("./routes/traceabilityRoutes");
const authRoutes = require("./routes/authRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { initRewardScheduler } = require("./services/rewardScheduler");

/* =========================================================
   APP
   ========================================================= */

const app = express();

/* =========================================================
   SECURITY
   ========================================================= */

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

/* =========================================================
   CORS
   Allows the AgriTrace frontend to communicate with Express
   during local development or production.
   ========================================================= */

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow file:// (origin is null or 'null'), localhost, and 127.0.0.1
      if (!origin || origin === "null" || origin === "file://" || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Device-Id"],
    credentials: false
  })
);

/* =========================================================
   BODY PARSER
   ========================================================= */

app.use(
  express.json({
    limit: "2mb"
  })
);

/* =========================================================
   STATIC FRONTEND HOSTING
   Allows opening http://localhost:4001 directly in the browser
   as well as Live Server on port 5500.
   ========================================================= */

app.use(express.static(path.join(__dirname, "../frontend")));

/* =========================================================
   ROOT & API INFO
   ========================================================= */

app.get("/api", (req, res) => {
  res.json({
    name: "AgriTrace API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
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
      }
    }
  });
});

/* =========================================================
   API ROUTES
   ========================================================= */

app.use("/api/health", healthRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/batches", recordRoutes); // Alias for batch endpoint
app.use("/api/prices", priceRoutes);
app.use("/api/environment", sensorRoutes);
app.use("/api/sensors", sensorRoutes); // Alias for sensors endpoint
app.use("/api/traceability", traceabilityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Initialize background 24h daily reward scheduler
if (process.env.NODE_ENV !== "test") {
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
   ERROR HANDLER (Graceful DB & Application Failures)
   ========================================================= */

app.use((error, req, res, next) => {
  console.error("[api error]", error.message || error);

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
      message: "The off-chain PostgreSQL database is currently unreachable or credentials need configuration. Verify DATABASE_URL in .env and ensure PostgreSQL is running.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: error.message || "An unexpected error occurred",
    detail: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
});

/* =========================================================
   START SERVER
   ========================================================= */

if (require.main === module) {
  app.listen(port, () => {
    console.log(`========================================`);
    console.log(`AgriTrace API listening on http://localhost:${port}`);
    console.log(`Frontend CORS origin: ${frontendOrigin}`);
    console.log(`Database URL: ${process.env.DATABASE_URL ? "configured" : "MISSING"}`);
    console.log(`========================================`);
  });
}

module.exports = app;
