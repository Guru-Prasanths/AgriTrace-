/* =========================================================
   AgriTrace Wallet Integration
   Real MetaMask + Ethers.js v6 BrowserProvider
   Supports Hardhat Local (31337) and Sepolia (11155111)
   No hardcoded private keys or simulated operator grants.
   ========================================================= */

/* ---------------------------------------------------------
   WALLET STATE
   Shared with blockchain.js and app.js
   --------------------------------------------------------- */

window.walletState = {
  account: null,
  chainId: null,
  connected: false,
  balanceEth: null,
  isOperator: false
};

/* ---------------------------------------------------------
   KNOWN CHAINS
   --------------------------------------------------------- */

const KNOWN_CHAINS = {
  "0x7a69":   { name: "Hardhat Local",  id: 31337,    explorer: null },
  "0xaa36a7": { name: "Sepolia",        id: 11155111, explorer: "https://sepolia.etherscan.io" }
};

/* Acceptable chain IDs for AgriTrace */
const ALLOWED_CHAIN_IDS = ["0x7a69", "0xaa36a7"];

/* ---------------------------------------------------------
   PROVIDER DETECTION (EIP-6963 + Injected Providers)
   --------------------------------------------------------- */

let announcedProviders = [];
if (typeof window !== "undefined") {
  window.addEventListener("eip6963:announceProvider", (event) => {
    if (event.detail && event.detail.provider) {
      announcedProviders.push(event.detail);
    }
  });
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}

function getEthereumProvider() {
  if (typeof window === "undefined") return null;

  // 1. EIP-6963 announced providers (modern MetaMask & side-panel extensions)
  if (announcedProviders.length > 0) {
    const metaMaskObj = announcedProviders.find(p =>
      p.info?.rdns === "io.metamask" ||
      p.info?.name?.toLowerCase().includes("metamask")
    );
    if (metaMaskObj?.provider) return metaMaskObj.provider;
    return announcedProviders[0].provider;
  }

  // 2. Multi-provider array
  if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
    const mm = window.ethereum.providers.find(p => p.isMetaMask);
    if (mm) return mm;
    return window.ethereum.providers[0];
  }

  // 3. Direct window.ethereum (standard MetaMask)
  if (window.ethereum) {
    return window.ethereum;
  }

  // 4. Web3 currentProvider fallback
  if (window.web3?.currentProvider) {
    return window.web3.currentProvider;
  }

  return null;
}

async function waitForEthereumProvider(timeoutMs = 600) {
  const existing = getEthereumProvider();
  if (existing) return existing;

  return new Promise((resolve) => {
    let resolved = false;

    const onProvider = () => {
      if (!resolved) {
        resolved = true;
        resolve(getEthereumProvider());
      }
    };

    window.addEventListener("ethereum#initialized", onProvider, { once: true });
    window.addEventListener("eip6963:announceProvider", onProvider, { once: true });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(getEthereumProvider());
      }
    }, timeoutMs);
  });
}

/* ---------------------------------------------------------
   HELPERS: SHORTEN ADDRESS & CHAIN INFO
   --------------------------------------------------------- */

function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function chainName(hexChainId) {
  const info = KNOWN_CHAINS[hexChainId?.toLowerCase()];
  return info ? info.name : `Unknown (${hexChainId || "none"})`;
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

function isAcceptableChain(hexChainId) {
  return ALLOWED_CHAIN_IDS.includes(hexChainId?.toLowerCase());
}

/* ---------------------------------------------------------
   POINTS RESOLVER (AUTHORITATIVE FROM BACKEND PROFILE)
   --------------------------------------------------------- */

function getAccountPoints() {
  // If user is authenticated in the Farmer/Seller portal, return actual points
  if (window.agriCurrentUser && window.agriCurrentUser.points_balance !== undefined) {
    return Number(window.agriCurrentUser.points_balance);
  }
  return 0;
}

/* ---------------------------------------------------------
   UPDATE UI ELEMENTS
   --------------------------------------------------------- */

async function updateWalletUI() {
  const btn             = document.getElementById("connectWalletBtn");
  const badge           = document.getElementById("networkBadge");
  const footer          = document.getElementById("footerNetwork");
  const modalAddress    = document.getElementById("modalConnectedAddress");
  const modalChain      = document.getElementById("modalChainDisplay");
  const modalBalance    = document.getElementById("modalBalanceDisplay");
  const modalOpLabel    = document.getElementById("modalOperatorStatusLabel");
  const ptsEl           = document.getElementById("accountPointsDisplay");
  const floatPts        = document.getElementById("floatHardhatBtn");

  const { account, chainId, connected } = window.walletState;
  const points = getAccountPoints();

  /* -- Update points badges if authenticated -- */
  if (ptsEl) ptsEl.textContent = `${points.toLocaleString()} PTS`;
  if (floatPts) floatPts.innerHTML = `⭐ ${points >= 1000 ? Math.floor(points / 1000) + "K" : points} PTS`;

  /* -- Fetch real ETH balance if connected -- */
  if (connected && account && window.ethers) {
    try {
      const ethereum = getEthereumProvider();
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const balWei = await provider.getBalance(account);
        const balEth = Number(ethers.formatEther(balWei)).toFixed(4);
        window.walletState.balanceEth = `${balEth} ETH`;
        if (modalBalanceDisplay) {
          modalBalanceDisplay.textContent = `Balance: ${balEth} ETH`;
        }
      }
    } catch (e) {
      console.warn("Could not fetch wallet balance:", e.message);
    }
  }

  /* -- Check operator status on-chain -- */
  if (connected && account && window.blockchain && typeof window.blockchain.isConnectedOperator === "function") {
    try {
      const isOp = await window.blockchain.isConnectedOperator();
      window.walletState.isOperator = isOp;
      if (modalOpLabel) {
        if (isOp) {
          modalOpLabel.innerHTML = `<span style="color:var(--green,#22c55e);font-weight:700;">✓ Smart-Contract Operator (Create, Verify & Sign Allowed)</span>`;
        } else {
          modalOpLabel.innerHTML = `<span style="color:var(--muted);font-weight:600;">Standard Wallet (View & Verify Only)</span>`;
        }
      }
    } catch {
      window.walletState.isOperator = false;
    }
  } else if (modalOpLabel) {
    modalOpLabel.textContent = "Connect your MetaMask wallet to interact with on-chain records.";
  }

  /* -- Update Modal details -- */
  if (modalAddress) {
    modalAddress.textContent = connected && account ? account : "Not Connected";
  }
  if (modalChain) {
    modalChain.textContent = connected && chainId ? chainName(chainId) : "Hardhat (31337)";
  }

  /* -- Wallet button in Nav -- */
  if (btn) {
    if (connected && account) {
      btn.innerHTML =
        `<span>🦊</span> ${shortAddress(account)} <span class="wallet-pts-pill" style="font-size:11px;background:rgba(30,56,44,0.1);">${window.walletState.isOperator ? 'OPERATOR' : 'CONNECTED'}</span>`;
      btn.classList.add("connected");
      btn.title = `Connected: ${account} on ${chainName(chainId)}`;
    } else {
      const connectText = (typeof t === 'function') ? t('wallet_connect') : 'Connect Wallet';
      btn.innerHTML = `<span class="wallet-btn-text" data-i18n="wallet_connect">${connectText}</span>`;
      btn.classList.remove("connected");
      btn.title = "Connect MetaMask Extension";
    }
  }

  /* -- Network badge in Header -- */
  if (badge) {
    const ok = connected && isAcceptableChain(chainId);
    const name = connected ? chainName(chainId) : "MetaMask Disconnected";

    badge.innerHTML = `
      <span class="status-dot" style="background:${ok ? "var(--green,#22c55e)" : "#ef4444"};"></span>
      <span>${name}</span>
    `;
    badge.title = "Click to open Network Selector";
  }

  /* -- Footer network label -- */
  if (footer) {
    if (connected && chainId) {
      const numId = chainNumericId(chainId);
      footer.textContent = `${chainName(chainId).toUpperCase()} • CHAIN ${numId}`;
    } else {
      footer.textContent = `WALLET DISCONNECTED • CHAIN 31337 / 11155111`;
    }
  }

  // Refresh operator status tags in forms
  if (typeof refreshOperatorStatus === "function") {
    refreshOperatorStatus();
  }
}

/* ---------------------------------------------------------
   CONNECT WALLET (GENUINE METAMASK EXTENSION CALL)
   --------------------------------------------------------- */

async function connectWallet() {
  let ethereum = getEthereumProvider();

  if (!ethereum) {
    ethereum = await waitForEthereumProvider(600);
  }

  if (!ethereum) {
    const isFileUrl = typeof window !== "undefined" && window.location.protocol === "file:";
    if (isFileUrl) {
      const goToLocal = confirm(
        "🦊 MetaMask Connection Notice:\n\n" +
        "Chrome blocks wallet extensions on 'file:///' URLs for security.\n\n" +
        "Please open AgriTrace via a local web server:\n" +
        "• http://localhost:5500 (Live Server)\n" +
        "• http://localhost:4001 (AgriTrace Backend)\n\n" +
        "Click OK to open http://localhost:4001 now!"
      );
      if (goToLocal) {
        window.location.href = "http://localhost:4001";
        return null;
      }
    } else {
      showWalletToast(
        "MetaMask was not detected in this browser. Please ensure the MetaMask extension is installed and enabled.",
        "error"
      );
    }

    const modal = document.getElementById("hardhatModal");
    if (modal) modal.classList.add("open");

    return null;
  }

  try {
    showWalletToast("🦊 Requesting MetaMask connection… Check the MetaMask extension window.", "info");

    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });

    if (!accounts || accounts.length === 0) {
      showWalletToast("No account was selected in MetaMask.", "error");
      return null;
    }

    const chainId = await ethereum.request({
      method: "eth_chainId"
    });

    window.walletState.account   = accounts[0];
    window.walletState.chainId   = chainId;
    window.walletState.connected = true;

    // Attach event listeners for account/network changes
    attachWalletListeners(ethereum);

    await updateWalletUI();

    if (!isAcceptableChain(chainId)) {
      showWalletToast(
        `Connected to unsupported network (${chainName(chainId)}). Please switch to Hardhat Local (31337) or Sepolia (11155111).`,
        "warning"
      );
    } else {
      showWalletToast(
        `🦊 MetaMask connected: ${shortAddress(accounts[0])} on ${chainName(chainId)}!`,
        "success"
      );
    }

    // Close modal if open
    const modal = document.getElementById("hardhatModal");
    if (modal) modal.classList.remove("open");

    return accounts[0];

  } catch (error) {
    console.error("Wallet connection error:", error);

    if (error.code === 4001) {
      showWalletToast("MetaMask connection request was cancelled.", "error");
    } else if (error.code === -32002) {
      showWalletToast("🦊 MetaMask popup is already pending approval! Click the MetaMask icon in your browser toolbar.", "warning");
    } else {
      showWalletToast("Could not connect MetaMask: " + (error.message || error), "error");
    }

    return null;
  }
}

let listenersAttached = false;
function attachWalletListeners(ethereum) {
  if (listenersAttached || !ethereum) return;
  listenersAttached = true;

  if (typeof ethereum.on === "function") {
    ethereum.on("accountsChanged", (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
        showWalletToast("MetaMask account disconnected.", "info");
      } else {
        window.walletState.account = accounts[0];
        window.walletState.connected = true;
        updateWalletUI();
        showWalletToast(`MetaMask switched account: ${shortAddress(accounts[0])}`, "info");
      }
    });

    ethereum.on("chainChanged", (hexChainId) => {
      window.walletState.chainId = hexChainId;
      updateWalletUI();
      showWalletToast(`Switched network to ${chainName(hexChainId)}`, "info");
    });
  }
}

/* ---------------------------------------------------------
   DISCONNECT (RESET CLIENT STATE)
   --------------------------------------------------------- */

function disconnectWallet() {
  window.walletState.account   = null;
  window.walletState.chainId   = null;
  window.walletState.connected = false;
  window.walletState.balanceEth = null;
  window.walletState.isOperator = false;
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
      params: [{ chainId: "0xaa36a7" }] // 11155111
    });

    showWalletToast("Switched to Sepolia Testnet (Chain 11155111).", "success");
    return true;

  } catch (error) {
    console.error("Network switch error:", error);

    if (error.code === 4902) {
      showWalletToast(
        "Sepolia is not enabled in this wallet. Please enable test networks in MetaMask settings.",
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
   --------------------------------------------------------- */

async function switchToHardhatLocal() {
  const ethereum = getEthereumProvider();
  if (!ethereum) {
    showWalletToast("MetaMask was not detected. Please install MetaMask to switch networks.", "error");
    return false;
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

    if (error.code === 4902 || error?.data?.originalError?.code === 4902 || String(error?.message).includes("Unrecognized chain ID")) {
      return await addHardhatLocalChain();
    } else if (error.code === 4001) {
      showWalletToast("Network switch to Hardhat Local was rejected.", "error");
      return false;
    } else {
      return await addHardhatLocalChain();
    }
  }
}

/* ---------------------------------------------------------
   ADD HARDHAT LOCAL CHAIN TO METAMASK
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
   WALLET READY CHECK
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
   --------------------------------------------------------- */

function showWalletToast(msg, type = "info") {
  if (typeof showToast === "function") {
    showToast(msg, type);
    return;
  }

  const toast = document.getElementById("toast");
  if (!toast) {
    console.log(`[${type.toUpperCase()}] ${msg}`);
    return;
  }

  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.style.display = "block";

  clearTimeout(showWalletToast._timer);
  showWalletToast._timer = setTimeout(() => {
    toast.style.display = "none";
  }, 4500);
}

/* ---------------------------------------------------------
   INITIALIZATION
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  // Bind wallet connect buttons
  const btn = document.getElementById("connectWalletBtn");
  if (btn) btn.addEventListener("click", connectWallet);

  const modalConnectBtn = document.getElementById("btnModalConnectMetaMask");
  if (modalConnectBtn) modalConnectBtn.addEventListener("click", connectWallet);

  // Bind network switch buttons
  const btnHardhat = document.getElementById("btnSwitchToHardhat");
  if (btnHardhat) btnHardhat.addEventListener("click", switchToHardhatLocal);

  const btnSepolia = document.getElementById("btnSwitchToSepolia");
  if (btnSepolia) btnSepolia.addEventListener("click", switchToSepolia);

  // Network badge in header opens network modal
  const badge = document.getElementById("networkBadge");
  if (badge) {
    badge.addEventListener("click", () => {
      const modal = document.getElementById("hardhatModal");
      if (modal) modal.classList.add("open");
    });
  }

  // Check if provider is already unlocked
  const ethereum = getEthereumProvider();
  if (ethereum && typeof ethereum.request === "function") {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        const chainId = await ethereum.request({ method: "eth_chainId" });
        window.walletState.account = accounts[0];
        window.walletState.chainId = chainId;
        window.walletState.connected = true;
        attachWalletListeners(ethereum);
      }
    } catch (e) {
      console.warn("Silent wallet check:", e.message);
    }
  }

  updateWalletUI();
});

/* ---------------------------------------------------------
   EXPORTS ON WINDOW
   --------------------------------------------------------- */

window.wallet = {
  walletState: window.walletState,
  connectWallet,
  disconnectWallet,
  switchToSepolia,
  switchToHardhatLocal,
  walletReady,
  shortAddress,
  chainName,
  chainNumericId,
  isAcceptableChain,
  txExplorerLink,
  updateWalletUI,
  getAccountPoints
};
