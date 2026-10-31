/**
 * Admin Configuration Controller for AgriTrace
 * Provides endpoints for configuring rewards, viewing audit logs,
 * inspecting scheduler history, and triggering reward runs.
 */

const settingsModel = require("../models/settingsModel");
const rewardModel = require("../models/rewardModel");
const rewardScheduler = require("../services/rewardScheduler");

async function getConfig(req, res) {
  try {
    const settings = await settingsModel.getAllSettings();
    return res.json({
      settings: settings.map,
      definitions: settings.raw
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch reward configuration", message: err.message });
  }
}

async function updateConfig(req, res) {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Invalid payload", message: "Settings object required" });
    }

    const allowedKeys = [
      "farmer_daily_points",
      "seller_daily_points",
      "farmer_order_completion_points",
      "seller_order_completion_points",
      "daily_rewards_farmer_enabled",
      "daily_rewards_seller_enabled",
      "order_completion_rewards_enabled",
      "daily_reward_schedule_cron",
      "daily_reward_timezone",
      "daily_reward_require_verified",
      "daily_reward_require_active"
    ];

    const appliedUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      if (!allowedKeys.includes(key)) continue;

      // Validate numeric settings
      if (key.endsWith("_points")) {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
          return res.status(400).json({ error: `Invalid value for ${key}. Must be a non-negative number.` });
        }
      }

      // Validate boolean settings
      if (key.includes("_enabled") || key.includes("_require_")) {
        const valStr = String(value).toLowerCase();
        if (valStr !== "true" && valStr !== "false") {
          return res.status(400).json({ error: `Invalid boolean for ${key}. Must be 'true' or 'false'.` });
        }
      }

      await settingsModel.updateSetting(key, String(value), req.user.id);
      appliedUpdates[key] = String(value);
    }

    // Record audit log
    await rewardModel.logAdminAudit({
      adminId: req.user.id,
      action: "UPDATE_REWARD_SETTINGS",
      target: "reward_settings",
      details: appliedUpdates
    });

    // Re-initialize scheduler if cron or timezone changed
    if (appliedUpdates.daily_reward_schedule_cron || appliedUpdates.daily_reward_timezone) {
      await rewardScheduler.initRewardScheduler();
    }

    const refreshed = await settingsModel.getAllSettings();
    return res.json({
      message: "Reward configuration updated successfully",
      updated: appliedUpdates,
      settings: refreshed.map
    });
  } catch (err) {
    console.error("[updateConfig error]", err);
    return res.status(500).json({ error: "Failed to update configuration", message: err.message });
  }
}

async function triggerDailyRun(req, res) {
  try {
    const { periodKey } = req.body || {};
    const result = await rewardScheduler.processDailyRewards({
      periodKey: periodKey || null,
      triggeredBy: `admin:${req.user.email}`
    });

    await rewardModel.logAdminAudit({
      adminId: req.user.id,
      action: "TRIGGER_DAILY_REWARDS",
      target: result.periodKey,
      details: result
    });

    return res.json({
      message: "Daily rewards execution triggered",
      result
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to trigger daily rewards", message: err.message });
  }
}

async function getSchedulerLogs(req, res) {
  try {
    const limit = Number(req.query.limit || 100);
    const logs = await rewardModel.getDailyRewardLogs(limit);
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch scheduler logs", message: err.message });
  }
}

async function getAuditLogs(req, res) {
  try {
    const limit = Number(req.query.limit || 100);
    const logs = await rewardModel.getAdminAuditLogs(limit);
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch audit logs", message: err.message });
  }
}

module.exports = {
  getConfig,
  updateConfig,
  triggerDailyRun,
  getSchedulerLogs,
  getAuditLogs
};

