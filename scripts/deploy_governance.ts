import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting Veritas Governance Deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Veritas Token (Voting Power)
  console.log("\n1. Deploying VeritasToken...");
  const VeritasToken = await ethers.getContractFactory("VeritasToken");
  const token = await VeritasToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("   ✅ VeritasToken deployed to:", tokenAddress);

  // 2. Deploy Timelock (The "Glass Wall")
  console.log("\n2. Deploying DRCPTimelock...");
  const minDelay = 120; // 2 minutes for testing (usually 1 day = 86400)
  const proposers: string[] = []; // Empty initially, will add Governor later
  const executors: string[] = []; // Empty initially, will add Governor later
  const admin = deployer.address;

  const DRCPTimelock = await ethers.getContractFactory("DRCPTimelock");
  const timelock = (await DRCPTimelock.deploy(minDelay, proposers, executors, admin)) as any;
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("   ✅ DRCPTimelock deployed to:", timelockAddress);

  // 3. Deploy Governor (The "Judge")
  console.log("\n3. Deploying DRCPGovernor...");
  const DRCPGovernor = await ethers.getContractFactory("DRCPGovernor");
  const governor = await DRCPGovernor.deploy(tokenAddress, timelockAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("   ✅ DRCPGovernor deployed to:", governorAddress);

  // 4. Deploy Policy Registry (The "Bridge")
  console.log("\n4. Deploying PolicyRegistry...");
  const PolicyRegistry = await ethers.getContractFactory("PolicyRegistry");
  const policyRegistry = (await PolicyRegistry.deploy()) as any;
  await policyRegistry.waitForDeployment();
  const policyRegistryAddress = await policyRegistry.getAddress();
  console.log("   ✅ PolicyRegistry deployed to:", policyRegistryAddress);

  // 5. Deploy Veritas Vault (The "Treasury")
  console.log("\n5. Deploying VeritasVault...");
  const VeritasVault = await ethers.getContractFactory("VeritasVault");
  const vault = (await VeritasVault.deploy()) as any;
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("   ✅ VeritasVault deployed to:", vaultAddress);

  // --- SETUP ROLES ---
  console.log("\n🔌 Wiring up Governance Roles...");

  // A. Grant Proposer Role to Prioritize Governor on Timelock
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();

  console.log("   - Granting PROPOSER_ROLE to Governor...");
  await timelock.grantRole(PROPOSER_ROLE, governorAddress);
  console.log("   - Granting EXECUTOR_ROLE to Governor (and zero address for Open Execution)...");
  await timelock.grantRole(EXECUTOR_ROLE, "0x0000000000000000000000000000000000000000"); // Anyone can execute if time passed

  // B. Grant EXECUTOR_ROLE on PolicyRegistry to Timelock
  // Only the Timelock can "Activate" a policy
  const REGISTRY_EXECUTOR_ROLE = await policyRegistry.EXECUTOR_ROLE();
  console.log("   - Granting EXECUTOR_ROLE on Registry to Timelock...");
  await policyRegistry.grantRole(REGISTRY_EXECUTOR_ROLE, timelockAddress);

  // C. Grant WITHDRAW_ROLE on Vault to Timelock
  const VAULT_WITHDRAW_ROLE = await vault.WITHDRAW_ROLE();
  console.log("   - Granting WITHDRAW_ROLE on Vault to Timelock...");
  await vault.grantRole(VAULT_WITHDRAW_ROLE, timelockAddress);

  // D. Revoke Admin Access where necessary (Optional for now, keeping for safety during dev)
  // await vault.revokeRole(VAULT_WITHDRAW_ROLE, deployer.address); 

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("----------------------------------------------------");
  console.log(`VeritasToken:   ${tokenAddress}`);
  console.log(`DRCPTimelock:   ${timelockAddress}`);
  console.log(`DRCPGovernor:   ${governorAddress}`);
  console.log(`PolicyRegistry: ${policyRegistryAddress}`);
  console.log(`VeritasVault:   ${vaultAddress}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
