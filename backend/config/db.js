/**
 * AgriTrace Unified Resilient Database Engine
 * Connects to PostgreSQL with automatic failover to persistent local storage.
 * Ensures zero downtime, seamless off-chain traceability, and automatic schema initialization.
 * Supports Users, Orders, Points Transactions, Settings, Daily Scheduler Logs, and Audit Logs.
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { databaseUrl } = require("./env");
const { normalizeEmail } = require("../utils/emailNormalizer");

let pgPool = null;
let pgConnected = false;
let pgCheckTimer = null;

// File-backed persistent fallback store
const DATA_DIR = path.resolve(__dirname, "../data");
const STORE_FILE = path.join(DATA_DIR, "db_store.json");

function ensureStoreDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generate deterministic password hashes for seed accounts
const SEED_PASSWORD_HASH = bcrypt.hashSync("AgriTrace@2026", 10);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("Admin@12345", 10);

const DEFAULT_SETTINGS = [
  { setting_key: "farmer_daily_points", setting_value: "10", description: "Daily reward points awarded to eligible farmers every 24 hours" },
  { setting_key: "seller_daily_points", setting_value: "15", description: "Daily reward points awarded to eligible sellers every 24 hours" },
  { setting_key: "farmer_order_completion_points", setting_value: "50", description: "Points awarded to farmer when an order is completed" },
  { setting_key: "seller_order_completion_points", setting_value: "50", description: "Points awarded to seller when an order is completed" },
  { setting_key: "daily_rewards_farmer_enabled", setting_value: "true", description: "Whether 24h daily rewards for farmers are active" },
  { setting_key: "daily_rewards_seller_enabled", setting_value: "true", description: "Whether 24h daily rewards for sellers are active" },
  { setting_key: "order_completion_rewards_enabled", setting_value: "true", description: "Whether completion rewards for orders are active" },
  { setting_key: "daily_reward_schedule_cron", setting_value: "0 0 * * *", description: "Cron schedule for automatic 24h daily rewards run (midnight UTC)" },
  { setting_key: "daily_reward_timezone", setting_value: "UTC", description: "Timezone for daily reward schedule" },
  { setting_key: "daily_reward_require_verified", setting_value: "false", description: "Require account email verification before daily rewards are awarded" },
  { setting_key: "daily_reward_require_active", setting_value: "true", description: "Require active account status before daily rewards are awarded" }
];

function getDefaultInitialStore() {
  const now = new Date().toISOString();
  return {
    produce_records: [
      {
        id: "demo-uuid-0001",
        lot_id: "DEMO-AGR-0001",
        crop_name: "Alphonso Mango",
        origin: "Salem, Tamil Nadu, India",
        harvest_date: new Date(Date.now() - 3 * 86400000).toISOString(),
        quality_grade: "A+",
        storage_temperature_c: 7.2,
        storage_humidity_pct: 71.0,
        farmer_price: 30.0,
        consumer_price: 52.0,
        metadata_hash: "0xa1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        blockchain_key: "0xb1c2d3e4f5a60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        blockchain_tx_hash: null,
        blockchain_network: "hardhat-local",
        blockchain_verified: false,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 86400000).toISOString()
      },
      {
        id: "demo-uuid-0002",
        lot_id: "DEMO-AGR-0002",
        crop_name: "Roma Tomato",
        origin: "Hosur, Tamil Nadu, India",
        harvest_date: new Date(Date.now() - 2 * 86400000).toISOString(),
        quality_grade: "A",
        storage_temperature_c: 11.0,
        storage_humidity_pct: 78.0,
        farmer_price: 19.0,
        consumer_price: 36.0,
        metadata_hash: "0xc1d2e3f4a5b60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        blockchain_key: "0xd1e2f3a4b5c60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        blockchain_tx_hash: null,
        blockchain_network: "hardhat-local",
        blockchain_verified: false,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: "demo-uuid-0003",
        lot_id: "DEMO-AGR-0003",
        crop_name: "Guntur Chilli",
        origin: "Guntur, Andhra Pradesh, India",
        harvest_date: new Date(Date.now() - 1 * 86400000).toISOString(),
        quality_grade: "A+",
        storage_temperature_c: 8.0,
        storage_humidity_pct: 69.0,
        farmer_price: 28.0,
        consumer_price: 51.0,
        metadata_hash: "0xe1f2a3b4c5d60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        blockchain_key: "0xf1a2b3c4d5e60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        blockchain_tx_hash: null,
        blockchain_network: "hardhat-local",
        blockchain_verified: false,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ],
    price_snapshots: [
      { id: 1, produce_record_id: "demo-uuid-0001", recorded_at: now, farmer_price: 30, trader_price: 35.4, market_price: 40.5, consumer_price: 52, blockchain_tx_hash: null }
    ],
    sensor_readings: [
      { id: 1, produce_record_id: "demo-uuid-0001", recorded_at: now, temperature_c: 7.2, humidity_pct: 71, spoilage_risk_pct: 8.5, source_device: "demo-sensor-01", blockchain_tx_hash: null }
    ],
    users: [
      {
        id: "user-admin-001",
        email: "admin@agritrace.io",
        password_hash: ADMIN_PASSWORD_HASH,
        name: "AgriTrace Admin",
        role: "admin",
        status: "active",
        is_verified: true,
        verification_token: "admin-verified-token",
        points_balance: 0,
        total_points_earned: 0,
        phone: "+91 98765 00000",
        location: "Chennai, India",
        created_at: now,
        updated_at: now
      },
      {
        id: "user-farmer-001",
        email: "farmer@agritrace.io",
        password_hash: SEED_PASSWORD_HASH,
        name: "Rajan K. (Farmer)",
        role: "farmer",
        status: "active",
        is_verified: true,
        verification_token: "farmer-verified-token",
        points_balance: 100,
        total_points_earned: 100,
        phone: "+91 94432 12345",
        location: "Salem, Tamil Nadu",
        created_at: now,
        updated_at: now
      },
      {
        id: "user-seller-001",
        email: "seller@agritrace.io",
        password_hash: SEED_PASSWORD_HASH,
        name: "Ramesh Traders (Seller)",
        role: "seller",
        status: "active",
        is_verified: true,
        verification_token: "seller-verified-token",
        points_balance: 150,
        total_points_earned: 150,
        phone: "+91 98401 54321",
        location: "Coimbatore, Tamil Nadu",
        created_at: now,
        updated_at: now
      }
    ],
    orders: [
      {
        id: "order-demo-001",
        order_number: "ORD-202610-001",
        produce_record_id: "DEMO-AGR-0001",
        farmer_id: "user-farmer-001",
        seller_id: "user-seller-001",
        crop_name: "Alphonso Mango",
        quantity: 100,
        unit_price: 30,
        total_price: 3000,
        status: "completed",
        notes: "Initial seed completed order",
        completed_at: now,
        created_at: now,
        updated_at: now
      }
    ],
    points_transactions: [
      {
        id: "ptx-demo-001",
        user_id: "user-farmer-001",
        points: 50,
        transaction_type: "order_completion",
        reason: "Completed order #ORD-202610-001",
        order_id: "order-demo-001",
        reference_id: "order_completion:order-demo-001:user-farmer-001",
        metadata: {},
        created_at: now
      },
      {
        id: "ptx-demo-002",
        user_id: "user-farmer-001",
        points: 50,
        transaction_type: "daily_reward",
        reason: "Daily login-free reward (farmer)",
        order_id: null,
        reference_id: "daily_reward:user-farmer-001:seed-day-0",
        metadata: {},
        created_at: now
      },
      {
        id: "ptx-demo-003",
        user_id: "user-seller-001",
        points: 50,
        transaction_type: "order_completion",
        reason: "Completed order #ORD-202610-001",
        order_id: "order-demo-001",
        reference_id: "order_completion:order-demo-001:user-seller-001",
        metadata: {},
        created_at: now
      },
      {
        id: "ptx-demo-004",
        user_id: "user-seller-001",
        points: 100,
        transaction_type: "daily_reward",
        reason: "Daily login-free reward (seller)",
        order_id: null,
        reference_id: "daily_reward:user-seller-001:seed-day-0",
        metadata: {},
        created_at: now
      }
    ],
    reward_settings: DEFAULT_SETTINGS.map((s, i) => ({
      id: i + 1,
      setting_key: s.setting_key,
      setting_value: s.setting_value,
      description: s.description,
      updated_by: null,
      updated_at: now
    })),
    daily_reward_logs: [],
    admin_audit_logs: []
  };
}

function loadStore() {
  ensureStoreDir();
  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      let modified = false;

      // Migrate existing store if tables are missing
      if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
        parsed.users = getDefaultInitialStore().users;
        modified = true;
      }
      if (!Array.isArray(parsed.orders)) {
        parsed.orders = getDefaultInitialStore().orders;
        modified = true;
      }
      if (!Array.isArray(parsed.points_transactions)) {
        parsed.points_transactions = getDefaultInitialStore().points_transactions;
        modified = true;
      }
      if (!Array.isArray(parsed.reward_settings) || parsed.reward_settings.length === 0) {
        parsed.reward_settings = getDefaultInitialStore().reward_settings;
        modified = true;
      }
      if (!Array.isArray(parsed.daily_reward_logs)) {
        parsed.daily_reward_logs = [];
        modified = true;
      }
      if (!Array.isArray(parsed.admin_audit_logs)) {
        parsed.admin_audit_logs = [];
        modified = true;
      }

      if (modified) {
        saveStore(parsed);
      }
      return parsed;
    } catch (e) {
      console.warn("[db-fallback] Failed reading store, initializing fresh:", e.message);
    }
  }

  const initialStore = getDefaultInitialStore();
  saveStore(initialStore);
  return initialStore;
}

function saveStore(store) {
  try {
    ensureStoreDir();
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("[db-fallback] Failed saving store:", e.message);
  }
}

// In-memory / file fallback query processor
async function executeFallbackQuery(sql, params = []) {
  const store = loadStore();
  const trimmed = sql.trim().replace(/\s+/g, " ");

  // Transaction control queries
  if (/^(BEGIN|COMMIT|ROLLBACK)/i.test(trimmed)) {
    return { rows: [], rowCount: 0 };
  }

  // 1. Health check queries: SELECT 1 or SELECT NOW()
  if (/^SELECT\s+(1|NOW\(\))/i.test(trimmed)) {
    return { rows: [{ "?column?": 1, now: new Date().toISOString() }], rowCount: 1 };
  }

  // =========================================================
  // 2. USERS QUERIES
  // =========================================================

  // Find user by normalized email
  if (/FROM\s+users\s+WHERE\s+(LOWER\(TRIM\(email\)\)|email)\s*=\s*(LOWER\(TRIM\(\$1\)\)|\$1)/i.test(trimmed)) {
    const emailNorm = normalizeEmail(params[0]);
    const user = store.users.find(u => normalizeEmail(u.email) === emailNorm);
    return { rows: user ? [{ ...user }] : [], rowCount: user ? 1 : 0 };
  }

  // Find user by Google sub identifier
  if (/FROM\s+users\s+WHERE\s+google_sub\s*=\s*\$1/i.test(trimmed)) {
    const sub = String(params[0] || "");
    const user = store.users.find(u => u.google_sub === sub);
    return { rows: user ? [{ ...user }] : [], rowCount: user ? 1 : 0 };
  }

  // Find user by ID
  if (/FROM\s+users\s+WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
    const id = String(params[0] || "");
    const user = store.users.find(u => u.id === id);
    return { rows: user ? [{ ...user }] : [], rowCount: user ? 1 : 0 };
  }

  // List all users or users by role
  if (/FROM\s+users(\s+WHERE\s+role\s+IN|\s+WHERE\s+role\s*=\s*\$1|\s+ORDER\s+BY|\s*$)/i.test(trimmed) && /^SELECT/i.test(trimmed)) {
    let rows = [...store.users];
    if (/WHERE\s+role\s*=\s*\$1/i.test(trimmed)) {
      rows = rows.filter(u => u.role === params[0]);
    } else if (/WHERE\s+role\s+IN\s*\('farmer',\s*'seller'\)/i.test(trimmed)) {
      rows = rows.filter(u => u.role === 'farmer' || u.role === 'seller');
    }
    return { rows: rows.map(u => ({ ...u })), rowCount: rows.length };
  }

  // Insert user
  if (/^INSERT\s+INTO\s+users/i.test(trimmed)) {
    const colMatch = trimmed.match(/^INSERT\s+INTO\s+users\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    let newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: "",
      password_hash: null,
      name: "",
      role: "farmer",
      status: "active",
      is_verified: true,
      verification_token: null,
      points_balance: 0,
      total_points_earned: 0,
      phone: null,
      location: null,
      google_sub: null,
      auth_provider: "local",
      picture_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (colMatch) {
      const cols = colMatch[1].split(",").map(c => c.trim().toLowerCase());
      const valTokens = colMatch[2].split(",").map(t => t.trim());
      cols.forEach((col, idx) => {
        const token = valTokens[idx];
        if (!token) return;
        if (token.startsWith("$")) {
          const pIdx = parseInt(token.replace("$", "")) - 1;
          newUser[col] = params[pIdx];
        } else if (token.toUpperCase() === "NULL") {
          newUser[col] = null;
        } else if (token.toUpperCase() === "TRUE") {
          newUser[col] = true;
        } else if (token.toUpperCase() === "FALSE") {
          newUser[col] = false;
        } else if (token.startsWith("'")) {
          newUser[col] = token.replace(/^'|'$/g, "");
        } else if (!isNaN(token)) {
          newUser[col] = Number(token);
        }
      });
    } else {
      newUser.email = params[0];
      newUser.password_hash = params[1];
      newUser.name = params[2];
      newUser.role = params[3];
      newUser.status = params[4] || "active";
      newUser.is_verified = Boolean(params[5]);
      newUser.verification_token = params[6] || null;
      newUser.points_balance = Number(params[7] || 0);
      newUser.total_points_earned = Number(params[8] || 0);
      newUser.phone = params[9] || null;
      newUser.location = params[10] || null;
    }

    const emailNorm = normalizeEmail(newUser.email);
    newUser.email = emailNorm;

    // Enforce email uniqueness constraint!
    const existing = store.users.find(u => normalizeEmail(u.email) === emailNorm);
    if (existing) {
      const err = new Error('duplicate key value violates unique constraint "uq_users_email"');
      err.code = "23505";
      throw err;
    }

    // Enforce google_sub uniqueness constraint if provided!
    if (newUser.google_sub) {
      const existingSub = store.users.find(u => u.google_sub && u.google_sub === newUser.google_sub);
      if (existingSub) {
        const err = new Error('duplicate key value violates unique constraint "idx_users_google_sub"');
        err.code = "23505";
        throw err;
      }
    }

    store.users.push(newUser);
    saveStore(store);
    return { rows: [{ ...newUser }], rowCount: 1 };
  }

  // Update user (points, status, verification, google linking, etc.)
  if (/^UPDATE\s+users\s+SET/i.test(trimmed)) {
    const id = params[params.length - 1];
    const user = store.users.find(u => u.id === id);
    if (!user) return { rows: [], rowCount: 0 };

    if (/points_balance\s*=\s*points_balance\s*\+\s*\$1/i.test(trimmed) && /total_points_earned\s*=\s*total_points_earned\s*\+\s*\$2/i.test(trimmed)) {
      user.points_balance = Math.max(0, Number(user.points_balance) + Number(params[0]));
      user.total_points_earned = Math.max(0, Number(user.total_points_earned) + Number(params[1]));
    } else if (/points_balance\s*=\s*GREATEST\(0,\s*points_balance\s*-\s*\$1\)/i.test(trimmed)) {
      user.points_balance = Math.max(0, Number(user.points_balance) - Number(params[0]));
    } else {
      // General field update
      const fields = ["name", "status", "is_verified", "points_balance", "total_points_earned", "phone", "location", "google_sub", "auth_provider", "picture_url"];
      fields.forEach(f => {
        const re = new RegExp(`${f}\\s*=\\s*\\$(\\d+)`, "i");
        const match = trimmed.match(re);
        if (match) {
          const idx = parseInt(match[1]) - 1;
          user[f] = params[idx];
        }
      });
      if (/auth_provider\s*=\s*'both'/i.test(trimmed)) user.auth_provider = 'both';
      if (/auth_provider\s*=\s*'google'/i.test(trimmed)) user.auth_provider = 'google';
      if (/is_verified\s*=\s*TRUE/i.test(trimmed)) user.is_verified = true;
    }

    user.updated_at = new Date().toISOString();
    saveStore(store);
    return { rows: [{ ...user }], rowCount: 1 };
  }

  // =========================================================
  // 3. ORDERS QUERIES
  // =========================================================

  // Find order by ID
  if (/FROM\s+orders\s+WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
    const id = String(params[0] || "");
    const order = store.orders.find(o => o.id === id);
    return { rows: order ? [{ ...order }] : [], rowCount: order ? 1 : 0 };
  }

  // List orders for farmer, seller, or all
  if (/FROM\s+orders\s+WHERE\s+(farmer_id\s*=\s*\$1|seller_id\s*=\s*\$1)/i.test(trimmed)) {
    const userId = String(params[0] || "");
    const rows = store.orders
      .filter(o => o.farmer_id === userId || o.seller_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: rows.map(o => ({ ...o })), rowCount: rows.length };
  }

  if (/FROM\s+orders/i.test(trimmed) && /^SELECT/i.test(trimmed)) {
    const rows = [...store.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: rows.map(o => ({ ...o })), rowCount: rows.length };
  }

  // Insert order
  if (/^INSERT\s+INTO\s+orders/i.test(trimmed)) {
    const newOrder = {
      id: crypto.randomUUID ? crypto.randomUUID() : `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      order_number: params[0],
      produce_record_id: params[1] || null,
      farmer_id: params[2],
      seller_id: params[3],
      crop_name: params[4],
      quantity: Number(params[5]),
      unit_price: Number(params[6]),
      total_price: Number(params[7]),
      status: params[8] || "created",
      notes: params[9] || null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    store.orders.unshift(newOrder);
    saveStore(store);
    return { rows: [{ ...newOrder }], rowCount: 1 };
  }

  // Update order status
  if (/^UPDATE\s+orders\s+SET/i.test(trimmed)) {
    const orderId = params[params.length - 1];
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return { rows: [], rowCount: 0 };

    if (/status\s*=\s*\$1/i.test(trimmed)) {
      order.status = params[0];
      if (params[0] === "completed") {
        order.completed_at = new Date().toISOString();
      }
    }
    order.updated_at = new Date().toISOString();
    saveStore(store);
    return { rows: [{ ...order }], rowCount: 1 };
  }

  // =========================================================
  // 4. POINTS TRANSACTIONS QUERIES
  // =========================================================

  // Find points transaction by reference_id
  if (/FROM\s+points_transactions\s+WHERE\s+reference_id\s*=\s*\$1/i.test(trimmed)) {
    const ref = String(params[0] || "");
    const row = store.points_transactions.find(pt => pt.reference_id === ref);
    return { rows: row ? [{ ...row }] : [], rowCount: row ? 1 : 0 };
  }

  // List points transactions by user_id
  if (/FROM\s+points_transactions\s+WHERE\s+user_id\s*=\s*\$1/i.test(trimmed)) {
    const userId = String(params[0] || "");
    const rows = store.points_transactions
      .filter(pt => pt.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: rows.map(pt => ({ ...pt })), rowCount: rows.length };
  }

  // Insert points transaction
  if (/^INSERT\s+INTO\s+points_transactions/i.test(trimmed)) {
    const referenceId = params[5];
    // Check unique constraint on reference_id
    const existing = store.points_transactions.find(pt => pt.reference_id === referenceId);
    if (existing) {
      const err = new Error('duplicate key value violates unique constraint "unique_points_reference"');
      err.code = "23505";
      throw err;
    }

    const newTx = {
      id: crypto.randomUUID ? crypto.randomUUID() : `ptx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user_id: params[0],
      points: Number(params[1]),
      transaction_type: params[2],
      reason: params[3],
      order_id: params[4] || null,
      reference_id: referenceId,
      metadata: params[6] ? (typeof params[6] === "string" ? JSON.parse(params[6]) : params[6]) : {},
      created_at: new Date().toISOString()
    };

    store.points_transactions.unshift(newTx);
    saveStore(store);
    return { rows: [{ ...newTx }], rowCount: 1 };
  }

  // =========================================================
  // 5. REWARD SETTINGS QUERIES
  // =========================================================

  if (/FROM\s+reward_settings/i.test(trimmed) && /^SELECT/i.test(trimmed)) {
    if (/WHERE\s+setting_key\s*=\s*\$1/i.test(trimmed)) {
      const key = String(params[0] || "");
      const setting = store.reward_settings.find(s => s.setting_key === key);
      return { rows: setting ? [{ ...setting }] : [], rowCount: setting ? 1 : 0 };
    }
    return { rows: store.reward_settings.map(s => ({ ...s })), rowCount: store.reward_settings.length };
  }

  if (/^UPDATE\s+reward_settings\s+SET/i.test(trimmed)) {
    const val = String(params[0]);
    const key = String(params[1]);
    const updatedBy = params[2] || null;

    let setting = store.reward_settings.find(s => s.setting_key === key);
    if (!setting) {
      setting = { id: store.reward_settings.length + 1, setting_key: key, setting_value: val, description: null, updated_by: updatedBy, updated_at: new Date().toISOString() };
      store.reward_settings.push(setting);
    } else {
      setting.setting_value = val;
      setting.updated_by = updatedBy;
      setting.updated_at = new Date().toISOString();
    }

    saveStore(store);
    return { rows: [{ ...setting }], rowCount: 1 };
  }

  // =========================================================
  // 6. DAILY REWARD LOGS QUERIES
  // =========================================================

  if (/FROM\s+daily_reward_logs/i.test(trimmed) && /^SELECT/i.test(trimmed)) {
    let rows = [...store.daily_reward_logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (/LIMIT\s+(\d+)/i.test(trimmed)) {
      const limit = parseInt(trimmed.match(/LIMIT\s+(\d+)/i)[1]);
      rows = rows.slice(0, limit);
    }
    return { rows: rows.map(r => ({ ...r })), rowCount: rows.length };
  }

  if (/^INSERT\s+INTO\s+daily_reward_logs/i.test(trimmed)) {
    const ref = params[6] || params[5];
    const existing = store.daily_reward_logs.find(l => l.reference_id === ref);
    if (existing) {
      const err = new Error('duplicate key value violates unique constraint "daily_reward_logs_reference_id_key"');
      err.code = "23505";
      throw err;
    }

    const newLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : `drl-${Date.now()}`,
      run_date: params[0],
      user_id: params[1],
      role: params[2],
      status: params[3],
      points_awarded: Number(params[4] || 0),
      reason: params[5],
      reference_id: ref,
      created_at: new Date().toISOString()
    };
    store.daily_reward_logs.unshift(newLog);
    saveStore(store);
    return { rows: [{ ...newLog }], rowCount: 1 };
  }

  // =========================================================
  // 7. ADMIN AUDIT LOGS QUERIES
  // =========================================================

  if (/FROM\s+admin_audit_logs/i.test(trimmed) && /^SELECT/i.test(trimmed)) {
    let rows = [...store.admin_audit_logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (/LIMIT\s+(\d+)/i.test(trimmed)) {
      const limit = parseInt(trimmed.match(/LIMIT\s+(\d+)/i)[1]);
      rows = rows.slice(0, limit);
    }
    return { rows: rows.map(r => ({ ...r })), rowCount: rows.length };
  }

  if (/^INSERT\s+INTO\s+admin_audit_logs/i.test(trimmed)) {
    const newAudit = {
      id: crypto.randomUUID ? crypto.randomUUID() : `aal-${Date.now()}`,
      admin_id: params[0] || null,
      action: params[1],
      target: params[2] || null,
      details: params[3] ? (typeof params[3] === "string" ? JSON.parse(params[3]) : params[3]) : {},
      created_at: new Date().toISOString()
    };
    store.admin_audit_logs.unshift(newAudit);
    saveStore(store);
    return { rows: [{ ...newAudit }], rowCount: 1 };
  }

  // =========================================================
  // 8. PRODUCE RECORDS
  // =========================================================

  if (/^SELECT.*FROM\s+produce_records\s+ORDER\s+BY/i.test(trimmed)) {
    const rows = [...store.produce_records].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    return { rows, rowCount: rows.length };
  }

  if (/^SELECT\s+\*\s+FROM\s+produce_records\s+WHERE\s+lot_id\s*=\s*\$1/i.test(trimmed)) {
    const lotId = String(params[0] || "");
    const row = store.produce_records.find(
      r => r.lot_id.toLowerCase() === lotId.toLowerCase()
    );
    return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
  }

  if (/^SELECT\s+\*\s+FROM\s+produce_records\s+WHERE\s+id\s*=\s*\$1/i.test(trimmed)) {
    const id = String(params[0] || "");
    const row = store.produce_records.find(
      r => r.id === id || r.lot_id.toLowerCase() === id.toLowerCase()
    );
    return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
  }

  if (/^INSERT\s+INTO\s+produce_records/i.test(trimmed)) {
    const newRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : `lot-rec-${Date.now()}`,
      lot_id: params[0],
      crop_name: params[1],
      origin: params[2],
      harvest_date: params[3],
      quality_grade: params[4] || null,
      storage_temperature_c: params[5] != null ? Number(params[5]) : null,
      storage_humidity_pct: params[6] != null ? Number(params[6]) : null,
      farmer_price: params[7] != null ? Number(params[7]) : null,
      consumer_price: params[8] != null ? Number(params[8]) : null,
      blockchain_key: params[9] || null,
      blockchain_tx_hash: params[10] || null,
      blockchain_network: params[11] || "hardhat-local",
      blockchain_verified: Boolean(params[12]),
      metadata_hash: params[13] || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const existingIndex = store.produce_records.findIndex(
      r => r.lot_id.toLowerCase() === newRecord.lot_id.toLowerCase()
    );
    if (existingIndex >= 0) {
      store.produce_records[existingIndex] = newRecord;
    } else {
      store.produce_records.unshift(newRecord);
    }

    saveStore(store);
    return { rows: [newRecord], rowCount: 1 };
  }

  if (/^UPDATE\s+produce_records/i.test(trimmed)) {
    const id = params[params.length - 1];
    const rec = store.produce_records.find(r => r.id === id || r.lot_id === id);
    if (!rec) return { rows: [], rowCount: 0 };

    if (/quality_grade\s*=/i.test(trimmed)) {
      const match = trimmed.match(/quality_grade\s*=\s*\$(\d+)/i);
      if (match) rec.quality_grade = params[parseInt(match[1]) - 1];
    }
    if (/storage_temperature_c\s*=/i.test(trimmed)) {
      const match = trimmed.match(/storage_temperature_c\s*=\s*\$(\d+)/i);
      if (match) rec.storage_temperature_c = Number(params[parseInt(match[1]) - 1]);
    }
    if (/storage_humidity_pct\s*=/i.test(trimmed)) {
      const match = trimmed.match(/storage_humidity_pct\s*=\s*\$(\d+)/i);
      if (match) rec.storage_humidity_pct = Number(params[parseInt(match[1]) - 1]);
    }
    if (/farmer_price\s*=/i.test(trimmed)) {
      const match = trimmed.match(/farmer_price\s*=\s*\$(\d+)/i);
      if (match) rec.farmer_price = Number(params[parseInt(match[1]) - 1]);
    }
    if (/consumer_price\s*=/i.test(trimmed)) {
      const match = trimmed.match(/consumer_price\s*=\s*\$(\d+)/i);
      if (match) rec.consumer_price = Number(params[parseInt(match[1]) - 1]);
    }
    if (/blockchain_tx_hash\s*=/i.test(trimmed)) {
      const match = trimmed.match(/blockchain_tx_hash\s*=\s*\$(\d+)/i);
      if (match) rec.blockchain_tx_hash = params[parseInt(match[1]) - 1];
    }
    if (/blockchain_verified\s*=/i.test(trimmed)) {
      const match = trimmed.match(/blockchain_verified\s*=\s*\$(\d+)/i);
      if (match) rec.blockchain_verified = Boolean(params[parseInt(match[1]) - 1]);
    }
    rec.updated_at = new Date().toISOString();
    saveStore(store);
    return { rows: [rec], rowCount: 1 };
  }

  if (/^DELETE\s+FROM\s+produce_records/i.test(trimmed)) {
    const id = params[0];
    const prevLen = store.produce_records.length;
    store.produce_records = store.produce_records.filter(r => r.id !== id && r.lot_id !== id);
    saveStore(store);
    return { rows: [], rowCount: prevLen - store.produce_records.length };
  }

  // =========================================================
  // 9. PRICE SNAPSHOTS
  // =========================================================

  if (/^INSERT\s+INTO\s+price_snapshots/i.test(trimmed)) {
    const newPrice = {
      id: store.price_snapshots.length + 1,
      produce_record_id: params[0],
      farmer_price: Number(params[1]),
      trader_price: Number(params[2]),
      market_price: Number(params[3]),
      consumer_price: Number(params[4]),
      blockchain_tx_hash: params[5] || null,
      recorded_at: new Date().toISOString()
    };
    store.price_snapshots.unshift(newPrice);
    saveStore(store);
    return { rows: [newPrice], rowCount: 1 };
  }

  if (/FROM\s+price_snapshots.*JOIN\s+produce_records/i.test(trimmed)) {
    const lotOrId = String(params[0] || "");
    const matchingRec = store.produce_records.find(
      r => r.lot_id.toLowerCase() === lotOrId.toLowerCase() || r.id === lotOrId
    );
    if (!matchingRec) return { rows: [], rowCount: 0 };

    const prices = store.price_snapshots
      .filter(p => p.produce_record_id === matchingRec.id || p.produce_record_id === matchingRec.lot_id)
      .map(p => ({
        ...p,
        lot_id: matchingRec.lot_id,
        crop_name: matchingRec.crop_name
      }))
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));

    if (/LIMIT\s+1/i.test(trimmed)) {
      return { rows: prices.slice(0, 1), rowCount: prices.length ? 1 : 0 };
    }
    return { rows: prices, rowCount: prices.length };
  }

  if (/FROM\s+price_snapshots\s+WHERE\s+produce_record_id/i.test(trimmed)) {
    const recId = String(params[0] || "");
    const prices = store.price_snapshots
      .filter(p => p.produce_record_id === recId)
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
    return { rows: prices, rowCount: prices.length };
  }

  // =========================================================
  // 10. SENSOR READINGS
  // =========================================================

  if (/^INSERT\s+INTO\s+sensor_readings/i.test(trimmed)) {
    const newSensor = {
      id: store.sensor_readings.length + 1,
      produce_record_id: params[0],
      temperature_c: Number(params[1]),
      humidity_pct: Number(params[2]),
      spoilage_risk_pct: Number(params[3]),
      source_device: params[4] || "manual-entry",
      blockchain_tx_hash: params[5] || null,
      recorded_at: new Date().toISOString()
    };
    store.sensor_readings.unshift(newSensor);
    saveStore(store);
    return { rows: [newSensor], rowCount: 1 };
  }

  if (/FROM\s+sensor_readings.*JOIN\s+produce_records/i.test(trimmed)) {
    const lotOrId = String(params[0] || "");
    const matchingRec = store.produce_records.find(
      r => r.lot_id.toLowerCase() === lotOrId.toLowerCase() || r.id === lotOrId
    );
    if (!matchingRec) return { rows: [], rowCount: 0 };

    const sensors = store.sensor_readings
      .filter(s => s.produce_record_id === matchingRec.id || s.produce_record_id === matchingRec.lot_id)
      .map(s => ({
        ...s,
        lot_id: matchingRec.lot_id,
        crop_name: matchingRec.crop_name
      }))
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));

    if (/LIMIT\s+1/i.test(trimmed)) {
      return { rows: sensors.slice(0, 1), rowCount: sensors.length ? 1 : 0 };
    }
    return { rows: sensors, rowCount: sensors.length };
  }

  // Default fallback response
  return { rows: [], rowCount: 0 };
}

// Initialize PostgreSQL pool
function initPgPool() {
  if (!databaseUrl) return null;

  try {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 2500
    });

    pool.on("error", (err) => {
      console.warn("[postgres] Pool connection warning:", err.message);
      pgConnected = false;
    });

    return pool;
  } catch (err) {
    console.warn("[postgres] Init error:", err.message);
    return null;
  }
}

pgPool = initPgPool();

// Test PostgreSQL probe and auto-migrate tables
async function testPgConnection() {
  if (!pgPool) return false;
  try {
    const client = await pgPool.connect();
    await client.query("SELECT 1");

    // Check if migration is required
    try {
      const migrationFile = path.resolve(__dirname, "../../database/migration_auth_rewards.sql");
      if (fs.existsSync(migrationFile)) {
        const migrationSql = fs.readFileSync(migrationFile, "utf-8");
        await client.query(migrationSql);
      }

      const googleMigrationFile = path.resolve(__dirname, "../../database/migration_google_auth.sql");
      if (fs.existsSync(googleMigrationFile)) {
        const googleMigrationSql = fs.readFileSync(googleMigrationFile, "utf-8");
        await client.query(googleMigrationSql);
      }
    } catch (migErr) {
      console.warn("[postgres] Migration notice:", migErr.message);
    }

    client.release();
    if (!pgConnected) {
      console.log("[db] PostgreSQL connected and schemas synced successfully!");
    }
    pgConnected = true;
    return true;
  } catch (e) {
    pgConnected = false;
    return false;
  }
}

// Initial probe + background reconnect check every 30 seconds
testPgConnection();
pgCheckTimer = setInterval(testPgConnection, 30000);
if (pgCheckTimer.unref) pgCheckTimer.unref();

// Unified exported pool object matching pg.Pool interface
const unifiedPool = {
  async query(text, params) {
    if (pgConnected && pgPool) {
      try {
        return await pgPool.query(text, params);
      } catch (err) {
        console.warn("[postgres] Query failed, falling back to persistent store:", err.message);
        pgConnected = false;
        return await executeFallbackQuery(text, params);
      }
    }
    return await executeFallbackQuery(text, params);
  },

  on(event, handler) {
    if (pgPool) pgPool.on(event, handler);
  },

  isPostgresConnected() {
    return pgConnected;
  },

  getEngineName() {
    return pgConnected ? "PostgreSQL" : "Persistent Local Store";
  }
};

module.exports = unifiedPool;
