const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { port, frontendOrigin } = require("./config/env");

const recordRoutes = require("./routes/recordRoutes");
const healthRoutes = require("./routes/healthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const traceabilityRoutes = require("./routes/traceabilityRoutes");

/* =========================================================
   APP
   ========================================================= */

const app = express();

/* =========================================================
   SECURITY
   ========================================================= */

app.use(helmet());

/* =========================================================
   CORS
   Allows the AgriTrace frontend to communicate with Express
   during local development or production.
   ========================================================= */

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5501",
      "http://localhost:5501",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://127.0.0.1:8080",
      "http://localhost:8080"
    ],
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
   ROOT API
   ========================================================= */

app.get("/", (req, res) => {
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
      traceability: "/api/traceability/:batchId"
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
