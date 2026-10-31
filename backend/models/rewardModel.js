/**
 * Reward & Points Model for AgriTrace
 * Implements transactional, idempotent points awards, reversals,
 * and comprehensive audit history.
 */

const db = require("../config/db");
const userModel = require("./userModel");
const settingsModel = require("./settingsModel");

async function findTransactionByReference(referenceId) {
  const result = await db.query(
    "SELECT * FROM points_transactions WHERE reference_id = $1",
    [referenceId]
  );
  return result.rows[0] || null;
}

async function listTransactionsForUser(userId) {
  const result = await db.query(
    "SELECT * FROM points_transactions WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

async function createPointsTransaction({
  userId,
  points,
  transactionType,
  reason,
  orderId = null,
  referenceId,
  metadata = {}
}) {
  const metaStr = typeof metadata === "string" ? metadata : JSON.stringify(metadata);
  const result = await db.query(
    `INSERT INTO points_transactions (user_id, points, transaction_type, reason, order_id, reference_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, points, transactionType, reason, orderId, referenceId, metaStr]
  );
  return result.rows[0];
}

/**
 * Award completion points transactionally and idempotently for an order.
 * Awards points to Farmer and Seller based on admin configuration.
 */
async function awardCompletionPointsForOrder(order) {
  const { map: settings } = await settingsModel.getAllSettings();
  const enabled = (settings.order_completion_rewards_enabled || "true") === "true";
  if (!enabled) {
    return { awarded: false, reason: "Order completion rewards disabled" };
  }

  const farmerPoints = Number(settings.farmer_order_completion_points || 50);
  const sellerPoints = Number(settings.seller_order_completion_points || 50);

  const awards = [];

  // 1. Award Farmer
  if (order.farmer_id && farmerPoints > 0) {
    const farmerRef = `order_completion:${order.id}:${order.farmer_id}`;
    const existing = await findTransactionByReference(farmerRef);
    if (!existing) {
      await db.query("BEGIN");
      try {
        const tx = await createPointsTransaction({
          userId: order.farmer_id,
          points: farmerPoints,
          transactionType: "order_completion",
          reason: `Completed order #${order.order_number} (${order.crop_name})`,
          orderId: order.id,
          referenceId: farmerRef,
          metadata: { orderNumber: order.order_number, crop: order.crop_name, qty: order.quantity }
        });
        await userModel.updateUserPoints(order.farmer_id, farmerPoints, farmerPoints);
        await db.query("COMMIT");
        awards.push({ role: "farmer", userId: order.farmer_id, points: farmerPoints, txId: tx.id });
      } catch (err) {
        await db.query("ROLLBACK");
        if (err.code !== "23505") throw err; // Ignore duplicate race
      }
    }
  }

  // 2. Award Seller
  if (order.seller_id && sellerPoints > 0) {
    const sellerRef = `order_completion:${order.id}:${order.seller_id}`;
    const existing = await findTransactionByReference(sellerRef);
    if (!existing) {
      await db.query("BEGIN");
      try {
        const tx = await createPointsTransaction({
          userId: order.seller_id,
          points: sellerPoints,
          transactionType: "order_completion",
          reason: `Completed order #${order.order_number} (${order.crop_name})`,
          orderId: order.id,
          referenceId: sellerRef,
          metadata: { orderNumber: order.order_number, crop: order.crop_name, qty: order.quantity }
        });
        await userModel.updateUserPoints(order.seller_id, sellerPoints, sellerPoints);
        await db.query("COMMIT");
        awards.push({ role: "seller", userId: order.seller_id, points: sellerPoints, txId: tx.id });
      } catch (err) {
        await db.query("ROLLBACK");
        if (err.code !== "23505") throw err; // Ignore duplicate race
      }
    }
  }

  return { awarded: awards.length > 0, awards };
}

/**
 * Reverse points for an order that was previously completed and is now cancelled/reversed.
 */
async function reverseOrderPoints(order) {
  const reversals = [];

  const checkAndReverse = async (userId, role) => {
    const originalRef = `order_completion:${order.id}:${userId}`;
    const origTx = await findTransactionByReference(originalRef);
    if (!origTx) return;

    const reversalRef = `order_reversal:${order.id}:${userId}`;
    const existingReversal = await findTransactionByReference(reversalRef);
    if (existingReversal) return;

    const pointsToDeduct = Math.abs(Number(origTx.points));
    await db.query("BEGIN");
    try {
      const revTx = await createPointsTransaction({
        userId,
        points: -pointsToDeduct,
        transactionType: "order_reversal",
        reason: `Reversal for completed order #${order.order_number}`,
        orderId: order.id,
        referenceId: reversalRef,
        metadata: { originalReference: originalRef, orderNumber: order.order_number }
      });
      await userModel.deductUserPoints(userId, pointsToDeduct);
      await db.query("COMMIT");
      reversals.push({ role, userId, deducted: pointsToDeduct, txId: revTx.id });
    } catch (err) {
      await db.query("ROLLBACK");
      if (err.code !== "23505") throw err;
    }
  };

  if (order.farmer_id) await checkAndReverse(order.farmer_id, "farmer");
  if (order.seller_id) await checkAndReverse(order.seller_id, "seller");

  return { reversed: reversals.length > 0, reversals };
}

/**
 * Log daily reward attempt (awarded or skipped)
 */
async function logDailyReward({ runDate, userId, role, status, pointsAwarded = 0, reason = null, referenceId }) {
  try {
    const result = await db.query(
      `INSERT INTO daily_reward_logs (run_date, user_id, role, status, points_awarded, reason, reference_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [runDate, userId, role, status, pointsAwarded, reason, referenceId]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      return null; // Already logged
    }
    throw err;
  }
}

async function getDailyRewardLogs(limit = 100) {
  const result = await db.query(
    `SELECT * FROM daily_reward_logs ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

/**
 * Audit log for administrative changes
 */
async function logAdminAudit({ adminId = null, action, target = null, details = {} }) {
  const detailsStr = typeof details === "string" ? details : JSON.stringify(details);
  const result = await db.query(
    `INSERT INTO admin_audit_logs (admin_id, action, target, details)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [adminId, action, target, detailsStr]
  );
  return result.rows[0];
}

async function getAdminAuditLogs(limit = 100) {
  const result = await db.query(
    `SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

/**
 * Computes authoritative points summary for a user directly from DB
 */
async function getUserPointsSummary(userId) {
  const user = await userModel.findUserById(userId);
  if (!user) return null;

  const txs = await listTransactionsForUser(userId);

  let orderPoints = 0;
  let dailyPoints = 0;
  let reversalPoints = 0;

  txs.forEach(t => {
    const pts = Number(t.points || 0);
    if (t.transaction_type === "order_completion" && pts > 0) {
      orderPoints += pts;
    } else if (t.transaction_type === "daily_reward" && pts > 0) {
      dailyPoints += pts;
    } else if (t.transaction_type === "order_reversal") {
      reversalPoints += Math.abs(pts);
    }
  });

  // Calculate next reward time (fixed schedule: midnight UTC of next day)
  const now = new Date();
  const nextScheduled = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));

  return {
    userId: user.id,
    role: user.role,
    currentBalance: Number(user.points_balance || 0),
    totalEarned: Number(user.total_points_earned || 0),
    orderPoints,
    dailyPoints,
    reversalPoints,
    recentTransactions: txs.slice(0, 50),
    nextScheduledRewardTime: nextScheduled.toISOString(),
    isEligibleForDaily: user.status === "active"
  };
}

module.exports = {
  findTransactionByReference,
  listTransactionsForUser,
  createPointsTransaction,
  awardCompletionPointsForOrder,
  reverseOrderPoints,
  logDailyReward,
  getDailyRewardLogs,
  logAdminAudit,
  getAdminAuditLogs,
  getUserPointsSummary
};

