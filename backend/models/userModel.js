/**
 * User Model for AgriTrace
 * Database queries for users, authentication, roles, and points balances.
 */

const db = require("../config/db");
const { normalizeEmail } = require("../utils/emailNormalizer");

async function findUserByEmail(email) {
  const norm = normalizeEmail(email);
  const result = await db.query(
    "SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))",
    [norm]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await db.query(
    "SELECT id, email, name, role, status, is_verified, points_balance, total_points_earned, phone, location, created_at, updated_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
}

async function findUserByIdWithPassword(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function findUserByGoogleSub(googleSub) {
  if (!googleSub) return null;
  const result = await db.query(
    "SELECT * FROM users WHERE google_sub = $1",
    [googleSub]
  );
  return result.rows[0] || null;
}

async function createGoogleUser({ email, name, role, googleSub, pictureUrl = null, location = null }) {
  const norm = normalizeEmail(email);
  const result = await db.query(
    `INSERT INTO users (email, password_hash, name, role, status, is_verified, verification_token, points_balance, total_points_earned, phone, location, google_sub, auth_provider, picture_url)
     VALUES ($1, NULL, $2, $3, 'active', TRUE, NULL, 0, 0, NULL, $4, $5, 'google', $6)
     RETURNING id, email, name, role, status, is_verified, points_balance, total_points_earned, phone, location, google_sub, auth_provider, picture_url, created_at`,
    [norm, name, role, location, googleSub, pictureUrl]
  );
  return result.rows[0];
}

async function linkGoogleAccount(userId, { googleSub, pictureUrl = null }) {
  const result = await db.query(
    `UPDATE users 
     SET google_sub = $1, 
         auth_provider = 'both', 
         is_verified = TRUE, 
         picture_url = COALESCE($2, picture_url), 
         updated_at = NOW() 
     WHERE id = $3 
     RETURNING id, email, name, role, status, is_verified, points_balance, total_points_earned, phone, location, google_sub, auth_provider, picture_url, created_at`,
    [googleSub, pictureUrl, userId]
  );
  return result.rows[0] || null;
}

async function createUser({ email, passwordHash, name, role, phone = null, location = null, isVerified = false, verificationToken = null }) {
  const norm = normalizeEmail(email);
  const result = await db.query(
    `INSERT INTO users (email, password_hash, name, role, status, is_verified, verification_token, points_balance, total_points_earned, phone, location)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, email, name, role, status, is_verified, points_balance, total_points_earned, phone, location, created_at`,
    [norm, passwordHash, name, role, "active", isVerified, verificationToken, 0, 0, phone, location]
  );
  return result.rows[0];
}

async function updateUserPoints(userId, pointsToAdd, totalPointsToAdd = pointsToAdd) {
  const result = await db.query(
    `UPDATE users 
     SET points_balance = points_balance + $1,
         total_points_earned = total_points_earned + $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, points_balance, total_points_earned`,
    [pointsToAdd, totalPointsToAdd, userId]
  );
  return result.rows[0] || null;
}

async function deductUserPoints(userId, pointsToDeduct) {
  const result = await db.query(
    `UPDATE users 
     SET points_balance = GREATEST(0, points_balance - $1),
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, points_balance, total_points_earned`,
    [pointsToDeduct, userId]
  );
  return result.rows[0] || null;
}

async function setUserVerified(userId, isVerified = true) {
  const result = await db.query(
    `UPDATE users SET is_verified = $1, updated_at = NOW() WHERE id = $2 RETURNING id, is_verified`,
    [isVerified, userId]
  );
  return result.rows[0] || null;
}

async function setUserStatus(userId, status) {
  const result = await db.query(
    `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status`,
    [status, userId]
  );
  return result.rows[0] || null;
}

async function listUsersByRole(role) {
  const result = await db.query("SELECT id, email, name, role, status, is_verified, points_balance, total_points_earned FROM users WHERE role = $1", [role]);
  return result.rows;
}

async function listEligibleDailyUsers() {
  const result = await db.query(
    "SELECT id, email, name, role, status, is_verified, points_balance, total_points_earned FROM users WHERE role IN ('farmer', 'seller')",
    []
  );
  return result.rows;
}

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  findUserByGoogleSub,
  createUser,
  createGoogleUser,
  linkGoogleAccount,
  updateUserPoints,
  deductUserPoints,
  setUserVerified,
  setUserStatus,
  listUsersByRole,
  listEligibleDailyUsers
};

