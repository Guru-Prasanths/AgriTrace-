/* =========================================================
   AgriTrace Wallet Integration
   MetaMask + Ethers.js
   Supports Hardhat Local (31337) and Sepolia (11155111)
   ========================================================= */

/* ---------------------------------------------------------
   WALLET STATE
   Shared with blockchain.js and app.js
   --------------------------------------------------------- */

window.walletState = {
  account: null,
  chainId: null,
  connected: false
};


/* ---------------------------------------------------------
   KNOWN CHAINS
   --------------------------------------------------------- */

const KNOWN_CHAINS = {
  "0x7a69":   { name: "Hardhat Local",  id: 31337,    explorer: null },
  "0xaa36a7": { name: "Sepolia",        id: 11155111, explorer: "https://sepolia.etherscan.io" }
};

/* Which chains are acceptable for AgriTrace */
const ALLOWED_CHAIN_IDS = ["0x7a69", "0xaa36a7"];


/* ---------------------------------------------------------
   PROVIDER DETECTION
   --------------------------------------------------------- */

function getEthereumProvider() {
  if (typeof window === "undefined") return null;
  if (!window.ethereum) return null;
  return window.ethereum;
}


/* ---------------------------------------------------------
   SHORTEN ADDRESS
   --------------------------------------------------------- */

function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}


/* ---------------------------------------------------------
   CHAIN NAME LOOKUP
   --------------------------------------------------------- */

function chainName(hexChainId) {
  const info = KNOWN_CHAINS[hexChainId?.toLowerCase()];
  return info ? info.name : `Unknown (${hexChainId})`;
}

function chainNumericId(hexChainId) {
  try { return parseInt(hexChainId, 16); } catch { return 0; }
}

function getExplorerUrl(hexChainId) {
  const info = KNOWN_CHAINS[hexChainId?.toLowerCase()];
  return info ? info.explorer : null;
}

function txExplorerLink(txHash) {
  const url = getExplorerUrl(window.walletState.chainId);
  if (!url || !txHash) return null;
  return `${url}/tx/${txHash}`;
}


/* ---------------------------------------------------------
   IS ACCEPTABLE CHAIN
   --------------------------------------------------------- */

function isAcceptableChain(hexChainId) {
  return ALLOWED_CHAIN_IDS.includes(hexChainId?.toLowerCase());
}


/* ---------------------------------------------------------
   UPDATE UI ELEMENTS
   Uses the actual element IDs from index.html:
     #connectWalletBtn  – the wallet button
     #networkBadge      – the network status badge
     #footerNetwork     – the footer network label
   --------------------------------------------------------- */

function updateWalletUI() {
  const btn       = document.getElementById("connectWalletBtn");
  const badge     = document.getElementById("networkBadge");
  const footer    = document.getElementById("footerNetwork");

  const { account, chainId, connected } = window.walletState;

  /* -- Wallet button -- */
  if (btn) {
    if (connected && account) {
      btn.innerHTML =
        `<span>\u2726</span> ${shortAddress(account)}`;
      btn.classList.add("connected");
    } else {
      btn.innerHTML =
        `<span>\u2730</span> Connect Wallet`;
      btn.classList.remove("connected");
    }
  }

  /* -- Network badge -- */
  if (badge) {
    const name = connected ? chainName(chainId) : "Not Connected";
    const ok   = connected && isAcceptableChain(chainId);

    badge.innerHTML = `
      <span class="status-dot" style="background:${ok ? "var(--accent, #22c55e)" : "#ef4444"};"></span>
      <span>${name}</span>
    `;
  }

  /* -- Footer network label -- */
  if (footer) {
    if (connected && chainId) {
      const numId = chainNumericId(chainId);
      footer.textContent = `${chainName(chainId).toUpperCase()} \u2022 CHAIN ${numId}`;
    } else {
      footer.textContent = "NOT CONNECTED";
    }
  }
}


/* ---------------------------------------------------------
   CONNECT WALLET
   --------------------------------------------------------- */

async function connectWallet() {
  const ethereum = getEthereumProvider();

  if (!ethereum) {
    showWalletToast(
      "MetaMask was not detected. Please open this application in a browser where MetaMask is installed.",
      "error"
    );
    return null;
  }

  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });

    if (!accounts || accounts.length === 0) {
      showWalletToast("No wallet account was selected.", "error");
      return null;
    }

    const chainId = await ethereum.request({
      method: "eth_chainId"
    });

    window.walletState.account   = accounts[0];
    window.walletState.chainId   = chainId;
    window.walletState.connected = true;

    updateWalletUI();

    if (!isAcceptableChain(chainId)) {
      showWalletToast(
        "Please switch your wallet to Sepolia or Hardhat Local.",
        "error"
      );
    } else {
      showWalletToast(
        `Wallet connected on ${chainName(chainId)}.`,
        "success"
      );
    }

    return accounts[0];

  } catch (error) {
    console.error("Wallet connection error:", error);

    if (error.code === 4001) {
      showWalletToast("Wallet connection was cancelled.", "error");
    } else {
      showWalletToast("Unable to connect to MetaMask.", "error");
    }

    return null;
  }
}


/* ---------------------------------------------------------
   DISCONNECT (reset state)
   --------------------------------------------------------- */

function disconnectWallet() {
  window.walletState.account   = null;
  window.walletState.chainId   = null;
  window.walletState.connected = false;
  updateWalletUI();
}


/* ---------------------------------------------------------
   SWITCH TO SEPOLIA
   --------------------------------------------------------- */

async function switchToSepolia() {
  const ethereum = getEthereumProvider();
  if (!ethereum) return false;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }]
    });

    showWalletToast("Switched to Sepolia.", "success");
    return true;

  } catch (error) {
    console.error("Network switch error:", error);

    if (error.code === 4902) {
      showWalletToast(
        "Sepolia is not available in this wallet. Please enable the Sepolia test network in MetaMask.",
        "error"
      );
    } else if (error.code === 4001) {
      showWalletToast("Network switch was rejected.", "error");
    } else {
      showWalletToast("Unable to switch to Sepolia.", "error");
    }

    return false;
  }
}


/* ---------------------------------------------------------
   WALLET READY CHECK
   Used by app.js to gate blockchain operations.
   --------------------------------------------------------- */

function walletReady() {
  return !!(
    window.walletState.connected &&
    window.walletState.account &&
    window.walletState.chainId &&
    isAcceptableChain(window.walletState.chainId)
  );
}


/* ---------------------------------------------------------
   TOAST HELPER
   Uses the existing AgriTrace toast (#toast).
   wallet.js loads before app.js, so showToast may not exist
   yet. We use the toast DOM directly as fallback.
   --------------------------------------------------------- */

function showWalletToast(message, type) {
  if (typeof showToast === "function") {
    showToast(message, type);
    return;
  }

  /* Fallback: use the toast element directly */
  const toast = document.getElementById("toast");

  if (toast) {
    const titleEl   = document.getElementById("toastTitle");
    const messageEl = document.getElementById("toastMessage");

    if (titleEl)   titleEl.textContent   = "AgriTrace";
    if (messageEl) messageEl.textContent = message;

    toast.className = `toast show ${type || "success"}`;

    clearTimeout(showWalletToast._timer);
    showWalletToast._timer = setTimeout(() => {
      toast.className = "toast";
    }, 5500);
  } else {
    console.log(`[wallet:${type}] ${message}`);
  }
}


/* ---------------------------------------------------------
   METAMASK EVENT LISTENERS
   --------------------------------------------------------- */

function setupWalletListeners() {
  const ethereum = getEthereumProvider();
  if (!ethereum) return;

  ethereum.on("accountsChanged", (accounts) => {
    if (!accounts || accounts.length === 0) {
      disconnectWallet();
      showWalletToast("Wallet disconnected.", "error");
      return;
    }

    window.walletState.account = accounts[0];
    updateWalletUI();
    showWalletToast(`Account changed: ${shortAddress(accounts[0])}`, "success");
  });

  ethereum.on("chainChanged", (chainId) => {
    window.walletState.chainId = chainId;
    updateWalletUI();

    if (!isAcceptableChain(chainId)) {
      showWalletToast(
        "Please switch your wallet to Sepolia or Hardhat Local.",
        "error"
      );
    } else {
      showWalletToast(`Network changed to ${chainName(chainId)}.`, "success");
    }
  });
}


/* ---------------------------------------------------------
   DOM READY — bind wallet button & listeners
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  setupWalletListeners();

  const connectBtn = document.getElementById("connectWalletBtn");

  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      if (window.walletState.connected) {
        /* Already connected — toggle disconnect */
        disconnectWallet();
        showWalletToast("Wallet disconnected.", "success");
      } else {
        await connectWallet();
      }
    });
  }
});


/* ---------------------------------------------------------
   PUBLIC API
   Exposed on window.wallet for app.js and blockchain.js
   --------------------------------------------------------- */

window.wallet = {
  connectWallet,
  disconnectWallet,
  switchToSepolia,
  walletReady,
  shortAddress,
  getEthereumProvider,
  updateWalletUI,
  chainName,
  isAcceptableChain,
  txExplorerLink,
  getExplorerUrl
};
