const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const required = ["DATABASE_URL"];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[config] Missing environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT || 4001),
  databaseUrl: process.env.DATABASE_URL,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5500",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "agritrace-super-secure-jwt-secret-key-2026",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};