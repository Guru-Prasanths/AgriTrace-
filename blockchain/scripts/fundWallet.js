const hre = require("hardhat");

async function main() {
  const [funder] = await hre.ethers.getSigners();

  const target =
    "0xdbe4c22e50a818494bea527a9e01cfc49e490bc3";

  console.log("Funder:", funder.address);
  console.log("Target:", target);

  const balanceBefore =
    await hre.ethers.provider.getBalance(target);

  console.log(
    "Target balance before:",
    hre.ethers.formatEther(balanceBefore),
    "ETH"
  );

  const tx = await funder.sendTransaction({
    to: target,
    value: hre.ethers.parseEther("10")
  });

  console.log("Funding transaction:", tx.hash);

  await tx.wait();

  const balanceAfter =
    await hre.ethers.provider.getBalance(target);

  console.log(
    "Target balance after:",
    hre.ethers.formatEther(balanceAfter),
    "ETH"
  );

  console.log("✅ MetaMask wallet funded successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });