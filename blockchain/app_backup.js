/* =========================================================
   AgriTrace Frontend Application
   Hardhat Local + Express + PostgreSQL
   ========================================================= */

const API_BASE = "http://127.0.0.1:4000/api";
const API_TIMEOUT = 8000;


/* =========================================================
   TOAST / NOTIFICATIONS
   ========================================================= */

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  if (!toast) {
    console.log(`[${type}] ${message}`);
    return;
  }

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  window.clearTimeout(showToast.timeout);

  showToast.timeout = window.setTimeout(() => {
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
    return "MetaMask is not installed.";
  }

  if (/wrong network|chain/i.test(message)) {
    return `Please switch MetaMask to ${AGRITRACE.NETWORK.name}.`;
  }

  if (/contract is not configured/i.test(message)) {
    return "The AgriTrace smart contract address is not configured.";
  }

  if (
    /failed to fetch|network error|ECONNREFUSED|fetch failed|timeout/i.test(
      message
    )
  ) {
    return "Cannot connect to the AgriTrace backend on port 4000.";
  }

  if (/insufficient funds/i.test(message)) {
    return "The Hardhat Local wallet does not have enough test ETH.";
  }

  if (/already exists/i.test(message)) {
    return "That lot ID already exists. Use another lot ID.";
  }

  if (/not authorized|not operator|operator/i.test(message)) {
    return "This wallet is not authorized as an AgriTrace contract operator.";
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
    const response = await fetch(
      `${API_BASE}${path}`,
      {
        method: options.method || "GET",

        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },

        body: options.body,

        signal: controller.signal
      }
    );

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
  const databaseMetric =
    document.getElementById("metricDatabase");

  const backendStatus =
    document.getElementById("backendStatus");

  try {
    const result = await api("/health");

    const databaseConnected =
      result?.database === "connected";

    if (databaseMetric) {
      databaseMetric.textContent =
        databaseConnected ? "Connected" : "Online";
    }

    if (backendStatus) {
      backendStatus.textContent =
        databaseConnected
          ? "Backend + PostgreSQL connected"
          : "Backend connected";
    }

    return true;

  } catch (error) {
    if (databaseMetric) {
      databaseMetric.textContent = "Offline";
    }

    if (backendStatus) {
      backendStatus.textContent = "Backend unavailable";
    }

    console.error(
      "Backend health check failed:",
      error
    );

    return false;
  }
}


/* =========================================================
   FORM DATA
   ========================================================= */

function formToPayload(form) {
  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );

  const numericFields = [
    "storageTemperatureC",
    "storageHumidityPct",
    "farmerPrice",
    "consumerPrice"
  ];

  for (const field of numericFields) {
    if (
      data[field] !== undefined &&
      data[field] !== ""
    ) {
      data[field] = Number(data[field]);
    } else {
      delete data[field];
    }
  }

  return data;
}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(
      /[&<>'"]/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[character]
    );
}


/* =========================================================
   MONEY FORMAT
   ========================================================= */

function money(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return Number(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );
}


/* =========================================================
   RECORD DISPLAY
   ========================================================= */

function renderRecords(records) {
  const body =
    document.getElementById("recordsBody");

  const state =
    document.getElementById("recordsState");

  const count =
    document.getElementById("recordCount");

  const verifiedCount =
    document.getElementById("verifiedCount");

  if (!body || !state) {
    return;
  }

  body.innerHTML = "";

  if (count) {
    count.textContent = records.length;
  }

  const verified =
    records.filter(
      record => record.blockchain_verified
    ).length;

  if (verifiedCount) {
    verifiedCount.textContent = verified;
  }

  if (!records.length) {
    state.textContent =
      "No produce records found.";

    state.style.display = "block";

    return;
  }

  state.style.display = "none";


  for (const record of records) {
    const row =
      document.createElement("tr");

    let chainState = "Pending";

    if (record.blockchain_verified) {
      chainState = "Verified";
    } else if (record.blockchain_tx_hash) {
      chainState = "Anchored";
    }

    row.innerHTML = `
      <td>
        <strong>
          ${escapeHtml(record.lot_id)}
        </strong>
      </td>

      <td>
        ${escapeHtml(record.crop_name)}
      </td>

      <td>
        ${escapeHtml(record.origin)}
      </td>

      <td>
        ${
          record.harvest_date
            ? new Date(
                record.harvest_date
              ).toLocaleDateString("en-IN")
            : "—"
        }
      </td>

      <td>
        ₹${money(record.farmer_price)}
        →
        ₹${money(record.consumer_price)}
      </td>

      <td>
        <span class="chain ${
          record.blockchain_tx_hash
            ? "ok"
            : "pending"
        }">
          ${chainState}
        </span>
      </td>
    `;

    body.appendChild(row);
  }


  /* =======================================================
     DASHBOARD VALUES
     ======================================================= */

  const latest = records[0];

  const farmerPrice =
    document.getElementById("priceFarmer");

  const consumerPrice =
    document.getElementById("priceConsumer");

  const capturePct =
    document.getElementById("capturePct");

  const tempValue =
    document.getElementById("tempValue");

  const humidityValue =
    document.getElementById("humidityValue");

  const riskValue =
    document.getElementById("riskValue");

  const tempMeter =
    document.getElementById("tempMeter");

  const humidityMeter =
    document.getElementById("humidityMeter");


  if (farmerPrice) {
    farmerPrice.textContent =
      latest.farmer_price == null
        ? "—"
        : `₹${money(latest.farmer_price)}`;
  }


  if (consumerPrice) {
    consumerPrice.textContent =
      latest.consumer_price == null
        ? "—"
        : `₹${money(latest.consumer_price)}`;
  }


  if (capturePct) {
    const farmer =
      Number(latest.farmer_price);

    const consumer =
      Number(latest.consumer_price);

    const percentage =
      consumer > 0
        ? (farmer / consumer) * 100
        : 0;

    capturePct.textContent =
      latest.farmer_price == null
        ? "—"
        : `${percentage.toFixed(1)}%`;
  }


  if (tempValue) {
    tempValue.textContent =
      latest.storage_temperature_c == null
        ? "—"
        : Number(
            latest.storage_temperature_c
          ).toFixed(1);
  }


  if (humidityValue) {
    humidityValue.textContent =
      latest.storage_humidity_pct == null
        ? "—"
        : Number(
            latest.storage_humidity_pct
          ).toFixed(0);
  }


  if (riskValue) {
    riskValue.textContent = "—";
  }


  if (tempMeter) {
    const temperature =
      Number(
        latest.storage_temperature_c
      );

    tempMeter.style.width =
      latest.storage_temperature_c == null
        ? "0%"
        : `${Math.min(
            100,
            Math.max(0, temperature * 10)
          )}%`;
  }


  if (humidityMeter) {
    const humidity =
      Number(
        latest.storage_humidity_pct
      );

    humidityMeter.style.width =
      latest.storage_humidity_pct == null
        ? "0%"
        : `${Math.min(
            100,
            Math.max(0, humidity)
          )}%`;
  }
}


/* =========================================================
   LOAD RECORDS
   ========================================================= */

async function refreshRecords() {
  const state =
    document.getElementById("recordsState");

  if (state) {
    state.textContent =
      "Loading records…";

    state.style.display = "block";
  }

  try {
    const payload =
      await api("/records");

    const records =
      Array.isArray(payload?.data)
        ? payload.data
        : [];

    renderRecords(records);

    return records;

  } catch (error) {
    const message =
      userFriendlyError(error);

    if (state) {
      state.textContent = message;
    }

    showToast(
      message,
      "error"
    );

    console.error(
      "Failed to load records:",
      error
    );

    return [];
  }
}


/* =========================================================
   CREATE PRODUCE RECORD
   ========================================================= */

async function createRecord(event) {
  event.preventDefault();

  const form =
    event.currentTarget;

  const button =
    form.querySelector(
      "button[type=submit]"
    );

  if (!button) {
    return;
  }


  /* -------------------------------------------------------
     CHECK WALLET
     ------------------------------------------------------- */

  if (!wallet.walletReady()) {
    showToast(
      `Connect MetaMask to ${AGRITRACE.NETWORK.name} before creating a record.`,
      "error"
    );

    return;
  }


  const payload =
    formToPayload(form);


  if (!payload.lotId) {
    showToast(
      "Please enter a Lot ID.",
      "error"
    );

    return;
  }


  if (!payload.cropName) {
    showToast(
      "Please enter the crop name.",
      "error"
    );

    return;
  }


  if (!payload.origin) {
    showToast(
      "Please enter the origin.",
      "error"
    );

    return;
  }


  if (!payload.harvestDate) {
    showToast(
      "Please select the harvest date.",
      "error"
    );

    return;
  }


  button.disabled = true;

  const originalText =
    button.textContent;


  let offchainId = null;


  try {

    /* =====================================================
       STEP 1 — SEND DATA TO BACKEND
       ===================================================== */

    button.textContent =
      "Preparing record…";

    showToast(
      "Sending produce metadata to the AgriTrace backend…",
      "success"
    );


    /*
     * IMPORTANT:
     *
     * We no longer calculate metadataHash here.
     *
     * The backend is now the single source of truth
     * for the canonical metadata hash.
     */


    /* =====================================================
       STEP 2 — POSTGRESQL
       ===================================================== */

    button.textContent =
      "Saving to PostgreSQL…";

    showToast(
      "Creating the off-chain record…",
      "success"
    );


    const offchain =
      await api(
        "/records",
        {
          method: "POST",

          body:
            JSON.stringify(payload)
        }
      );


    if (!offchain?.data?.id) {
      throw new Error(
        "Backend created the record but did not return its ID."
      );
    }


    offchainId =
      offchain.data.id;


    /*
     * The backend-generated metadata hash is now
     * returned to the frontend.
     */

    const backendMetadataHash =
      offchain.data.metadata_hash;


    if (!backendMetadataHash) {
      throw new Error(
        "Backend did not return the metadata hash."
      );
    }


    if (
      !/^0x[a-fA-F0-9]{64}$/.test(
        backendMetadataHash
      )
    ) {
      throw new Error(
        "Backend returned an invalid metadata hash."
      );
    }


    /* =====================================================
       STEP 3 — BLOCKCHAIN
       ===================================================== */

    button.textContent =
      "Waiting for MetaMask…";

    showToast(
      `Confirm the blockchain transaction in MetaMask on ${AGRITRACE.NETWORK.name}.`,
      "success"
    );


    /*
     * Pass the backend-generated metadata hash
     * into the blockchain layer.
     */

    const blockchainPayload = {
      ...payload,

      metadataHash:
        backendMetadataHash
    };


    const chain =
      await blockchain.createOnChainRecord(
        blockchainPayload,
        status => {
          button.textContent = status;
        }
      );


    if (!chain?.key || !chain?.txHash) {
      throw new Error(
        "Blockchain transaction completed without a valid transaction result."
      );
    }


    /* =====================================================
       STEP 4 — VERIFY ON BLOCKCHAIN
       ===================================================== */

    button.textContent =
      "Verifying on blockchain…";

    showToast(
      "Produce record created. Now verifying the blockchain record…",
      "success"
    );


    /*
     * blockchain.verifyOnChainRecord()
     * should call:
     *
     * verifyProduceRecord(recordKey)
     *
     * on the AgriTrace smart contract.
     */

    let verification = null;


    if (
      typeof blockchain.verifyOnChainRecord ===
      "function"
    ) {

      verification =
        await blockchain.verifyOnChainRecord(
          chain.key,
          status => {
            button.textContent = status;
          }
        );

    } else {

      /*
       * If the blockchain helper does not yet contain
       * verifyOnChainRecord(), stop here rather than
       * incorrectly marking the database record as verified.
       */

      throw new Error(
        "Blockchain verification function is not available. Add verifyOnChainRecord() to blockchain.js."
      );
    }


    if (
      !verification ||
      verification.verified !== true
    ) {

      throw new Error(
        "Blockchain record was created but verification was not confirmed."
      );
    }


    /* =====================================================
       STEP 5 — SYNC POSTGRESQL
       ===================================================== */

    button.textContent =
      "Synchronizing database…";

    showToast(
      "Blockchain verified. Synchronizing PostgreSQL…",
      "success"
    );


    await api(
      `/records/${offchainId}`,
      {
        method: "PUT",

        body: JSON.stringify({

          blockchainKey:
            chain.key,

          blockchainTxHash:
            chain.txHash,

          blockchainNetwork:
            "hardhat-local",

          blockchainVerified:
            true,

          metadataHash:
            backendMetadataHash
        })
      }
    );


    /* =====================================================
       SUCCESS
       ===================================================== */

    showToast(
      `Lot ${payload.lotId} successfully created, verified, and linked to the blockchain.`,
      "success"
    );


    form.reset();

    await refreshRecords();

    await checkHealth();


  } catch (error) {

    console.error(
      "Create record failed:",
      error
    );


    /*
     * IMPORTANT:
     *
     * If PostgreSQL was created but blockchain creation
     * failed, we do NOT pretend the record is verified.
     *
     * The record remains visible as pending.
     */

    if (offchainId) {

      console.warn(
        "Off-chain record exists but blockchain synchronization did not complete.",
        offchainId
      );

    }


    showToast(
      userFriendlyError(error),
      "error"
    );


  } finally {

    button.disabled = false;

    button.textContent =
      originalText;
  }
}


/* =========================================================
   OPERATOR CHECK
   ========================================================= */

async function requireOperator() {

  if (!wallet.walletReady()) {
    throw new Error(
      `Connect MetaMask to ${AGRITRACE.NETWORK.name} first.`
    );
  }


  const operator =
    await blockchain.isConnectedOperator();


  if (!operator) {
    throw new Error(
      "This wallet is not an authorized AgriTrace contract operator."
    );
  }


  return true;
}


/* =========================================================
   PRICE SNAPSHOT
   ========================================================= */

async function writePriceSnapshot(event) {
  event.preventDefault();

  const form =
    event.currentTarget;

  const button =
    form.querySelector("button");

  if (!button) {
    return;
  }


  button.disabled = true;


  try {

    await requireOperator();


    const data =
      Object.fromEntries(
        new FormData(form).entries()
      );


    button.textContent =
      "Confirm in MetaMask…";


    await blockchain.recordPriceOnChain(
      data
    );


    showToast(
      "Price snapshot recorded on Hardhat Local blockchain.",
      "success"
    );


    form.reset();


  } catch (error) {

    console.error(
      "Price transaction failed:",
      error
    );

    showToast(
      userFriendlyError(error),
      "error"
    );


  } finally {

    button.disabled = false;
  }
}


/* =========================================================
   SENSOR SNAPSHOT
   ========================================================= */

async function writeSensorSnapshot(event) {
  event.preventDefault();

  const form =
    event.currentTarget;

  const button =
    form.querySelector("button");

  if (!button) {
    return;
  }


  button.disabled = true;


  try {

    await requireOperator();


    const data =
      Object.fromEntries(
        new FormData(form).entries()
      );


    button.textContent =
      "Confirm in MetaMask…";


    await blockchain.recordSensorOnChain(
      data
    );


    showToast(
      "Cold-chain sensor reading recorded on Hardhat Local blockchain.",
      "success"
    );


    form.reset();


  } catch (error) {

    console.error(
      "Sensor transaction failed:",
      error
    );

    showToast(
      userFriendlyError(error),
      "error"
    );


  } finally {

    button.disabled = false;
  }
}


/* =========================================================
   OPERATOR STATUS
   ========================================================= */

async function refreshOperatorStatus() {

  const elements = [
    "operatorPriceStatus",
    "operatorSensorStatus"
  ];


  for (const id of elements) {

    const element =
      document.getElementById(id);

    if (!element) {
      continue;
    }


    try {

      if (!wallet.walletReady()) {

        element.textContent =
          "Connect wallet";

        element.className =
          "chain pending";

        continue;
      }


      const operator =
        await blockchain.isConnectedOperator();


      element.textContent =
        operator
          ? "Authorized"
          : "Not authorized";


      element.className =
        `chain ${
          operator
            ? "ok"
            : "pending"
        }`;


    } catch (error) {

      console.error(
        "Operator status error:",
        error
      );

      element.textContent =
        "Configure contract";

      element.className =
        "chain pending";
    }
  }
}


/* =========================================================
   UPDATE SYSTEM STATUS
   ========================================================= */

async function refreshSystemStatus() {
  await checkHealth();
  await refreshOperatorStatus();
}


/* =========================================================
   APPLICATION STARTUP
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    console.log(
      "======================================"
    );

    console.log(
      "AgriTrace frontend starting..."
    );

    console.log(
      "Backend:",
      API_BASE
    );

    console.log(
      "Network:",
      AGRITRACE.NETWORK.name
    );

    console.log(
      "Contract:",
      AGRITRACE.CONTRACT_ADDRESS
    );

    console.log(
      "======================================"
    );


    /* -----------------------------------------------------
       BACKEND
       ----------------------------------------------------- */

    await checkHealth();


    /* -----------------------------------------------------
       CONTRACT
       ----------------------------------------------------- */

    const onchainMetric =
      document.getElementById(
        "metricOnchain"
      );

    const contractLabel =
      document.getElementById(
        "contractLabel"
      );


    const contractConfigured =
      blockchain.isContractConfigured();


    if (onchainMetric) {

      onchainMetric.textContent =
        contractConfigured
          ? "Configured"
          : "Deploy required";
    }


    if (contractLabel) {

      contractLabel.textContent =
        contractConfigured
          ? `Contract: ${wallet.shortAddress(
              AGRITRACE.CONTRACT_ADDRESS
            )}`
          : "Contract: not configured";
    }


    /* -----------------------------------------------------
       RECORDS
       ----------------------------------------------------- */

    await refreshRecords();


    /* -----------------------------------------------------
       REFRESH BUTTON
       ----------------------------------------------------- */

    const refreshButton =
      document.getElementById(
        "refreshRecordsBtn"
      );


    if (refreshButton) {

      refreshButton.addEventListener(
        "click",
        refreshRecords
      );
    }


    /* -----------------------------------------------------
       RECORD FORM
       ----------------------------------------------------- */

    const recordForm =
      document.getElementById(
        "recordForm"
      );


    if (recordForm) {

      recordForm.addEventListener(
        "submit",
        createRecord
      );
    }


    /* -----------------------------------------------------
       PRICE FORM
       ----------------------------------------------------- */

    const priceForm =
      document.getElementById(
        "priceForm"
      );


    if (priceForm) {

      priceForm.addEventListener(
        "submit",
        writePriceSnapshot
      );
    }


    /* -----------------------------------------------------
       SENSOR FORM
       ----------------------------------------------------- */

    const sensorForm =
      document.getElementById(
        "sensorForm"
      );


    if (sensorForm) {

      sensorForm.addEventListener(
        "submit",
        writeSensorSnapshot
      );
    }


    /* -----------------------------------------------------
       OPERATOR STATUS
       ----------------------------------------------------- */

    await refreshOperatorStatus();


    /* -----------------------------------------------------
       WALLET EVENTS
       ----------------------------------------------------- */

    if (window.ethereum) {

      window.ethereum.on(
        "accountsChanged",
        async () => {

          await refreshOperatorStatus();
        }
      );


      window.ethereum.on(
        "chainChanged",
        async () => {

          await refreshOperatorStatus();

          await checkHealth();
        }
      );
    }


    console.log(
      "AgriTrace frontend initialized successfully."
    );
  }
);


/* =========================================================
   PERIODIC BACKEND STATUS CHECK
   ========================================================= */

setInterval(
  checkHealth,
  15000
);