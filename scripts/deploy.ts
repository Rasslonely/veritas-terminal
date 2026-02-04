const hardhatRuntime = require("hardhat");

async function main() {
  console.log("🚀 Deploying VeritasVault to Base Sepolia...");

  const VeritasVault = await hardhatRuntime.ethers.getContractFactory("VeritasVault");
  const vault = await VeritasVault.deploy();

  await vault.waitForDeployment();

  const address = await vault.getAddress();
  console.log(`✅ VeritasVault deployed to: ${address}`);
  console.log("Waiting for block confirmations...");
  
  // Wait a bit for indexing
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log("📜 Contract Address for .env.local: ", address);
  
  const fs = require("fs");
  fs.writeFileSync("deployed_contract.txt", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
export {};
