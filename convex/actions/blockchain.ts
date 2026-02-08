"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

export const stakeTruthBond = action({
  args: {
    amount: v.number(),
    chain: v.string(), // "BASE" | "HEDERA"
    userAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const { getAdapter } = await import("../blockchain/adapter");
    const adapter = await getAdapter(args.chain as "BASE" | "HEDERA");
    
    console.log(`🔒 Initiating Truth Bond Stake: ${args.amount} ${args.chain} for ${args.userAddress}`);
    
    // In a real app, the USER signs this client-side.
    // For this AGENT DEMO, the Agent (Server) logs the "Lock" event on behalf of the user
    // or verifies a tx hash sent by the user. 
    // Here we treat it as the Agent 'locking' the user's pre-deposited funds or logging the event.
    const txHash = await adapter.stake(args.amount, args.userAddress);
    
    return txHash;
  },
});

export const slashTruthBond = action({
    args: {
        amount: v.number(),
        chain: v.string(),
        userAddress: v.string(),
        reason: v.string(),
    },
    handler: async (ctx, args) => {
        const { getAdapter } = await import("../blockchain/adapter");
        const adapter = await getAdapter(args.chain as "BASE" | "HEDERA");
        
        console.log(`🔪 SLASHING Truth Bond: ${args.userAddress}`);
        const txHash = await adapter.slashStake(args.userAddress, args.amount);
        return txHash;
    }
});
