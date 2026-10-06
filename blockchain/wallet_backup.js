let provider = null;
let signer = null;
let connectedAddress = null;

const SEPOLIA_CHAIN_ID = "0xaa36a7";

function getEthereumProvider() {
    if (typeof window === "undefined") {
        return null;
    }

    if (!window.ethereum) {
        return null;
    }

    return window.ethereum;
}

async function connectWallet() {
    try {
        provider = getEthereumProvider();

        if (!provider) {
            showWalletError(
                "MetaMask was not detected. Please open this website in a browser where MetaMask is installed."
            );
            return null;
        }

        const accounts = await provider.request({
            method: "eth_requestAccounts"
        });

        if (!accounts || accounts.length === 0) {
            showWalletError("No wallet account was selected.");
            return null;
        }

        connectedAddress = accounts[0];

        const chainId = await provider.request({
            method: "eth_chainId"
        });

        updateWalletUI(connectedAddress, chainId);

        if (chainId !== SEPOLIA_CHAIN_ID) {
            showNetworkWarning();
        } else {
            showWalletSuccess("Wallet connected successfully.");
        }

        return connectedAddress;

    } catch (error) {
        console.error("Wallet connection error:", error);

        if (error.code === 4001) {
            showWalletError("Wallet connection was rejected.");
        } else {
            showWalletError("Unable to connect to MetaMask.");
        }

        return null;
    }
}

async function switchToSepolia() {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
        showWalletError("MetaMask was not detected.");
        return false;
    }

    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: SEPOLIA_CHAIN_ID
                }
            ]
        });

        showWalletSuccess("Connected to Sepolia.");

        return true;

    } catch (error) {
        console.error("Network switch error:", error);

        if (error.code === 4902) {
            showWalletError(
                "Sepolia is not available in this wallet. Please enable the Sepolia test network in MetaMask."
            );
        } else if (error.code === 4001) {
            showWalletError("Network switch was rejected.");
        } else {
            showWalletError("Unable to switch to Sepolia.");
        }

        return false;
    }
}

function shortenAddress(address) {
    if (!address) return "";

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function updateWalletUI(address, chainId) {
    const walletButton = document.getElementById("connectWallet");
    const walletAddress = document.getElementById("walletAddress");
    const networkStatus = document.getElementById("networkStatus");

    if (walletButton) {
        walletButton.textContent = "Wallet Connected";
    }

    if (walletAddress) {
        walletAddress.textContent = shortenAddress(address);
    }

    if (networkStatus) {
        networkStatus.textContent =
            chainId === SEPOLIA_CHAIN_ID
                ? "Sepolia"
                : `Wrong Network (${chainId})`;
    }
}

function showNetworkWarning() {
    const status = document.getElementById("walletStatus");

    if (status) {
        status.textContent =
            "Please switch your wallet to Ethereum Sepolia.";
        status.className = "wallet-status warning";
    }
}

function showWalletSuccess(message) {
    const status = document.getElementById("walletStatus");

    if (status) {
        status.textContent = message;
        status.className = "wallet-status success";
    }
}

function showWalletError(message) {
    const status = document.getElementById("walletStatus");

    if (status) {
        status.textContent = message;
        status.className = "wallet-status error";
    }

    console.error(message);
}

function resetWalletState() {
    provider = null;
    signer = null;
    connectedAddress = null;

    const walletButton = document.getElementById("connectWallet");
    const walletAddress = document.getElementById("walletAddress");
    const networkStatus = document.getElementById("networkStatus");

    if (walletButton) {
        walletButton.textContent = "Connect Wallet";
    }

    if (walletAddress) {
        walletAddress.textContent = "Not connected";
    }

    if (networkStatus) {
        networkStatus.textContent = "Not connected";
    }
}

function setupWalletListeners() {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
        return;
    }

    ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
            resetWalletState();
            return;
        }

        connectedAddress = accounts[0];

        ethereum.request({
            method: "eth_chainId"
        }).then((chainId) => {
            updateWalletUI(connectedAddress, chainId);
        });
    });

    ethereum.on("chainChanged", (chainId) => {
        if (connectedAddress) {
            updateWalletUI(connectedAddress, chainId);
        }

        console.log("Network changed:", chainId);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupWalletListeners();

    const connectButton =
        document.getElementById("connectWallet");

    if (connectButton) {
        connectButton.addEventListener("click", connectWallet);
    }
});