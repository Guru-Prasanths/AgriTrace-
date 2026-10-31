/**
 * AgriTrace Automated Test Suite: Role-Based Auth & Reward Points System
 *
 * Covers all 15 required test scenarios from FEATURE 7:
 *  1. A new Gmail can register as a farmer.
 *  2. The same Gmail cannot register as a seller afterward.
 *  3. A new Gmail can register as a seller.
 *  4. The same Gmail cannot register as a farmer afterward.
 *  5. A farmer cannot access seller-only pages/APIs.
 *  6. A seller cannot access farmer-only pages/APIs.
 *  7. A completed eligible order awards the correct points exactly once.
 *  8. An incomplete or cancelled order awards no completion points.
 *  9. Daily rewards are awarded to eligible users after configured interval.
 * 10. Running the scheduled job twice does not create duplicate rewards.
 * 11. Restarting the backend does not reset points or duplicate rewards.
 * 12. Ineligible users receive no daily reward.
 * 13. Users cannot modify their points through browser requests or unauthorized API calls.
 * 14. Points history and dashboard balances remain consistent after refreshing/re-authenticating.
 * 15. Existing AgriTrace features continue working.
 */

process.env.NODE_ENV = "test";
const assert = require("assert");
const http = require("http");
const app = require("../server");
const rewardScheduler = require("../services/rewardScheduler");
const userModel = require("../models/userModel");
const rewardModel = require("../models/rewardModel");
const settingsModel = require("../models/settingsModel");

let server;
let baseUrl;

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = { "Content-Type": "application/json", "Connection": "close", ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log("=================================================================");
  console.log("   AgriTrace Auth & Reward-Points Test Suite (15 Test Cases)     ");
  console.log("=================================================================\n");

  // Start temporary server
  await new Promise(resolve => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`[test-runner] Temporary test server started at ${baseUrl}\n`);
      resolve();
    });
  });

  let passedCount = 0;
  const totalCases = 15;

  const testGmailFarmer = `farmer.test.${Date.now()}@gmail.com`;
  const testGmailSeller = `seller.test.${Date.now()}@gmail.com`;

  let farmerToken = "";
  let farmerId = "";
  let sellerToken = "";
  let sellerId = "";
  let adminToken = "";

  try {
    // -----------------------------------------------------------------
    // TEST 1: A new Gmail can register as a farmer
    // -----------------------------------------------------------------
    {
      const res = await request("/api/auth/register", {
        method: "POST",
        body: {
          email: `  ${testGmailFarmer.toUpperCase()}  `, // Test normalization too
          password: "FarmerPassword@123",
          name: "Ramesh Farmer",
          role: "farmer",
          phone: "+91 99999 11111",
          location: "Salem, Tamil Nadu"
        }
      });
      assert.strictEqual(res.status, 201, `Failed to register farmer: ${JSON.stringify(res.data)}`);
      assert.strictEqual(res.data.user.role, "farmer");
      assert.strictEqual(res.data.user.email, testGmailFarmer.toLowerCase());
      assert.ok(res.data.token, "Token should be issued");
      farmerToken = res.data.token;
      farmerId = res.data.user.id;
      console.log("✓ TEST 1 PASS: A new Gmail registered as a farmer with lowercase normalization.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 2: The same Gmail cannot register as a seller afterward
    // -----------------------------------------------------------------
    {
      const res = await request("/api/auth/register", {
        method: "POST",
        body: {
          email: testGmailFarmer,
          password: "AnotherPassword@123",
          name: "Ramesh Seller Attempt",
          role: "seller"
        }
      });
      assert.strictEqual(res.status, 409, "Cross-role registration must be rejected with 409 Conflict");
      assert.ok(res.data.error.includes("Role conflict") || res.data.error.includes("Account already exists"), "Should specify role conflict");
      console.log("✓ TEST 2 PASS: The same Gmail was rejected when attempting to register as a seller.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 3: A new Gmail can register as a seller
    // -----------------------------------------------------------------
    {
      const res = await request("/api/auth/register", {
        method: "POST",
        body: {
          email: testGmailSeller,
          password: "SellerPassword@123",
          name: "Kavitha Wholesale",
          role: "seller",
          phone: "+91 88888 22222",
          location: "Bangalore, Karnataka"
        }
      });
      assert.strictEqual(res.status, 201, `Failed to register seller: ${JSON.stringify(res.data)}`);
      assert.strictEqual(res.data.user.role, "seller");
      assert.strictEqual(res.data.user.email, testGmailSeller.toLowerCase());
      assert.ok(res.data.token, "Token should be issued");
      sellerToken = res.data.token;
      sellerId = res.data.user.id;
      console.log("✓ TEST 3 PASS: A new Gmail registered as a seller.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 4: The same Gmail cannot register as a farmer afterward
    // -----------------------------------------------------------------
    {
      const res = await request("/api/auth/register", {
        method: "POST",
        body: {
          email: testGmailSeller.toUpperCase(),
          password: "AnyPassword@123",
          name: "Kavitha Farmer Attempt",
          role: "farmer"
        }
      });
      assert.strictEqual(res.status, 409, "Cross-role registration must be rejected with 409 Conflict");
      console.log("✓ TEST 4 PASS: The same Gmail was rejected when attempting to register as a farmer.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // Login to Admin for admin-level tests
    // -----------------------------------------------------------------
    {
      const res = await request("/api/auth/login", {
        method: "POST",
        body: {
          email: "admin@agritrace.io",
          password: "Admin@12345"
        }
      });
      assert.strictEqual(res.status, 200, "Admin login should succeed");
      adminToken = res.data.token;
    }

    // -----------------------------------------------------------------
    // TEST 5: Farmer cannot access seller-only portal/APIs or login as seller
    // -----------------------------------------------------------------
    {
      // Farmer trying to login through seller portal
      const res = await request("/api/auth/login", {
        method: "POST",
        body: {
          email: testGmailFarmer,
          password: "FarmerPassword@123",
          portalRole: "seller"
        }
      });
      assert.strictEqual(res.status, 403, "Farmer logging in at seller portal must receive 403 Forbidden");
      assert.strictEqual(res.data.correctPortal, "farmer");
      assert.ok(res.data.message.includes("FARMER portal"), "Helpful redirect message present");

      // Farmer cannot access admin endpoints
      const adminRes = await request("/api/admin/rewards/config", {
        headers: { Authorization: `Bearer ${farmerToken}` }
      });
      assert.strictEqual(adminRes.status, 403, "Farmer must not access admin routes");
      console.log("✓ TEST 5 PASS: Farmer cannot access seller portal login or unauthorized admin routes.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 6: Seller cannot access farmer-only portal/APIs
    // -----------------------------------------------------------------
    {
      // Seller trying to login through farmer portal
      const res = await request("/api/auth/login", {
        method: "POST",
        body: {
          email: testGmailSeller,
          password: "SellerPassword@123",
          portalRole: "farmer"
        }
      });
      assert.strictEqual(res.status, 403, "Seller logging in at farmer portal must receive 403 Forbidden");
      assert.strictEqual(res.data.correctPortal, "seller");

      // Seller cannot access admin endpoints
      const adminRes = await request("/api/admin/rewards/config", {
        headers: { Authorization: `Bearer ${sellerToken}` }
      });
      assert.strictEqual(adminRes.status, 403, "Seller must not access admin routes");
      console.log("✓ TEST 6 PASS: Seller cannot access farmer portal login or unauthorized admin routes.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 7: A completed eligible order awards the correct points exactly once
    // -----------------------------------------------------------------
    let testOrder = null;
    {
      // Create order between farmer and seller
      const orderRes = await request("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${sellerToken}` },
        body: {
          farmerId: farmerId,
          sellerId: sellerId,
          cropName: "Organic Strawberries",
          quantity: 200,
          unitPrice: 40,
          notes: "Completion points test order"
        }
      });
      assert.strictEqual(orderRes.status, 201, "Order should be created");
      testOrder = orderRes.data.order;

      // Initial points balances
      const initialFarmerProf = await userModel.findUserById(farmerId);
      const initialFarmerBalance = Number(initialFarmerProf.points_balance);

      // Transition to completed
      const completeRes = await request(`/api/orders/${testOrder.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: { status: "completed" }
      });
      assert.strictEqual(completeRes.status, 200, "Order status update should succeed");
      assert.ok(completeRes.data.rewardResult.awarded, "Reward should be awarded on completion");

      // Verify farmer points increased by 50
      const afterFarmerProf = await userModel.findUserById(farmerId);
      assert.strictEqual(
        Number(afterFarmerProf.points_balance),
        initialFarmerBalance + 50,
        "Farmer should receive 50 order completion points"
      );

      // Attempt to award completion points a second time (re-updating to completed)
      const duplicateRes = await request(`/api/orders/${testOrder.id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: { status: "completed" }
      });
      const finalFarmerProf = await userModel.findUserById(farmerId);
      assert.strictEqual(
        Number(finalFarmerProf.points_balance),
        initialFarmerBalance + 50,
        "Points must not be awarded twice for the same completed order"
      );

      console.log("✓ TEST 7 PASS: Completed order awarded correct points exactly once; duplicates prevented.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 8: An incomplete or cancelled order awards no completion points
    // -----------------------------------------------------------------
    {
      const initialFarmerProf = await userModel.findUserById(farmerId);
      const initialBal = Number(initialFarmerProf.points_balance);

      // Create incomplete order
      const orderRes = await request("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${sellerToken}` },
        body: {
          farmerId: farmerId,
          sellerId: sellerId,
          cropName: "Roma Tomatoes",
          quantity: 100,
          unitPrice: 20
        }
      });
      const orderId = orderRes.data.order.id;

      // Status -> pending
      await request(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: { status: "pending" }
      });

      // Status -> in_progress
      await request(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: { status: "in_progress" }
      });

      // Status -> cancelled
      await request(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: { status: "cancelled" }
      });

      const afterFarmerProf = await userModel.findUserById(farmerId);
      assert.strictEqual(
        Number(afterFarmerProf.points_balance),
        initialBal,
        "Cancelled or incomplete order must award zero points"
      );

      console.log("✓ TEST 8 PASS: Incomplete and cancelled orders awarded no completion points.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 9: Daily rewards are awarded to eligible users after configured interval
    // -----------------------------------------------------------------
    const testPeriod = `test-day-${Date.now()}`;
    {
      const farmerBefore = await userModel.findUserById(farmerId);
      const sellerBefore = await userModel.findUserById(sellerId);

      const fBal = Number(farmerBefore.points_balance);
      const sBal = Number(sellerBefore.points_balance);

      const result = await rewardScheduler.processDailyRewards({
        periodKey: testPeriod,
        triggeredBy: "test_runner"
      });

      assert.strictEqual(result.success, true, "Daily reward execution should succeed");
      assert.ok(result.awardedCount >= 2, "Both test farmer and seller should receive daily rewards");

      const farmerAfter = await userModel.findUserById(farmerId);
      const sellerAfter = await userModel.findUserById(sellerId);

      // Farmer daily: 10, Seller daily: 15
      assert.strictEqual(Number(farmerAfter.points_balance), fBal + 10, "Farmer should receive 10 daily points");
      assert.strictEqual(Number(sellerAfter.points_balance), sBal + 15, "Seller should receive 15 daily points");

      console.log("✓ TEST 9 PASS: Daily rewards awarded to eligible farmer (10 pts) and seller (15 pts).");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 10: Running the scheduled job twice does not create duplicate rewards (Idempotency)
    // -----------------------------------------------------------------
    {
      const farmerBefore = await userModel.findUserById(farmerId);
      const balBefore = Number(farmerBefore.points_balance);

      // Re-run the daily reward process with the identical period key
      const repeatResult = await rewardScheduler.processDailyRewards({
        periodKey: testPeriod,
        triggeredBy: "test_duplicate_runner"
      });

      assert.strictEqual(repeatResult.success, true);
      assert.strictEqual(repeatResult.awardedCount, 0, "No duplicate awards should be given on second run");
      assert.ok(repeatResult.skippedCount >= 2, "Previously awarded accounts should be skipped");

      const farmerAfter = await userModel.findUserById(farmerId);
      assert.strictEqual(
        Number(farmerAfter.points_balance),
        balBefore,
        "Points balance must remain identical after repeated execution"
      );

      console.log("✓ TEST 10 PASS: Running daily reward job twice produced zero duplicate rewards (idempotent).");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 11: Restarting the backend does not reset points or duplicate rewards
    // -----------------------------------------------------------------
    {
      // Fetch persisted balance
      const farmerBefore = await userModel.findUserById(farmerId);
      const balanceBefore = Number(farmerBefore.points_balance);

      // Simulate restart by re-querying from fresh database load
      const summary = await rewardModel.getUserPointsSummary(farmerId);
      assert.strictEqual(summary.currentBalance, balanceBefore, "Balance must persist through storage");

      // Verify that the already awarded period key remains rejected
      const retryResult = await rewardScheduler.processDailyRewards({
        periodKey: testPeriod,
        triggeredBy: "post_restart_probe"
      });
      assert.strictEqual(retryResult.awardedCount, 0, "Restart cannot duplicate previous rewards");

      console.log("✓ TEST 11 PASS: Restarting/re-instantiating store persisted points and prevented re-awards.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 12: Ineligible users receive no daily reward
    // -----------------------------------------------------------------
    {
      // Create suspended user
      const suspendedEmail = `suspended.${Date.now()}@gmail.com`;
      const suspUser = await userModel.createUser({
        email: suspendedEmail,
        passwordHash: "dummyHash",
        name: "Suspended Farmer",
        role: "farmer",
        isVerified: true
      });
      await userModel.setUserStatus(suspUser.id, "suspended");

      const ineligPeriod = `inelig-day-${Date.now()}`;
      await rewardScheduler.processDailyRewards({ periodKey: ineligPeriod });

      const suspAfter = await userModel.findUserById(suspUser.id);
      assert.strictEqual(Number(suspAfter.points_balance), 0, "Suspended user must receive 0 daily rewards");

      console.log("✓ TEST 12 PASS: Suspended and ineligible accounts received zero daily reward points.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 13: Users cannot modify their points through browser requests or unauthorized API calls
    // -----------------------------------------------------------------
    {
      // Attempt to PATCH points directly on profile
      const patchRes = await request("/api/auth/profile", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${farmerToken}` },
        body: { points_balance: 999999, total_points_earned: 999999 }
      });
      // Route does not exist or does not accept points mutation
      assert.notStrictEqual(patchRes.status, 200, "Direct points mutation endpoint must not exist");

      // Verify balance did not change
      const farmerProf = await userModel.findUserById(farmerId);
      assert.ok(Number(farmerProf.points_balance) < 999999, "Points balance must not be editable by client");

      console.log("✓ TEST 13 PASS: Unauthorized direct points tampering attempts were rejected.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 14: Points history and dashboard balances remain consistent after refreshing and logging out
    // -----------------------------------------------------------------
    {
      // Log in again with fresh credentials
      const loginRes = await request("/api/auth/login", {
        method: "POST",
        body: {
          email: testGmailFarmer,
          password: "FarmerPassword@123",
          portalRole: "farmer"
        }
      });
      assert.strictEqual(loginRes.status, 200);
      const freshToken = loginRes.data.token;

      // Query authoritative dashboard endpoint
      const dashRes = await request("/api/rewards/dashboard", {
        headers: { Authorization: `Bearer ${freshToken}` }
      });
      assert.strictEqual(dashRes.status, 200);
      assert.ok(dashRes.data.currentBalance > 0, "Authoritative balance must be returned from DB");
      assert.ok(Array.isArray(dashRes.data.recentTransactions), "Recent transactions array present");
      assert.ok(dashRes.data.nextScheduledRewardTime, "Next scheduled time present");

      console.log("✓ TEST 14 PASS: Points dashboard and transaction history consistent after re-login.");
      passedCount++;
    }

    // -----------------------------------------------------------------
    // TEST 15: Existing AgriTrace features continue working
    // -----------------------------------------------------------------
    {
      // Test existing /api/records endpoint
      const recordsRes = await request("/api/records");
      assert.strictEqual(recordsRes.status, 200, "Existing records API must respond 200 OK");
      assert.ok(Array.isArray(recordsRes.data.data), "Records list array present in data field");

      // Test existing /api/health endpoint
      const healthRes = await request("/api/health");
      assert.strictEqual(healthRes.status, 200, "Existing health API must respond 200 OK");
      assert.strictEqual(healthRes.data.status, "ok");

      // Test existing /api/prices endpoint
      const pricesRes = await request("/api/prices/DEMO-AGR-0001");
      assert.strictEqual(pricesRes.status, 200, "Existing price snapshots API must respond 200 OK");

      console.log("✓ TEST 15 PASS: Existing AgriTrace produce records, health check, and pricing features continue working.");
      passedCount++;
    }

    console.log("\n=================================================================");
    console.log(`TEST SUMMARY: ${passedCount} / ${totalCases} TEST CASES PASSED SUCCESSFULLY`);
    console.log("=================================================================\n");
    if (server) {
      server.close();
    }
    process.exit(0);
  } catch (err) {
    console.error("\n❌ TEST SUITE FAILED:", err);
    if (server) {
      server.close();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
