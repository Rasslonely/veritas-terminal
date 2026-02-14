export const CONTRACTS = {
  // BASE SEPOLIA (Existing)
  BASE_SEPOLIA: {
    VeritasToken: "0x...", // Fill if known
    VeritasTimelock: "0x...",
    VeritasGovernor: "0x...",
    PolicyRegistry: "0x...",
    VeritasVault: "0x..."
  },
  // ETHERLINK TESTNET (Shadownet)
  ETHERLINK_TESTNET: {
    VeritasToken: "0x4080ACE95cf319c40F952D2dCCE21b070270f14d",
    VeritasTimelock: "0xb38c87D42AA5fbF778e1093c61D5e4a010996EB0",
    VeritasGovernor: "0x8fA50988f36af835de40153E871689148aE54E49",
    PolicyRegistry: "0x3dAC8B24ee19c807eB9B1932AD789E3D03C1091D",
    VeritasVault: "0x7d614118529243DDc5C7ad19F4b89220634d1Ba0"
  },
  // OPBNB TESTNET
  OPBNB_TESTNET: {
    VeritasToken: "",
    VeritasTimelock: "",
    VeritasGovernor: "",
    PolicyRegistry: "",
    VeritasVault: ""
  }
};

export const getContracts = (chainId: number) => {
  switch (chainId) {
    case 84532: return CONTRACTS.BASE_SEPOLIA;
    case 127823: return CONTRACTS.ETHERLINK_TESTNET;
    default: return CONTRACTS.BASE_SEPOLIA;
  }
};
