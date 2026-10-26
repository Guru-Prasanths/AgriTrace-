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
  connected: false,
  accountName: null,
  isHardhatLocal: false
};


/* ---------------------------------------------------------
   HARDHAT LOCAL PRESET ACCOUNT & POINTS
   Account name: Hardhat Local
   Alternate to Sepolia with 100,000 abundant test points
   --------------------------------------------------------- */

const HARDHAT_LOCAL_ACCOUNT = {
  name: "Hardhat Local",
  address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  chainIdHex: "0x7a69",
  chainIdDec: 31337,
  rpcUrl: "http://127.0.0.1:8545",
  defaultPoints: 100000,
  balanceEth: "10,000 ETH"
};

/* Points Tracking */
function getAccountPoints(account = window.walletState.account) {
  const isHardhat = !account || (account && account.toLowerCase() === HARDHAT_LOCAL_ACCOUNT.address.toLowerCase()) || window.walletState.isHardhatLocal;
  const key = `agritrace_pts_${(account || "hardhat").toLowerCase()}`;
  const stored = localStorage.getItem(key);
  if (stored !== null) return parseInt(stored, 10);
  const initial = isHardhat ? HARDHAT_LOCAL_ACCOUNT.defaultPoints : 25000;
  localStorage.setItem(key, initial);
  return initial;
}

function updateAccountPoints(delta, account = window.walletState.account) {
  const current = getAccountPoints(account);
  const updated = Math.max(0, current + delta);
  const key = `agritrace_pts_${(account || "hardhat").toLowerCase()}`;
  localStorage.setItem(key, updated);
  updateWalletUI();
  return updated;
}

function claimPointsFaucet(amount = 25000) {
  const total = updateAccountPoints(amount);
  showWalletToast(`🎁 Added +${amount.toLocaleString()} points to your account! Total: ${total.toLocaleString()} PTS`, "success");
  return total;
}


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
  const ptsEl     = document.getElementById("accountPointsDisplay");
  const floatPts  = document.getElementById("floatHardhatBtn");
  const modalPts  = document.getElementById("modalPointsDisplay");

  const { account, chainId, connected, isHardhatLocal } = window.walletState;
  const isHardhatAcc = isHardhatLocal || (account && account.toLowerCase() === HARDHAT_LOCAL_ACCOUNT.address.toLowerCase());
  const points = getAccountPoints(account);

  /* -- Update points displays -- */
  if (ptsEl) ptsEl.textContent = `${points.toLocaleString()} PTS`;
  if (floatPts) floatPts.innerHTML = `⭐ ${points >= 1000 ? Math.floor(points / 1000) + "K" : points} PTS`;
  if (modalPts) modalPts.textContent = `${points.toLocaleString()} AgriPoints`;

  /* -- Wallet button -- */
  if (btn) {
    if (connected && account) {
      const label = isHardhatAcc ? "⭐ Hardhat Local" : shortAddress(account);
      btn.innerHTML =
        `<span>✦</span> ${label} <span class="wallet-pts-pill">${points >= 1000 ? Math.floor(points/1000) + 'K' : points}p</span>`;
      btn.classList.add("connected");
      btn.title = `Connected: ${account} (${points.toLocaleString()} PTS)`;
    } else {
      btn.innerHTML =
        `<span>✧</span> Connect Wallet`;
      btn.classList.remove("connected");
      btn.title = "Connect MetaMask or Hardhat Local Account";
    }
  }

  /* -- Network badge -- */
  if (badge) {
    const name = connected ? chainName(chainId) : "Hardhat Local (Offline)";
    const ok   = connected && isAcceptableChain(chainId);

    badge.innerHTML = `
      <span class="status-dot" style="background:${ok ? "var(--accent, #39ff88)" : "#39ff88"};"></span>
      <span>${name}</span>
    `;
    badge.title = "Click to open Hardhat Local & Network Switcher";
  }

  /* -- Footer network label -- */
  if (footer) {
    if (connected && chainId) {
      const numId = chainNumericId(chainId);
      footer.textContent = `${chainName(chainId).toUpperCase()} • CHAIN ${numId} • ${points.toLocaleString()} PTS`;
    } else {
      footer.textContent = `HARDHAT LOCAL • CHAIN 31337 • ${points.toLocaleString()} PTS`;
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
  if (!ethereum) {
    showWalletToast("MetaMask was not detected. Please install MetaMask to switch networks.", "error");
    return false;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }]
    });

    showWalletToast("Switched to Sepolia Testnet (Chain 11155111).", "success");
    return true;

  } catch (error) {
    console.error("Network switch error:", error);

    if (error.code === 4902) {
      showWalletToast(
        "Sepolia is not available in this wallet. Please enable Sepolia test network in MetaMask settings.",
        "error"
      );
    } else if (error.code === 4001) {
      showWalletToast("Network switch was rejected.", "error");
    } else {
      showWalletToast("Unable to switch to Sepolia: " + (error.message || error), "error");
    }

    return false;
  }
}


/* ---------------------------------------------------------
   SWITCH TO HARDHAT LOCAL
   Allows MetaMask to access Hardhat Local alternate to Sepolia
   --------------------------------------------------------- */

async function switchToHardhatLocal() {
  const ethereum = getEthereumProvider();
  if (!ethereum) {
    // If no MetaMask in browser, activate preset Hardhat Local account directly
    connectHardhatLocalAccount();
    return true;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7a69" }] // 31337
    });

    showWalletToast("Switched MetaMask to Hardhat Local network (Chain 31337).", "success");
    return true;

  } catch (error) {
    console.warn("Hardhat local switch check:", error);

    // 4902 error code indicates chain has not been added to MetaMask
    if (error.code === 4902 || error?.data?.originalError?.code === 4902 || String(error?.message).includes("Unrecognized chain ID")) {
      return await addHardhatLocalChain();
    } else if (error.code === 4001) {
      showWalletToast("Network switch to Hardhat Local was rejected.", "error");
      return false;
    } else {
      // Fallback try adding chain directly
      return await addHardhatLocalChain();
    }
  }
}

/* ---------------------------------------------------------
   ADD HARDHAT LOCAL TO METAMASK
   --------------------------------------------------------- */

async function addHardhatLocalChain() {
  const ethereum = getEthereumProvider();
  if (!ethereum) return false;

  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x7a69", // 31337
          chainName: "Hardhat Local",
          rpcUrls: ["http://127.0.0.1:8545"],
          nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
          },
          blockExplorerUrls: null
        }
      ]
    });

    showWalletToast("Hardhat Local network added to MetaMask and selected!", "success");
    return true;

  } catch (addError) {
    console.error("Failed to add Hardhat Local network:", addError);
    if (addError.code === 4001) {
      showWalletToast("Adding Hardhat Local network was rejected.", "error");
    } else {
      showWalletToast("Could not auto-add Hardhat Local: " + (addError.message || addError), "error");
    }
    return false;
  }
}

/* ---------------------------------------------------------
   CONNECT AS HARDHAT LOCAL ACCOUNT
   Direct 1-Click Access with 100,000 Points & Full Permissions
   --------------------------------------------------------- */

function connectHardhatLocalAccount() {
  window.walletState.account = HARDHAT_LOCAL_ACCOUNT.address;
  window.walletState.chainId = HARDHAT_LOCAL_ACCOUNT.chainIdHex;
  window.walletState.connected = true;
  window.walletState.isHardhatLocal = true;
  window.walletState.accountName = HARDHAT_LOCAL_ACCOUNT.name;

  localStorage.setItem("agritrace_preferred_account", "hardhat_local");
  updateWalletUI();

  const pts = getAccountPoints(HARDHAT_LOCAL_ACCOUNT.address);
  showWalletToast(`⭐ Connected as ${HARDHAT_LOCAL_ACCOUNT.name}! Available Balance: ${pts.toLocaleString()} Points (${HARDHAT_LOCAL_ACCOUNT.balanceEth})`, "success");

  // Refresh operator status if available
  if (typeof refreshOperatorStatus === "function") {
    refreshOperatorStatus();
  }

  // Close modal if open
  const modal = document.getElementById("hardhatModal");
  if (modal) modal.classList.remove("open");

  return HARDHAT_LOCAL_ACCOUNT.address;
}

/* Copy Hardhat Local Private Key to Clipboard */
function copyHardhatPrivateKey() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(HARDHAT_LOCAL_ACCOUNT.privateKey)
      .then(() => {
        showWalletToast("Copied Hardhat Local private key to clipboard! Import into MetaMask under Account -> Import Account.", "success");
      })
      .catch(() => {
        prompt("Copy Hardhat Local Private Key:", HARDHAT_LOCAL_ACCOUNT.privateKey);
      });
  } else {
    prompt("Copy Hardhat Local Private Key:", HARDHAT_LOCAL_ACCOUNT.privateKey);
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
    window.walletState.isHardhatLocal = accounts[0].toLowerCase() === HARDHAT_LOCAL_ACCOUNT.address.toLowerCase();
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

  // Auto-connect if user previously selected Hardhat Local
  if (localStorage.getItem("agritrace_preferred_account") === "hardhat_local") {
    connectHardhatLocalAccount();
  }

  const connectBtn = document.getElementById("connectWalletBtn");
  if (connectBtn) {
    connectBtn.addEventListener("click", async () => {
      if (window.walletState.connected) {
        /* If clicking connected wallet, open network & account modal for easy access */
        const modal = document.getElementById("hardhatModal");
        if (modal) {
          modal.classList.add("open");
        } else {
          disconnectWallet();
          showWalletToast("Wallet disconnected.", "success");
        }
      } else {
        await connectWallet();
      }
    });
  }

  // Network badge click also opens the Hardhat Local & Network Switcher
  const networkBadge = document.getElementById("networkBadge");
  if (networkBadge) {
    networkBadge.style.cursor = "pointer";
    networkBadge.addEventListener("click", () => {
      const modal = document.getElementById("hardhatModal");
      if (modal) modal.classList.toggle("open");
    });
  }

  // Hardhat Local button in nav
  const hardhatBtn = document.getElementById("hardhatAccountBtn");
  if (hardhatBtn) {
    hardhatBtn.addEventListener("click", () => {
      const modal = document.getElementById("hardhatModal");
      if (modal) modal.classList.toggle("open");
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
  switchToHardhatLocal,
  addHardhatLocalChain,
  connectHardhatLocalAccount,
  copyHardhatPrivateKey,
  getAccountPoints,
  updateAccountPoints,
  claimPointsFaucet,
  HARDHAT_LOCAL_ACCOUNT,
  walletReady,
  shortAddress,
  getEthereumProvider,
  updateWalletUI,
  chainName,
  isAcceptableChain,
  txExplorerLink,
  getExplorerUrl
};
