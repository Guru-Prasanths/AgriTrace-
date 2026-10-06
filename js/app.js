/* =========================================================
   AgriTrace Frontend Application
   Express Backend + PostgreSQL + Ethereum Smart Contract
   ========================================================= */

const API_BASE = "http://127.0.0.1:4000/api";
const API_TIMEOUT = 8000;

// State
let allRecords = [];
let isOperatorCached = false;

// Fallback demo data (displayed when PostgreSQL is not yet configured or offline)
const DEMO_FALLBACK_RECORDS = [
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
    blockchain_network: "sepolia",
    blockchain_verified: false,
    is_demo: true
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
    blockchain_network: "sepolia",
    blockchain_verified: false,
    is_demo: true
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
    blockchain_network: "sepolia",
    blockchain_verified: false,
    is_demo: true
  }
];

/* =========================================================
   TOAST / NOTIFICATIONS
   ========================================================= */

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const titleEl = document.getElementById("toastTitle");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = toast?.querySelector(".toast-icon");

  if (!toast) {
    console.log(`[${type}] ${message}`);
    return;
  }

  if (titleEl) titleEl.textContent = "AgriTrace";
  if (msgEl) msgEl.textContent = message;
  if (iconEl) iconEl.textContent = type === "error" ? "✗" : "✓";

  toast.className = `toast show ${type}`;

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.className = "toast";
  }, 5500);
}

/* =========================================================
   ERROR HANDLING
   ========================================================= */

function userFriendlyError(error) {
  const message = String(
    error?.shortMessage ||
    error?.reason ||
    error?.message ||
    error ||
    "Unknown error"
  );

  if (/user rejected|denied|cancelled|canceled/i.test(message)) {
    return "The MetaMask transaction was rejected.";
  }

  if (/not installed/i.test(message)) {
    return "MetaMask is not installed. Please open this application in a browser where MetaMask is installed.";
  }

  if (/wrong network|chain/i.test(message)) {
    return "Please switch MetaMask to Sepolia or Hardhat Local.";
  }

  if (/contract is not configured/i.test(message)) {
    return "The AgriTrace smart contract address is not configured. Deploy the contract and update CONTRACT_ADDRESS.";
  }

  if (/failed to fetch|network error|ECONNREFUSED|fetch failed|timeout/i.test(message)) {
    return "Cannot connect to the AgriTrace backend on port 4000. Make sure Express is running.";
  }

  if (/insufficient funds/i.test(message)) {
    return "The connected wallet does not have enough test ETH.";
  }

  if (/already exists/i.test(message)) {
    return "That lot ID already exists. Use another lot ID.";
  }

  if (/not authorized|not operator|operator/i.test(message)) {
    return "This wallet is not authorized as an AgriTrace contract operator.";
  }

  if (/database|postgres|pg/i.test(message)) {
    return "Off-chain database is temporarily unavailable.";
  }

  return message.length > 220
    ? `${message.slice(0, 217)}…`
    : message;
}

/* =========================================================
   API REQUEST HELPER
   ========================================================= */

async function api(path, options = {}) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body,
      signal: controller.signal
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (_) {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(
        payload?.message ||
        payload?.error ||
        `Backend returned HTTP ${response.status}`
      );
    }

    return payload;

  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Backend request timed out. Make sure Express is running on port 4000."
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/* =========================================================
   BACKEND HEALTH CHECK
   ========================================================= */

async function checkHealth() {
  const databaseMetric = document.getElementById("metricDatabase");
  const contractMetric = document.getElementById("metricOnchain");

  try {
    const result = await api("/health");
    const databaseConnected = result?.database === "connected";

    if (databaseMetric) {
      databaseMetric.textContent = databaseConnected ? "Connected" : "Online (no DB)";
    }
  } catch (error) {
    if (databaseMetric) {
      databaseMetric.textContent = "Offline";
    }
  }

  // Contract status
  if (contractMetric) {
    if (blockchain.isContractConfigured()) {
      contractMetric.textContent = "Configured";
    } else {
      contractMetric.textContent = "Not Configured";
    }
  }
}

/* =========================================================
   OPERATOR STATUS
   ========================================================= */

async function refreshOperatorStatus() {
  const priceStatus = document.getElementById("operatorPriceStatus");
  const sensorStatus = document.getElementById("operatorSensorStatus");

  try {
    isOperatorCached = await blockchain.isConnectedOperator();
    const label = isOperatorCached ? "Operator Active ✓" : "Connected (View Only)";
    if (priceStatus) priceStatus.textContent = label;
    if (sensorStatus) sensorStatus.textContent = label;
  } catch {
    isOperatorCached = false;
    if (priceStatus) priceStatus.textContent = "Operator Required";
    if (sensorStatus) sensorStatus.textContent = "Operator Required";
  }
}

async function requireOperator() {
  if (!wallet.walletReady()) {
    throw new Error(
      `Please connect MetaMask to ${blockchain.getNetworkName()} first.`
    );
  }

  const isOp = await blockchain.isConnectedOperator();
  if (!isOp) {
    throw new Error(
      "Your connected wallet is not registered as an operator on this AgriTrace contract."
    );
  }
}

/* =========================================================
   FORM TO PAYLOAD HELPER
   ========================================================= */

function formToPayload(form) {
  const raw = Object.fromEntries(new FormData(form).entries());

  const data = {
    lotId: raw.lotId ? String(raw.lotId).trim() : "",
    cropName: raw.cropName ? String(raw.cropName).trim() : "",
    origin: raw.origin ? String(raw.origin).trim() : "",
    harvestDate: raw.harvestDate,
    qualityGrade: raw.qualityGrade || null,
    storageTemperatureC: raw.storageTemperature !== "" ? Number(raw.storageTemperature) : null,
    storageHumidityPct: raw.storageHumidity !== "" ? Number(raw.storageHumidity) : null,
    farmerPrice: raw.farmerPrice !== "" ? Number(raw.farmerPrice) : null,
    consumerPrice: raw.consumerPrice !== "" ? Number(raw.consumerPrice) : null
  };

  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined || val === "") {
      delete data[key];
    }
  }

  return data;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/[&<>'"]/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[c]);
}

function money(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/* =========================================================
   RECORD DISPLAY & LIVE SEARCH
   ========================================================= */

function renderRecords(records) {
  const body = document.getElementById("recordsBody");
  const state = document.getElementById("recordsState");
  const count = document.getElementById("recordCount");
  const verifiedCount = document.getElementById("verifiedCount");

  if (!body || !state) return;

  body.innerHTML = "";

  if (count) {
    count.textContent = records.length;
  }

  const verified = records.filter(r => r.blockchain_verified).length;
  if (verifiedCount) {
    verifiedCount.textContent = verified;
  }

  if (!records.length) {
    state.textContent = "No matching produce records found.";
    state.style.display = "block";
    return;
  }

  state.style.display = "none";

  for (const record of records) {
    const row = document.createElement("tr");

    let chainBadge = "Pending";
    let badgeClass = "pending";

    if (record.blockchain_verified) {
      chainBadge = "Verified";
      badgeClass = "ok";
    } else if (record.blockchain_tx_hash) {
      chainBadge = "Anchored";
      badgeClass = "ok";
    } else if (record.is_demo) {
      chainBadge = "Demo Off-Chain";
      badgeClass = "pending";
    }

    const explorerLink = record.blockchain_tx_hash
      ? blockchain.explorerTxLink(record.blockchain_tx_hash)
      : null;

    const txDisplay = explorerLink
      ? `<a href="${explorerLink}" target="_blank" rel="noopener" style="color:var(--accent,#22c55e);text-decoration:underline;">${chainBadge}</a>`
      : chainBadge;

    row.innerHTML = `
      <td>
        <strong style="color: var(--white);">${escapeHtml(record.lot_id)}</strong>
        ${record.is_demo ? '<span style="font-size: 8px; color: var(--muted); margin-left: 4px;">[DEMO]</span>' : ''}
      </td>
      <td>${escapeHtml(record.crop_name)}</td>
      <td>${escapeHtml(record.origin)}</td>
      <td>${record.harvest_date ? new Date(record.harvest_date).toLocaleDateString("en-IN") : "—"}</td>
      <td>
        ₹${money(record.farmer_price)}
        →
        ₹${money(record.consumer_price)}
      </td>
      <td>
        <span class="chain ${badgeClass}">
          ${txDisplay}
        </span>
      </td>
      <td>
        <button
          type="button"
          class="small-button view-trace-btn"
          data-lot="${escapeHtml(record.lot_id)}"
          style="cursor: pointer; padding: 4px 10px; font-size: 8px;"
        >
          🔍 View Trace
        </button>
      </td>
    `;

    body.appendChild(row);
  }

  // Attach click listeners to all "View Trace" buttons
  body.querySelectorAll(".view-trace-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const lotId = btn.getAttribute("data-lot");
      showTraceabilityModal(lotId);
    });
  });
}

function filterRecords(query) {
  if (!query || !query.trim()) {
    renderRecords(allRecords);
    return;
  }

  const q = query.trim().toLowerCase();
  const filtered = allRecords.filter(r =>
    (r.lot_id && r.lot_id.toLowerCase().includes(q)) ||
    (r.crop_name && r.crop_name.toLowerCase().includes(q)) ||
    (r.origin && r.origin.toLowerCase().includes(q))
  );

  renderRecords(filtered);
}

/* =========================================================
   LOAD RECORDS (with Graceful Offline Demo Fallback)
   ========================================================= */

async function refreshRecords() {
  const state = document.getElementById("recordsState");

  if (state) {
    state.textContent = "Loading records…";
    state.style.display = "block";
  }

  try {
    const payload = await api("/records");
    allRecords = Array.isArray(payload?.data) && payload.data.length > 0
      ? payload.data
      : DEMO_FALLBACK_RECORDS;

    renderRecords(allRecords);
    return allRecords;

  } catch (error) {
    console.warn("Backend /records query failed, using demo fallback records:", error.message);

    // Graceful offline fallback: Display demo records so user can evaluate system
    allRecords = DEMO_FALLBACK_RECORDS;
    renderRecords(allRecords);

    if (state) {
      state.textContent = "Showing sample demo records (PostgreSQL offline or configuring).";
      state.style.display = "block";
    }

    return allRecords;
  }
}

/* =========================================================
   CONSUMER TRACEABILITY & PROVENANCE MODAL
   Distinguishes On-Chain Blockchain Data vs Off-Chain Data
   ========================================================= */

async function showTraceabilityModal(lotId) {
  const modal = document.getElementById("traceModal");
  const title = document.getElementById("traceModalTitle");
  const content = document.getElementById("traceModalContent");

  if (!modal || !content) return;

  modal.style.display = "block";
  modal.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (title) title.textContent = `Batch Lifecycle & Provenance: ${lotId}`;
  content.innerHTML = `<div style="padding: 20px; color: var(--muted); font-size: 11px;">Loading traceability data for ${escapeHtml(lotId)}…</div>`;

  let traceData = null;
  let onChainRecord = null;
  let priceHistory = [];
  let sensorHistory = [];

  // 1. Try reading off-chain traceability summary from Express backend
  try {
    const resp = await api(`/traceability/${encodeURIComponent(lotId)}`);
    traceData = resp;
  } catch (err) {
    console.log("Traceability API unavailable, checking local records & blockchain:", err.message);
  }

  // 2. Try reading directly from blockchain smart contract (decentralized source of truth)
  try {
    if (blockchain.isContractConfigured()) {
      const readRes = await blockchain.getReadRecord(lotId);
      if (readRes && readRes.record && readRes.record.exists) {
        onChainRecord = readRes.record;
      }
      priceHistory = await blockchain.readPriceHistory(lotId);
      sensorHistory = await blockchain.readSensorHistory(lotId);
    }
  } catch (chainErr) {
    console.log("On-chain record query result:", chainErr.message);
  }

  // 3. Match from local records if needed
  const localRec = allRecords.find(r => r.lot_id === lotId) || {};

  const crop = traceData?.cropName || onChainRecord?.cropName || localRec.crop_name || "Produce";
  const origin = traceData?.origin || onChainRecord?.origin || localRec.origin || "Unknown";
  const harvest = traceData?.harvestDate || (onChainRecord?.harvestDate ? new Date(Number(onChainRecord.harvestDate) * 1000).toISOString() : localRec.harvest_date);
  const isVerified = traceData?.onChain?.blockchainVerified || onChainRecord?.verified || localRec.blockchain_verified;
  const isAnchored = !!(traceData?.onChain?.blockchainTxHash || localRec.blockchain_tx_hash || onChainRecord);
  const txHash = traceData?.onChain?.blockchainTxHash || localRec.blockchain_tx_hash || null;
  const explorerUrl = txHash ? blockchain.explorerTxLink(txHash) : null;
  const recordKey = traceData?.onChain?.blockchainKey || localRec.blockchain_key || "0x" + "0".repeat(64);
  const metaHash = traceData?.onChain?.metadataHash || onChainRecord?.metadataHash || localRec.metadata_hash || "—";
  const creator = onChainRecord?.creator || "Not yet anchored";

  const allPrices = (traceData?.priceHistory && traceData.priceHistory.length > 0)
    ? traceData.priceHistory
    : priceHistory;

  const allSensors = (traceData?.sensorHistory && traceData.sensorHistory.length > 0)
    ? traceData.sensorHistory
    : sensorHistory;

  // Build the rich Authenticity & Traceability View
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 10px;">

      <!-- Card A: ON-CHAIN VERIFIABLE BLOCKCHAIN RECORD -->
      <div style="background: rgba(3, 16, 13, 0.7); border: 1px solid rgba(57, 255, 136, 0.25); border-radius: 12px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 9px; font-weight: 800; color: var(--green); letter-spacing: 1px;">ON-CHAIN IMMUTABLE ANCHOR</span>
          <span class="chain ${isVerified ? "ok" : isAnchored ? "ok" : "pending"}" style="font-size: 8px;">
            ${isVerified ? "VERIFIED ON-CHAIN" : isAnchored ? "ANCHORED" : "OFF-CHAIN ONLY"}
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 10px;">
          <div>
            <div style="color: var(--muted); font-size: 8px;">LOT KEY (KECCAK-256)</div>
            <code style="color: var(--green); font-size: 9px; word-break: break-all;">${recordKey}</code>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">CREATOR WALLET</div>
            <code style="color: var(--white); font-size: 9px; word-break: break-all;">${creator}</code>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">METADATA FINGERPRINT (HASH)</div>
            <code style="color: var(--cyan); font-size: 9px; word-break: break-all;">${metaHash}</code>
          </div>
          ${txHash ? `
            <div>
              <div style="color: var(--muted); font-size: 8px;">TRANSACTION HASH</div>
              <a href="${explorerUrl || '#'}" target="_blank" rel="noopener" style="color: var(--green); font-size: 9px; word-break: break-all; text-decoration: underline;">
                ${txHash} ↗
              </a>
            </div>
          ` : `
            <div style="color: var(--muted); font-size: 9px; font-style: italic;">
              No blockchain transaction hash recorded yet.
            </div>
          `}
        </div>

        ${(!isVerified && isOperatorCached && isAnchored) ? `
          <button id="modalVerifyBtn" type="button" class="small-button" style="margin-top: 14px; width: 100%; padding: 8px; cursor: pointer;">
            ⚡ Verify on Blockchain
          </button>
        ` : ''}
      </div>

      <!-- Card B: OFF-CHAIN FARM & PRODUCE ATTRIBUTES -->
      <div style="background: rgba(3, 16, 13, 0.7); border: 1px solid rgba(78, 255, 158, 0.15); border-radius: 12px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 9px; font-weight: 800; color: var(--cyan); letter-spacing: 1px;">OFF-CHAIN POSTGRESQL METADATA</span>
          <span style="font-size: 8px; color: var(--muted);">RICH FARM DATA</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 10px;">
          <div>
            <div style="color: var(--muted); font-size: 8px;">CROP</div>
            <strong style="color: var(--white);">${escapeHtml(crop)}</strong>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">ORIGIN</div>
            <strong style="color: var(--white);">${escapeHtml(origin)}</strong>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">HARVEST DATE</div>
            <span style="color: var(--white);">${harvest ? new Date(harvest).toLocaleDateString("en-IN") : "—"}</span>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">QUALITY GRADE</div>
            <span style="color: var(--green);">${escapeHtml(localRec.quality_grade || "Grade A")}</span>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">FARMER PRICE</div>
            <span style="color: var(--white);">₹${money(localRec.farmer_price)}</span>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">CONSUMER PRICE</div>
            <span style="color: var(--white);">₹${money(localRec.consumer_price)}</span>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">STORAGE TEMP</div>
            <span style="color: var(--cyan);">${localRec.storage_temperature_c ? localRec.storage_temperature_c + "°C" : "—"}</span>
          </div>
          <div>
            <div style="color: var(--muted); font-size: 8px;">STORAGE HUMIDITY</div>
            <span style="color: var(--cyan);">${localRec.storage_humidity_pct ? localRec.storage_humidity_pct + "%" : "—"}</span>
          </div>
        </div>

        <div style="margin-top: 14px; display: flex; gap: 8px;">
          <button id="quickPriceBtn" type="button" class="small-button" style="flex: 1; padding: 6px; font-size: 8px;">
            + Record Price
          </button>
          <button id="quickSensorBtn" type="button" class="small-button" style="flex: 1; padding: 6px; font-size: 8px;">
            + Record Sensor
          </button>
        </div>
      </div>

    </div>

    <!-- LIFECYCLE TIMELINE -->
    <div style="margin-top: 18px; padding: 16px; background: rgba(2, 7, 6, 0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
      <div style="font-size: 9px; font-weight: 800; color: var(--muted); letter-spacing: 1px; margin-bottom: 12px;">
        FARM-TO-MARKET LIFECYCLE TIMELINE
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: 9px;">
        <span style="padding: 4px 8px; border-radius: 6px; background: rgba(57, 255, 136, 0.1); color: var(--green); border: 1px solid rgba(57, 255, 136, 0.3);">
          ✓ 1. HARVESTED (${escapeHtml(origin)})
        </span>
        <span style="color: var(--muted);">→</span>
        <span style="padding: 4px 8px; border-radius: 6px; background: rgba(57, 255, 136, 0.1); color: var(--green); border: 1px solid rgba(57, 255, 136, 0.3);">
          ✓ 2. REGISTERED
        </span>
        <span style="color: var(--muted);">→</span>
        <span style="padding: 4px 8px; border-radius: 6px; background: ${isAnchored ? "rgba(57, 255, 136, 0.1); color: var(--green); border: 1px solid rgba(57, 255, 136, 0.3);" : "rgba(255,255,255,0.05); color: var(--muted);"}">
          ${isAnchored ? "✓" : "○"} 3. BLOCKCHAIN ANCHORED
        </span>
        <span style="color: var(--muted);">→</span>
        <span style="padding: 4px 8px; border-radius: 6px; background: ${allPrices.length > 0 ? "rgba(57, 255, 136, 0.1); color: var(--green); border: 1px solid rgba(57, 255, 136, 0.3);" : "rgba(255,255,255,0.05); color: var(--muted);"}">
          ${allPrices.length > 0 ? "✓" : "○"} 4. PRICE DISCOVERY (${allPrices.length} Snapshots)
        </span>
        <span style="color: var(--muted);">→</span>
        <span style="padding: 4px 8px; border-radius: 6px; background: ${allSensors.length > 0 ? "rgba(57, 255, 136, 0.1); color: var(--green); border: 1px solid rgba(57, 255, 136, 0.3);" : "rgba(255,255,255,0.05); color: var(--muted);"}">
          ${allSensors.length > 0 ? "✓" : "○"} 5. COLD-CHAIN MONITORED (${allSensors.length} Readings)
        </span>
        <span style="color: var(--muted);">→</span>
        <span style="padding: 4px 8px; border-radius: 6px; background: ${isVerified ? "rgba(57, 255, 136, 0.2); color: var(--green); border: 1px solid var(--green);" : "rgba(255,255,255,0.05); color: var(--muted);"}">
          ${isVerified ? "✓" : "○"} 6. VERIFIED
        </span>
      </div>
    </div>
  `;

  // Attach quick action buttons
  document.getElementById("quickPriceBtn")?.addEventListener("click", () => {
    const input = document.getElementById("priceLotId");
    if (input) {
      input.value = lotId;
      document.getElementById("prices")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  document.getElementById("quickSensorBtn")?.addEventListener("click", () => {
    const input = document.getElementById("sensorLotId");
    if (input) {
      input.value = lotId;
      document.getElementById("sensors")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Attach verify button listener if present
  document.getElementById("modalVerifyBtn")?.addEventListener("click", async () => {
    const btn = document.getElementById("modalVerifyBtn");
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = "Verifying on blockchain…";

    try {
      await requireOperator();
      const res = await blockchain.verifyOnChain(lotId);
      showToast(`Lot ${lotId} verified on blockchain! TX: ${res.txHash.slice(0, 14)}…`, "success");
      await refreshRecords();
      await showTraceabilityModal(lotId);
    } catch (err) {
      console.error("Verification failed:", err);
      showToast(userFriendlyError(err), "error");
      btn.disabled = false;
      btn.textContent = "⚡ Verify on Blockchain";
    }
  });
}

/* =========================================================
   CREATE PRODUCE RECORD (4-Step On-Chain + Off-Chain Flow)
   ========================================================= */

async function createRecord(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  if (!button) return;

  const networkName = blockchain.getNetworkName();

  if (!wallet.walletReady()) {
    showToast(`Connect MetaMask to ${networkName} before creating a record.`, "error");
    return;
  }

  const payload = formToPayload(form);
  if (!payload.lotId) { showToast("Please enter a Lot ID.", "error"); return; }
  if (!payload.cropName) { showToast("Please enter the crop name.", "error"); return; }
  if (!payload.origin) { showToast("Please enter the origin/farm location.", "error"); return; }
  if (!payload.harvestDate) { showToast("Please select a harvest date.", "error"); return; }

  button.disabled = true;
  const originalText = button.textContent;

  let offchainId = null;
  let backendMetadataHash = null;

  try {
    /* STEP 1: OFF-CHAIN REGISTRATION */
    button.textContent = "Saving off-chain record…";
    showToast("Saving initial metadata to backend…", "success");

    let offchainSuccess = false;
    try {
      const offchain = await api("/records", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      offchainId = offchain?.data?.id;
      backendMetadataHash = offchain?.data?.metadata_hash;
      offchainSuccess = true;
    } catch (apiErr) {
      console.warn("Backend save failed, calculating deterministic metadata hash:", apiErr.message);
      // Fallback: Generate canonical hash locally if backend database is offline
      backendMetadataHash = blockchain.canonicalMetadataHash(payload);
    }

    /* STEP 2: ON-CHAIN TRANSACTION */
    button.textContent = "Confirm in MetaMask…";
    showToast("Submitting produce batch to smart contract…", "success");

    const blockchainPayload = {
      ...payload,
      metadataHash: backendMetadataHash
    };

    const chain = await blockchain.createOnChainRecord(
      blockchainPayload,
      status => { button.textContent = status; }
    );

    if (!chain?.key || !chain?.txHash) {
      throw new Error("Blockchain transaction completed without a valid result.");
    }

    /* STEP 3: ON-CHAIN VERIFICATION */
    button.textContent = "Verifying on blockchain…";
    showToast("Produce record created. Verifying on-chain…", "success");

    let verification = null;
    if (typeof blockchain.verifyOnChainRecord === "function") {
      verification = await blockchain.verifyOnChainRecord(
        chain.key,
        status => { button.textContent = status; }
      );
    }

    /* STEP 4: SYNC BACKEND */
    if (offchainId) {
      button.textContent = "Synchronizing database…";
      const networkLabel = window.walletState?.chainId?.toLowerCase() === "0xaa36a7"
        ? "sepolia"
        : "hardhat-local";

      try {
        await api(`/records/${offchainId}`, {
          method: "PUT",
          body: JSON.stringify({
            blockchainKey: chain.key,
            blockchainTxHash: chain.txHash,
            blockchainNetwork: networkLabel,
            blockchainVerified: verification?.verified === true,
            metadataHash: backendMetadataHash
          })
        });
      } catch (syncErr) {
        console.warn("PostgreSQL sync failed (non-critical):", syncErr.message);
      }
    }

    /* SUCCESS */
    const explorerLink = blockchain.explorerTxLink(chain.txHash);
    const txMsg = explorerLink
      ? `TX: ${chain.txHash.slice(0, 10)}…`
      : `TX: ${chain.txHash.slice(0, 16)}…`;

    showToast(`Lot ${payload.lotId} anchored to blockchain. ${txMsg}`, "success");

    form.reset();
    await refreshRecords();
    await checkHealth();

  } catch (error) {
    console.error("Create record failed:", error);
    showToast(userFriendlyError(error), "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

/* =========================================================
   PRICE SNAPSHOT
   Maps price form fields to smart contract + backend /api/prices
   ========================================================= */

async function writePriceSnapshot(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  if (!button) return;

  button.disabled = true;
  const originalText = button.textContent;

  try {
    await requireOperator();

    const lotId = document.getElementById("priceLotId")?.value?.trim();
    const farmerPrice = document.getElementById("priceFarmer")?.value;
    const traderPrice = document.getElementById("priceTrader")?.value;
    const marketPrice = document.getElementById("priceMarket")?.value;
    const consumerPrice = document.getElementById("priceConsumer")?.value;

    if (!lotId) { showToast("Enter a Lot ID.", "error"); return; }
    if (!farmerPrice) { showToast("Enter the farmer price.", "error"); return; }
    if (!traderPrice) { showToast("Enter the trader price.", "error"); return; }
    if (!marketPrice) { showToast("Enter the market price.", "error"); return; }
    if (!consumerPrice) { showToast("Enter the consumer price.", "error"); return; }

    button.textContent = "Confirm in MetaMask…";

    const result = await blockchain.recordPriceOnChain({
      lotId,
      farmerPrice,
      traderPrice,
      marketPrice,
      consumerPrice
    });

    showToast(`Price snapshot anchored to blockchain. TX: ${result.txHash.slice(0, 16)}…`, "success");

    // Also persist off-chain to Express backend
    try {
      await api("/prices", {
        method: "POST",
        body: JSON.stringify({
          lotId,
          farmerPrice: Number(farmerPrice),
          traderPrice: Number(traderPrice),
          marketPrice: Number(marketPrice),
          consumerPrice: Number(consumerPrice),
          blockchainTxHash: result.txHash
        })
      });
    } catch (apiErr) {
      console.warn("Off-chain price save notice:", apiErr.message);
    }

    form.reset();
    await refreshRecords();

  } catch (error) {
    console.error("Price transaction failed:", error);
    showToast(userFriendlyError(error), "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

/* =========================================================
   SENSOR SNAPSHOT
   Maps sensor form fields to smart contract + backend /api/environment
   ========================================================= */

async function writeSensorSnapshot(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  if (!button) return;

  button.disabled = true;
  const originalText = button.textContent;

  try {
    await requireOperator();

    const lotId = document.getElementById("sensorLotId")?.value?.trim();
    const temperatureC = document.getElementById("temperatureInput")?.value;
    const humidityPct = document.getElementById("humidityInput")?.value;
    const spoilageRiskPct = document.getElementById("spoilageRiskInput")?.value;

    if (!lotId) { showToast("Enter a Lot ID.", "error"); return; }
    if (!temperatureC) { showToast("Enter temperature.", "error"); return; }
    if (!humidityPct) { showToast("Enter humidity.", "error"); return; }
    if (!spoilageRiskPct) { showToast("Enter spoilage risk.", "error"); return; }

    button.textContent = "Confirm in MetaMask…";

    const result = await blockchain.recordSensorOnChain({
      lotId,
      temperatureC,
      humidityPct,
      spoilageRiskPct
    });

    showToast(`Sensor observation anchored on blockchain. TX: ${result.txHash.slice(0, 16)}…`, "success");

    // Also persist off-chain to Express backend
    try {
      await api("/environment", {
        method: "POST",
        body: JSON.stringify({
          lotId,
          temperatureC: Number(temperatureC),
          humidityPct: Number(humidityPct),
          spoilageRiskPct: Number(spoilageRiskPct),
          sourceDevice: "manual-entry",
          blockchainTxHash: result.txHash
        })
      });
    } catch (apiErr) {
      console.warn("Off-chain sensor save notice:", apiErr.message);
    }

    form.reset();
    await refreshRecords();

  } catch (error) {
    console.error("Sensor transaction failed:", error);
    showToast(userFriendlyError(error), "error");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

/* =========================================================
   APPLICATION BOOTSTRAP
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("======================================");
  console.log("AgriTrace Fullstack dApp Initializing");
  console.log("Backend API:", API_BASE);
  console.log("Contract Address:", AGRITRACE.CONTRACT_ADDRESS);
  console.log("======================================");

  // 1. Check backend health
  await checkHealth();

  // 2. Load records
  await refreshRecords();

  // 3. Connect search input
  const searchInput = document.getElementById("recordSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      filterRecords(e.target.value);
    });
  }

  // 4. Connect refresh button
  const refreshBtn = document.getElementById("refreshRecordsBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      await refreshRecords();
      showToast("Records refreshed.", "success");
    });
  }

  // 5. Connect modal close button
  document.getElementById("closeTraceModalBtn")?.addEventListener("click", () => {
    const modal = document.getElementById("traceModal");
    if (modal) modal.style.display = "none";
  });

  // 6. Connect Forms
  const recordForm = document.getElementById("recordForm");
  if (recordForm) recordForm.addEventListener("submit", createRecord);

  const priceForm = document.getElementById("priceForm");
  if (priceForm) priceForm.addEventListener("submit", writePriceSnapshot);

  const sensorForm = document.getElementById("sensorForm");
  if (sensorForm) sensorForm.addEventListener("submit", writeSensorSnapshot);

  // 7. Check operator status
  await refreshOperatorStatus();

  // 8. MetaMask Wallet events
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async () => {
      await refreshOperatorStatus();
    });

    window.ethereum.on("chainChanged", async () => {
      await refreshOperatorStatus();
      await checkHealth();
    });
  }

  console.log("AgriTrace frontend initialized successfully.");
});

// Periodic Health Check
setInterval(checkHealth, 30000);
