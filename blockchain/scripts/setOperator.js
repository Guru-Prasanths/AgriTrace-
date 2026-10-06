const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const target =
  "0xdbe4c22e50a818494bea527a9e01cfc49e490bc3";

  const contractAddress =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  console.log("Owner:", owner.address);
  console.log("Target operator:", target);

  const contract = await hre.ethers.getContractAt(
    "AgriTrace",
    contractAddress,
    owner
  );

  console.log("Setting operator...");

  const tx = await contract.setOperator(
    target,
    true
  );

  console.log("Transaction:", tx.hash);

  await tx.wait();

  const confirmed =
    await contract.isOperator(target);

  console.log(
    "Operator authorization confirmed:",
    confirmed
  );

  if (!confirmed) {
    throw new Error("Operator authorization failed.");
  }

  console.log(
    `${target} is now an AgriTrace operator.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });