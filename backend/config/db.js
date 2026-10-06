const { Pool } = require("pg");
const { databaseUrl } = require("./env");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (error) => {
  console.error("[postgres] Unexpected idle client error:", error);
});

module.exports = pool;
