"use node";

import { IBlockchainAdapter } from "./adapter";
import { 
  Client, 
  TopicMessageSubmitTransaction, 
  TransferTransaction, 
  Hbar, 
  AccountId, 
  PrivateKey
} from "@hashgraph/sdk";

export class HederaAdapter implements IBlockchainAdapter {
  private client: Client;
  private topicId: string;

  constructor() {
    // Initialize client based on environment
    const network = process.env.HEDERA_NETWORK || "testnet";
    
    if (network === "mainnet") {
      this.client = Client.forMainnet();
    } else {
      this.client = Client.forTestnet();
    }

    const operatorId = process.env.HEDERA_OPERATOR_ID;
    const operatorKey = process.env.HEDERA_OPERATOR_KEY;

    if (!operatorId || !operatorKey) {
      console.warn("⚠️ HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY missing. HederaAdapter in readonly/fail mode.");
      // We don't throw here to allow app to start, but methods will fail
      this.client = Client.forTestnet(); // Fallback
    } else {
      this.client.setOperator(
        AccountId.fromString(operatorId),
        PrivateKey.fromString(operatorKey)
      );
    }

    this.topicId = process.env.HEDERA_TOPIC_ID || "";
  }

  async logEvidence(evidence: string): Promise<string> {
    if (!this.topicId) {
      throw new Error("HEDERA_TOPIC_ID not configured");
    }

    try {
      // 1. Create a SHA-256 hash of the evidence for data integrity verification
      // (In a real app, we might log the full JSON if it fits, or just the hash)
      // For Veritas, we log the full JSON to HCS (it has a decent size limit ~6kb)
      // plus a hash for quick reference.
      
      // const crypto = require("crypto");
      // const hash = crypto.createHash("sha256").update(evidence).digest("hex");
      
      const message = JSON.stringify({
        source: "VERITAS_TERMINAL_V1",
        timestamp: Date.now(),
        payload: JSON.parse(evidence) // Ensure it's valid JSON object
      });

      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(message);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      // Return the Topic Sequence Number as the "ID" of this log
      return receipt.topicSequenceNumber?.toString() || "0";

    } catch (error) {
      console.error("❌ Hedera HCS Log Failed:", error);
      throw new Error(`Hedera logging failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async payoutClaim(amount: number, recipient: string): Promise<boolean> {
    try {
      if (!process.env.HEDERA_OPERATOR_ID) throw new Error("Operator ID missing");

      // Simple HBAR transfer for the MVP
      // In production, this would use HTS (Token) transfer for USDC
      const transaction = new TransferTransaction()
        .addHbarTransfer(
          AccountId.fromString(process.env.HEDERA_OPERATOR_ID), 
          new Hbar(-amount)
        )
        .addHbarTransfer(
            AccountId.fromString(recipient), 
            new Hbar(amount)
        );

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      
      return receipt.status.toString() === "SUCCESS";

    } catch (error) {
      console.error("❌ Hedera Payout Failed:", error);
      return false; // Don't crash, just report failure
    }
  }

  async stake(amount: number, userAddress: string): Promise<string> {
      // For Hedera, we'd use HTS (Hedera Token Service)
      // For this demo, we'll log the "STAKE_LOCKED" event to HCS
      return this.logEvidence(JSON.stringify({
          type: "STAKE_LOCKED",
          user: userAddress,
          amount: amount,
          currency: "HBAR",
          timestamp: Date.now()
      }));
  }

  async slashStake(userAddress: string, amount: number): Promise<string> {
      // Log SLASH event
      return this.logEvidence(JSON.stringify({
          type: "STAKE_SLASHED",
          user: userAddress,
          amount: amount,
          reason: "FRAUD_DETECTED",
          timestamp: Date.now()
      }));
  }

  async returnStake(userAddress: string, amount: number): Promise<string> {
      // Log RETURN event
      return this.logEvidence(JSON.stringify({
          type: "STAKE_RETURNED",
          user: userAddress,
          amount: amount,
          reason: "CLAIM_VERIFIED",
          timestamp: Date.now()
      }));
  }
  async mintPolicyNFT(userAddress: string, metadata: string): Promise<string> {
      return this.logEvidence(JSON.stringify({
          type: "POLICY_MINTED",
          user: userAddress,
          metadata: JSON.parse(metadata),
          timestamp: Date.now()
      }));
  }

  async burnPolicyNFT(tokenId: string, serialNumber: number): Promise<string> {
      return this.logEvidence(JSON.stringify({
          type: "POLICY_BURNED",
          tokenId: tokenId,
          serial: serialNumber,
          timestamp: Date.now()
      }));
  }
}
