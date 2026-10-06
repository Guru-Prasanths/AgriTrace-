const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const AgriTrace = await hre.ethers.getContractFactory("AgriTrace");
  const contract = await AgriTrace.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const network = await hre.ethers.provider.getNetwork();
  const deployment = {
    contractName: "AgriTrace",
    address,
    chainId: network.chainId.toString(),
    deployedAt: new Date().toISOString(),
  };

  const outputDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, `${network.chainId}.json`), JSON.stringify(deployment, null, 2));

  console.log(`AgriTrace deployed to: ${address}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`Deployment metadata: ${path.join("blockchain", "deployments", `${network.chainId}.json`)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
