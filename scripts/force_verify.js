const hre = require("hardhat");

async function main() {
  console.log("🛡️  VERITAS SOURCIFY VERIFIER");
  console.log("� Using Sourcify (bypasses broken Blockscout SSL)\n");

  const contracts = [
    { name: "VeritasToken",    address: "0x4080ACE95cf319c40F952D2dCCE21b070270f14d", args: [] },
    { name: "VeritasTimelock", address: "0xb38c87D42AA5fbF778e1093c61D5e4a010996EB0", args: [120, [], [], "0x5f80439206742Ac04e031665d1DFEDe11C9730aD"] },
    { name: "VeritasGovernor", address: "0x8fA50988f36af835de40153E871689148aE54E49", args: ["0x4080ACE95cf319c40F952D2dCCE21b070270f14d", "0xb38c87D42AA5fbF778e1093c61D5e4a010996EB0"] },
    { name: "PolicyRegistry",  address: "0x3dAC8B24ee19c807eB9B1932AD789E3D03C1091D", args: [] },
    { name: "VeritasVault",    address: "0x7d614118529243DDc5C7ad19F4b89220634d1Ba0", args: [] }
  ];

  for (const c of contracts) {
    console.log(`🔍 [${c.name}] ${c.address}`);
    try {
      await hre.run("verify:sourcify", { address: c.address });
      console.log(`✅ ${c.name} VERIFIED on Sourcify!\n`);
    } catch (error) {
      if (error.message && error.message.includes("already verified")) {
        console.log(`⚠️  ${c.name} already verified.\n`);
      } else {
        console.error(`❌ ${c.name}: ${error.message}\n`);
      }
    }
  }

  console.log("🏁 Done. Check: https://repo.sourcify.dev/contracts/full_match/127823/");
}

main().catch(console.error);
