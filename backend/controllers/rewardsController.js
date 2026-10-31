/**
 * Rewards Controller for AgriTrace
 * Provides endpoints for points balance, breakdowns, and transaction history.
 */

const rewardModel = require("../models/rewardModel");

async function getDashboard(req, res) {
  try {
    const summary = await rewardModel.getUserPointsSummary(req.user.id);
    if (!summary) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(summary);
  } catch (err) {
    console.error("[rewards getDashboard error]", err);
    return res.status(500).json({ error: "Failed to load rewards dashboard", message: err.message });
  }
}

async function getTransactions(req, res) {
  try {
    const txs = await rewardModel.listTransactionsForUser(req.user.id);
    return res.json({ transactions: txs });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list transactions", message: err.message });
  }
}

module.exports = {
  getDashboard,
  getTransactions
};

