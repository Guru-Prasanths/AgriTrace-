require("dotenv").config({ path: "../.env" });

require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: "0.8.24",

  networks: {
    hardhat: {},

    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY &&
        /^0x[a-fA-F0-9]{64}$/.test(process.env.DEPLOYER_PRIVATE_KEY)
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
      chainId: 11155111,
    },
  },
};

module.exports = config;