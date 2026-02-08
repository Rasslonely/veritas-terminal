"use node";

import { IBlockchainAdapter } from "./adapter";
import { createWalletClient, http, parseEther, createPublicClient, parseGwei } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export class BaseAdapter implements IBlockchainAdapter {
  private walletClient;
  private publicClient;
  private account;

  constructor() {
    // In a real app, we'd use a secure key management system
    // For this hackathon demo, we use a burner key from env or generate one
    const pKey = process.env.BASE_PRIVATE_KEY as `0x${string}`;
    
    if (!pKey) {
        console.warn("⚠️ BASE_PRIVATE_KEY missing. BaseAdapter in read-only mode.");
    }

    this.account = pKey ? privateKeyToAccount(pKey) : undefined;

    this.publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    if (this.account) {
        this.walletClient = createWalletClient({
            account: this.account,
            chain: baseSepolia,
            transport: http()
        });
    }
  }

  async logEvidence(evidence: string): Promise<string> {
    // On EVM, we log evidence as a transaction input data or a specific event
    // For cost efficiency on L2, we'll send a self-transaction with data
    if (!this.walletClient || !this.account) throw new Error("Wallet not configured for Base");

    try {
        const hash = await this.walletClient.sendTransaction({
            to: this.account.address,
            value: BigInt(0),
            data: `0x${Buffer.from(evidence).toString('hex')}` as `0x${string}`
        });

        return hash;
    } catch (error) {
        console.error("❌ Base Log Failed:", error);
        throw error;
    }
  }

  async payoutClaim(amount: number, recipient: string): Promise<boolean> {
    if (!this.walletClient || !this.account) throw new Error("Wallet not configured for Base");

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
        console.error("❌ Base Payout Failed:", error);
        return false;
    }
  }

  async stake(amount: number, userAddress: string): Promise<string> {
      // THE TRUTH BOND
      // In a real app, this would check if the User *actually* sent funds to the Vault.
      // For this Agent demo, we assume the Frontend triggered the tx and passed the hash, 
      // OR we perform a "simulated lock" if we are behaving as the custodian.
      
      // Let's simulate a "Locking" transaction on-chain for the audit trail.
      // We send 0 ETH but with data payload "STAKE_LOCKED"
      if (!this.walletClient || !this.account) throw new Error("Wallet not configured");

      try {
          const hash = await this.walletClient.sendTransaction({
              to: this.account.address,
              value: BigInt(0),
              data: `0x${Buffer.from(`STAKE_LOCKED_FOR_${userAddress}_${amount}_USDC`).toString('hex')}` as `0x${string}`
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
          // Send 0.0001 ETH back as a "Thank You" / Gas refund? 
          // Or just record the unlock.
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
}
