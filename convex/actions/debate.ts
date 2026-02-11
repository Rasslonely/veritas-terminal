"use node";

import { action } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

export const runAgentDebate = action({
  args: { 
    claimId: v.id("claims"), 
    analysis: v.any(),
    chainMode: v.optional(v.string()) // "HEDERA" | "BASE"
  }, 
  handler: async (ctx, args) => {
    const { claimId, analysis } = args;

    // Trigger the God-Tier Fractal Orchestrator
    // This will spawn specialized investigative branches
    // @ts-ignore
    await ctx.runAction(internal.agent.orchestrator.coordinateInvestigation, {
        claimId,
        initialAnalysis: analysis
    });
  },
});

export const settleClaim = action({
  args: { 
    claimId: v.id("claims"), 
    recipientAddress: v.string(),
    amount: v.number(),
    chainMode: v.optional(v.string())
  }, 
  handler: async (ctx, args) => {
    const { claimId, recipientAddress, amount, chainMode = "BASE" } = args;

    // Load Adapter
    const { getAdapter } = await import("../blockchain/adapter");
    const adapter = await getAdapter(chainMode as "HEDERA" | "BASE" || "BASE");

    // Execute Payout
    console.log(`Initiating Settlement on ${chainMode} to ${recipientAddress} for ${amount}...`);
    const success = await adapter.payoutClaim(amount, recipientAddress);

    if (success) {
       await ctx.runMutation(internal.debateInternal.updateClaimStatus, {
           claimId,
           status: "SETTLED"
       });

       // BURN FLASH POLICY NFT (RWA Lifecycle)
       // We fetch the claim to check for a linked policy
       // Using 'any' cast for 'api' because we know getClaim exists but valid types might be lagging
       const claim = await ctx.runQuery(api.claims.getClaim, { claimId });
       
       if (claim && claim.policyId) {
           console.log(`🔥 Burning Flash Policy NFT for Claim ${claimId}`);
           try {
               // We use the 'api' object imported from _generated/api
               // If type checking fails on 'actions', we might need to fix imports or just cast
               // @ts-ignore
               await ctx.runAction(api.actions.policy.burnPolicy, { 
                   policyId: claim.policyId,
                   reason: "CLAIM_PAYOUT_COMPLETE"
               });
           } catch (e) {
               console.error("Failed to burn policy NFT (Non-blocking):", e);
           }
       }

    } else {
        throw new Error(`Blockchain payout failed on ${chainMode}. Check server logs for gas/balance issues.`);
    }
    
    return success;
  },
});
