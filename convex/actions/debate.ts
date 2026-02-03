"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const runAgentDebate = action({
  args: { claimId: v.id("claims"), analysis: v.any() }, 
  handler: async (ctx, args) => {
    const { claimId, analysis } = args;

    // Helper to log message
    const logMessage = async (role: string, name: string, content: string, round: number) => {
        await ctx.runMutation(internal.debateInternal.insertMessage, {
            claimId,
            agentRole: role,
            agentName: name,
            content,
            round,
            isOnChain: false,
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
