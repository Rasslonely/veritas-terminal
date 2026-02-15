"use node";

import { IBlockchainAdapter } from "./adapter";
import { createWalletClient, http, parseEther, createPublicClient, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Define supported chains configuration
const CHAINS = {
    "BASE": {
        id: 84532,
        name: "Base Sepolia",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: ["https://sepolia.base.org"] } }
    },
    "ETHERLINK": {
        id: 128123,
        name: "Etherlink Testnet",
        nativeCurrency: { name: "Tezos", symbol: "XTZ", decimals: 18 },
        rpcUrls: { default: { http: ["https://node.ghostnet.etherlink.com"] } }
    },
    "OPBNB": {
        id: 5611,
        name: "opBNB Testnet",
        nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
        rpcUrls: { default: { http: ["https://opbnb-testnet-rpc.bnbchain.org"] } }
    }
};

export class EVMAdapter implements IBlockchainAdapter {
  private walletClient;
  private publicClient;
  private account;
  private chain;

  constructor(chainKey: "BASE" | "ETHERLINK" | "OPBNB" = "BASE") {
    const chainDef = CHAINS[chainKey];
    this.chain = defineChain(chainDef);

    // Dynamic Key selection based on Chain
    let pKey: string | undefined;
    if (chainKey === "BASE") pKey = process.env.BASE_PRIVATE_KEY;
    else if (chainKey === "ETHERLINK") pKey = process.env.ETHERLINK_PRIVATE_KEY;
    else if (chainKey === "OPBNB") pKey = process.env.OPBNB_PRIVATE_KEY;

    // DEBUG LOGGING (Masked)
    if (pKey) {
        console.log(`✅ ${chainKey}_PRIVATE_KEY loaded. Length: ${pKey.length}`);
        if (!pKey.startsWith("0x")) {
             console.warn(`⚠️ ${chainKey}_PRIVATE_KEY missing '0x' prefix. Auto-fixing.`);
             pKey = `0x${pKey}`;
        }
    } else {
        console.warn(`⚠️ ${chainKey}_PRIVATE_KEY is UNDEFINED in process.env`);
    }

    if (!pKey) {
        console.warn(`⚠️ ${chainKey}_PRIVATE_KEY missing. EVMAdapter (${chainKey}) in read-only mode.`);
    }

    this.account = pKey ? privateKeyToAccount(pKey as `0x${string}`) : undefined;

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http()
    });

    if (this.account) {
        this.walletClient = createWalletClient({
            account: this.account,
            chain: this.chain,
            transport: http()
        });
    }
  }

  async logEvidence(evidence: string): Promise<string> {
    // On EVM, we log evidence as a transaction input data or a specific event
    // For cost efficiency on L2, we'll send a self-transaction with data
    if (!this.walletClient || !this.account) throw new Error("Wallet not configured for EVM");

    try {
        const hash = await this.walletClient.sendTransaction({
            to: this.account.address,
            value: BigInt(0),
            data: `0x${Buffer.from(evidence).toString('hex')}` as `0x${string}`
        });

        return hash;
    } catch (error) {
        console.error("❌ EVM Log Failed:", error);
        throw error;
    }
  }

  async payoutClaim(amount: number, recipient: string): Promise<boolean> {
    if (!this.walletClient || !this.account) throw new Error("Wallet not configured for EVM");

    try {
        // Simple Native ETH (Sepolia ETH) transfer for MVP
        // In prod, this would likely interact with a USDC contract
        const hash = await this.walletClient.sendTransaction({
            to: recipient as `0x${string}`,
            value: parseEther(amount.toString())
        });
        
        console.log(`💸 Payout tx confirmed: ${hash}`);
        return true;

    } catch (error) {
        console.error("❌ EVM Payout Failed:", error);
        return false;
    }
  }

  async stake(amount: number, userAddress: string): Promise<string> {
      // THE TRUTH BOND
      if (!this.walletClient || !this.account) throw new Error("Wallet not configured");

      try {
          const hash = await this.walletClient.sendTransaction({
              to: this.account.address,
              value: BigInt(0),
              data: `0x${Buffer.from(`STAKE_LOCKED_FOR_${userAddress}_${amount}_Native`).toString('hex')}` as `0x${string}`
          });
          console.log(`🔒 Stake Bond Confirmed: ${hash}`);
          return hash;
      } catch (e) {
          console.error("Stake Failed:", e);
          throw e;
      }
  }

  async slashStake(userAddress: string, amount: number): Promise<string> {
    // BURN IT / SEND TO TREASURY
      if (!this.walletClient || !this.account) throw new Error("Wallet not configured");
      try {
          const hash = await this.walletClient.sendTransaction({
              to: "0x000000000000000000000000000000000000dEaD", // Burn Address
              value: BigInt(0), // We don't hold the funds in this burner wallet, but we record the "Slash" intent
              data: `0x${Buffer.from(`SLASH_FRAUD_${userAddress}`).toString('hex')}` as `0x${string}`
          });
          console.log(`🔪 Stake Slashed: ${hash}`);
          return hash;
      } catch (e) {
          console.error("Slash Failed:", e);
          throw e;
      }
  }

  async returnStake(userAddress: string, amount: number): Promise<string> {
      // UNLOCK / RETURN
      if (!this.walletClient || !this.account) throw new Error("Wallet not configured");
      try {
          const hash = await this.walletClient.sendTransaction({
              to: userAddress as `0x${string}`,
              value: BigInt(0),
              data: `0x${Buffer.from(`STAKE_RETURNED_VERIFIED`).toString('hex')}` as `0x${string}`
          });
          console.log(`🔓 Stake Returned: ${hash}`);
          return hash;
      } catch (e) {
          console.error("Return Stake Failed:", e);
          throw e;
      }
  }
  async mintPolicyNFT(userAddress: string, metadata: string): Promise<string> {
      console.log("Mock Mint Policy NFT on EVM");
      return "0xMOCK_NFT_MINT_HASH";
  }

  async burnPolicyNFT(tokenId: string, serialNumber: number): Promise<string> {
      console.log("Mock Burn Policy NFT on EVM");
      return "0xMOCK_NFT_BURN_HASH";
  }
}
