const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});

const required = ["DATABASE_URL"];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[config] Missing environment variable: ${key}`);
  }
}

if (!process.env.JWT_SECRET) {
  console.warn("[config] WARNING: JWT_SECRET not set. Using auto-generated secret (tokens will not persist across restarts).");
}

module.exports = {
  port: Number(process.env.PORT || 4001),
  databaseUrl: process.env.DATABASE_URL,
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5500",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};
