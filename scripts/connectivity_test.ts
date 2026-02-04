const hre = require("hardhat");
const fs = require("fs");

async function main() {
  let log = "Starting Test...\n";
  try {
    const key = process.env.BASE_PRIVATE_KEY;
    log += `Key Found: ${key ? "YES (Length: " + key.length + ")" : "NO"}\n`;
    
    log += "Connecting to provider...\n";
    const block = await hre.ethers.provider.getBlockNumber();
    log += `Current Block: ${block}\n`;
    
    log += "Wallet check...\n";
    const [deployer] = await hre.ethers.getSigners();
    log += `Deployer: ${deployer.address}\n`;
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    log += `Balance: ${hre.ethers.formatEther(balance)} ETH\n`;

  } catch (error: any) {
    log += `ERROR: ${error.message}\n`;
    log += `STACK: ${error.stack}\n`;
  }
  
  fs.writeFileSync("connectivity_test.txt", log);
  console.log("Test Complete");
}

main();
export {};
