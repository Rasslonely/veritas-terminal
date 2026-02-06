import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Mocking the "On-Chain" Data for the UI since we aren't deploying the contract live-live.
export const getAgentProfile = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    // In a real app, this would query the Smart Contract via an Adapter.
    // Here, we return the "God Tier" metadata.
    
    // Simulate finding the user's Agent Node
    const identity = {
        nodeId: "VTS-ALPHA-882",
        status: "ONLINE",
        network: "BASE_SEPOLIA",
        reputation: 985, // out of 1000
        services: [
            { id: "DAMAGE_ANALYSIS", price: "0.001 ETH" },
            { id: "FRAUD_DETECTION", price: "0.002 ETH" },
            { id: "INSTANT_SETTLEMENT", price: "0.5% FEE" }
        ],
        contractAddress: "0x712893...A12B", // Mock Contract
        tokenId: "#001"
    };

    return identity;
  },
});

export const registerNode = mutation({
  args: { 
    displayName: v.string(),
    services: v.array(v.string())
  },
  handler: async (ctx, args) => {
    // This would trigger the "mintIdentity" transaction on the blockchain adapter.
    // For now, we just log it.
    console.log(`Minting Agent Identity for ${args.displayName}...`);
    return { status: "MINT_INITIATED", txHash: "0x82...99" };
  },
});
