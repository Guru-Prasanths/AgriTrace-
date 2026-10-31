/**
 * Automatic Daily Reward Points Scheduler (24h Interval)
 *
 * Rule Specification:
 * - Fixed Daily Calendar Schedule (e.g. UTC date YYYY-MM-DD).
 * - Automatic background job via node-cron (default '0 0 * * *', midnight daily).
 * - Login-free: grants points without requiring the user to log in.
 * - Idempotent: Unique reference `daily_reward:<userId>:<periodKey>` enforced by DB constraint.
 *   Repeated executions, server restarts, or multi-instance workers skip duplicate runs safely.
 * - Full audit logs stored in `daily_reward_logs`.
 */

const cron = require("node-cron");
const db = require("../config/db");
const settingsModel = require("../models/settingsModel");
const userModel = require("../models/userModel");
const rewardModel = require("../models/rewardModel");

let activeCronTask = null;
let isJobRunning = false;

/**
 * Returns canonical current date key for the daily reward period (e.g. "2026-10-30")
 */
function getPeriodKey(timezone = "UTC") {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return formatter.format(new Date()); // YYYY-MM-DD
  } catch (e) {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }
}

/**
 * Core Daily Reward Processing Engine
 * Can be called automatically by cron, or on-demand by authorized admin.
 */
async function processDailyRewards({ periodKey = null, triggeredBy = "system_scheduler" } = {}) {
  if (isJobRunning) {
    console.log("[scheduler] Daily reward job already in progress, skipping duplicate execution.");
    return { status: "already_running" };
  }

  isJobRunning = true;
  const startTime = Date.now();

  try {
    const { map: settings } = await settingsModel.getAllSettings();

    const farmerEnabled = (settings.daily_rewards_farmer_enabled || "true") === "true";
    const sellerEnabled = (settings.daily_rewards_seller_enabled || "true") === "true";
    const requireVerified = (settings.daily_reward_require_verified || "false") === "true";
    const requireActive = (settings.daily_reward_require_active || "true") === "true";
    const timezone = settings.daily_reward_timezone || "UTC";

    const farmerPoints = Number(settings.farmer_daily_points || 10);
    const sellerPoints = Number(settings.seller_daily_points || 15);

    const activePeriodKey = periodKey || getPeriodKey(timezone);

    console.log(`[scheduler] Starting daily reward run for period ${activePeriodKey} (tz: ${timezone})...`);

    const users = await userModel.listEligibleDailyUsers();

    let processedCount = 0;
    let awardedCount = 0;
    let skippedCount = 0;
    let totalPointsAwarded = 0;
    const details = [];

    for (const user of users) {
      processedCount++;
      const userRole = (user.role || "").toLowerCase();
      const referenceId = `daily_reward:${user.id}:${activePeriodKey}`;

      // Check role enablement
      if (userRole === "farmer" && !farmerEnabled) {
        await rewardModel.logDailyReward({
          runDate: activePeriodKey,
          userId: user.id,
          role: user.role,
          status: "skipped",
          pointsAwarded: 0,
          reason: "Farmer daily rewards disabled in settings",
          referenceId
        });
        skippedCount++;
        details.push({ userId: user.id, role: user.role, status: "skipped", reason: "role_disabled" });
        continue;
      }

      if (userRole === "seller" && !sellerEnabled) {
        await rewardModel.logDailyReward({
          runDate: activePeriodKey,
          userId: user.id,
          role: user.role,
          status: "skipped",
          pointsAwarded: 0,
          reason: "Seller daily rewards disabled in settings",
          referenceId
        });
        skippedCount++;
        details.push({ userId: user.id, role: user.role, status: "skipped", reason: "role_disabled" });
        continue;
      }

      // Check account status
      if (requireActive && user.status !== "active") {
        await rewardModel.logDailyReward({
          runDate: activePeriodKey,
          userId: user.id,
          role: user.role,
          status: "skipped",
          pointsAwarded: 0,
          reason: `Account status is '${user.status}'`,
          referenceId
        });
        skippedCount++;
        details.push({ userId: user.id, role: user.role, status: "skipped", reason: "ineligible_status" });
        continue;
      }

      // Check email verification if required
      if (requireVerified && !user.is_verified) {
        await rewardModel.logDailyReward({
          runDate: activePeriodKey,
          userId: user.id,
          role: user.role,
          status: "skipped",
          pointsAwarded: 0,
          reason: "Account email is not verified",
          referenceId
        });
        skippedCount++;
        details.push({ userId: user.id, role: user.role, status: "skipped", reason: "unverified" });
        continue;
      }

      // Check idempotency: check if transaction already exists for this user and period
      const existingTx = await rewardModel.findTransactionByReference(referenceId);
      if (existingTx) {
        skippedCount++;
        details.push({ userId: user.id, role: user.role, status: "skipped", reason: "already_awarded" });
        continue;
      }

      const pointsToAward = userRole === "farmer" ? farmerPoints : sellerPoints;
      if (pointsToAward <= 0) {
        skippedCount++;
        continue;
      }

      // Award points transactionally
      await db.query("BEGIN");
      try {
        await rewardModel.createPointsTransaction({
          userId: user.id,
          points: pointsToAward,
          transactionType: "daily_reward",
          reason: `Automatic 24-hour daily reward for ${activePeriodKey}`,
          orderId: null,
          referenceId,
          metadata: { periodKey: activePeriodKey, role: user.role, triggeredBy }
        });

        await userModel.updateUserPoints(user.id, pointsToAward, pointsToAward);

        await rewardModel.logDailyReward({
          runDate: activePeriodKey,
          userId: user.id,
          role: user.role,
          status: "awarded",
          pointsAwarded: pointsToAward,
          reason: `Granted ${pointsToAward} daily points`,
          referenceId
        });

        await db.query("COMMIT");

        awardedCount++;
        totalPointsAwarded += pointsToAward;
        details.push({ userId: user.id, role: user.role, status: "awarded", points: pointsToAward });
      } catch (awardErr) {
        await db.query("ROLLBACK");
        if (awardErr.code === "23505") {
          // Idempotent duplicate handled gracefully
          skippedCount++;
          details.push({ userId: user.id, role: user.role, status: "skipped", reason: "duplicate_prevented" });
        } else {
          console.error(`[scheduler] Failed to award points to user ${user.id}:`, awardErr.message);
          skippedCount++;
          details.push({ userId: user.id, role: user.role, status: "failed", error: awardErr.message });
        }
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(`[scheduler] Daily reward run complete in ${durationMs}ms: ${awardedCount} awarded, ${skippedCount} skipped.`);

    return {
      success: true,
      periodKey: activePeriodKey,
      processedCount,
      awardedCount,
      skippedCount,
      totalPointsAwarded,
      durationMs,
      details
    };
  } catch (err) {
    console.error("[scheduler error]", err);
    return { success: false, error: err.message };
  } finally {
    isJobRunning = false;
  }
}

/**
 * Initializes the node-cron scheduler according to database reward_settings
 */
async function initRewardScheduler() {
  try {
    const cronExpression = await settingsModel.getSetting("daily_reward_schedule_cron", "0 0 * * *");
    const timezone = await settingsModel.getSetting("daily_reward_timezone", "UTC");

    if (activeCronTask) {
      activeCronTask.stop();
      activeCronTask = null;
    }

    if (!cron.validate(cronExpression)) {
      console.warn(`[scheduler] Invalid cron expression '${cronExpression}', falling back to '0 0 * * *'`);
    }

    const validCron = cron.validate(cronExpression) ? cronExpression : "0 0 * * *";

    activeCronTask = cron.schedule(
      validCron,
      async () => {
        console.log(`[scheduler] Cron triggered at ${new Date().toISOString()}`);
        await processDailyRewards({ triggeredBy: "cron_schedule" });
      },
      {
        scheduled: true,
        timezone: timezone || "UTC"
      }
    );

    console.log(`[scheduler] Daily reward scheduler active: [${validCron}] in timezone ${timezone}`);

    // Run an initial lightweight check on startup (disabled during test runs)
    if (process.env.NODE_ENV !== "test") {
      setTimeout(() => {
        processDailyRewards({ triggeredBy: "startup_probe" }).catch(e => {
          console.warn("[scheduler startup probe]", e.message);
        });
      }, 3000);
    }
  } catch (err) {
    console.error("[scheduler init failed]", err.message);
  }
}

function stopRewardScheduler() {
  if (activeCronTask) {
    activeCronTask.stop();
    activeCronTask = null;
  }
}

module.exports = {
  initRewardScheduler,
  stopRewardScheduler,
  processDailyRewards,
  getPeriodKey
};

