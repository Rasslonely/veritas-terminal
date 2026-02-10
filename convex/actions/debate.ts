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
    const { claimId, analysis, chainMode = "HEDERA" } = args;

    // Helper to log message
    const logMessage = async (role: string, name: string, content: string, round: number) => {
        let txHash: string | undefined;
        let isOnChain = false;

        try {
            // Lazy load adapter (defaults to Hedera for Phase 3)
            // In a real app we might pass "BASE" based on user preference
            const { getAdapter } = await import("../blockchain/adapter");
            const adapter = await getAdapter(chainMode as "HEDERA" | "BASE" || "HEDERA");
            
            // Log to HCS
            txHash = await adapter.logEvidence(JSON.stringify({
                claimId,
                role,
                content,
                round,
                timestamp: Date.now()
            }));
            
            if (txHash) isOnChain = true;
        } catch (err) {
            console.warn("⚠️ Blockchain logging failed (Demo Mode - Continuing off-chain):", err);
        }

        await ctx.runMutation(internal.debateInternal.insertMessage, {
            claimId,
            agentRole: role,
            agentName: name,
            content,
            round,
            isOnChain,
            txHash,
        });
    };

    // --- ROUND 1: THE PLAINTIFF (LAWYER) ---
    // Argues for the highest payout based on the damage
    const lawyerPrompt = `
      You are an aggressive consumer rights lawyer. 
      Review this damage analysis: ${JSON.stringify(analysis)}.
      
      Argue why this claims requires MAXIMUM payout. 
      Focus on hidden structural damage, loss of use, and emotional distress.
      Be concise (max 2 sentences).
    `;
    const lawyerRes = await model.generateContent(lawyerPrompt);
    const lawyerText = lawyerRes.response.text();
    await logMessage("LAWYER", "Agent A (Advocate)", lawyerText, 1);

    // --- ROUND 2: THE DEFENDANT (AUDITOR) ---
    // Argues for minimizing the claim
    const auditorPrompt = `
      You are a strict insurance auditor for Veritas Protocol.
      Review the damage: ${JSON.stringify(analysis)}.
      Review the Lawyer's argument: "${lawyerText}".
      
      Counter-argue. Point out wear-and-tear exclusions, lack of maintenance proof, or exaggeration.
      Recommend a lower payout or rejection.
      Be concise (max 2 sentences).
    `;
    const auditorRes = await model.generateContent(auditorPrompt);
    const auditorText = auditorRes.response.text();
    await logMessage("AUDITOR", "Agent B (Auditor)", auditorText, 2);

    // --- INTERROGATION PROTOCOL CHECK ---
    // If Auditor suspects fraud, we halt for Voice Verification (Voight-Kampff)
    const suspicionCheck = await model.generateContent(`
        Analyze this Auditor statement: "${auditorText}"
        Does the auditor suspect fraud, inconsistency, or lack of proof?
        Output strictly "YES" or "NO".
    `);
    const isSuspicious = suspicionCheck.response.text().includes("YES");

    if (isSuspicious) {
        // TRIGGER INTERROGATION
        await ctx.runMutation(internal.debateInternal.updateClaimStatus, {
            claimId,
            status: "INTERROGATION_PENDING"
        });
        
        await logMessage("SYSTEM", "VERITAS CORE", "⚠️ DISCREPANCY DETECTED. INTERROGATION PROTOCOL INITIATED. AWAITING USER TESTIMONY.", 2.5);
        return; // Halt debate here
    }

    // --- ROUND 3: THE VERDICT (JUDGE) ---
    // Decides the outcome
    const judgePrompt = `
      You are VERITAS, the impartial AI Judge.
      Damage: ${JSON.stringify(analysis)}.
      Argument A: ${lawyerText}
      Argument B: ${auditorText}
      
      Issue a final verdict.
      1. Decision: APPROVED or REJECTED
      2. Payout Percentage: 0% to 100% of value
      3. Reasoning: 1 concise sentence.
      
      Output strictly in this format: "DECISION: [Status] | PAYOUT: [XX]% | REASONING: [Text]"
    `;
    const judgeRes = await model.generateContent(judgePrompt);
    const judgeText = judgeRes.response.text();
    await logMessage("VERDICT", "VERITAS (Judge)", judgeText, 3);
    
    // Update Claim Status based on verdict
    const isApproved = judgeText.includes("APPROVED");
    await ctx.runMutation(internal.debateInternal.updateClaimStatus, {
        claimId,
        status: isApproved ? "APPROVED" : "REJECTED"
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
