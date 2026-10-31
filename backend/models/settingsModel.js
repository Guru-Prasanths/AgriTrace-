/**
 * Reward Settings Model for AgriTrace
 * Provides configurable parameters for order completion points,
 * role-specific daily rewards, schedule, and account eligibility.
 */

const db = require("../config/db");

async function getAllSettings() {
  const result = await db.query("SELECT setting_key, setting_value, description, updated_at FROM reward_settings", []);
  const settingsMap = {};
  result.rows.forEach(r => {
    settingsMap[r.setting_key] = r.setting_value;
  });
  return {
    raw: result.rows,
    map: settingsMap
  };
}

async function getSetting(key, defaultValue = null) {
  const result = await db.query("SELECT setting_value FROM reward_settings WHERE setting_key = $1", [key]);
  if (result.rows.length > 0) {
    return result.rows[0].setting_value;
  }
  return defaultValue;
}

async function updateSetting(key, value, updatedBy = null) {
  const result = await db.query(
    "UPDATE reward_settings SET setting_value = $1, updated_at = NOW() WHERE setting_key = $2 RETURNING *",
    [String(value), key, updatedBy]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllSettings,
  getSetting,
  updateSetting
};

