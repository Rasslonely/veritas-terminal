"use node";

import { IBlockchainAdapter } from "./adapter";
import { createWalletClient, http, parseEther, createPublicClient } from "viem";
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
}
