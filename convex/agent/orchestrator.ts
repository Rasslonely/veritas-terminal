"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

/**
 * Robust JSON extraction for newer, more conversational models.
 */
function robustJSONParse(text: string) {
    try {
        // First try standard parse
        const cleaned = text.replace(/```json\n?|```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        // Fallback: extract the first { ... } block
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        throw e;
    }
}

/**
 * The "Brain" of the Evidence Graph.
 * Determines if we need to branch out the investigation based on initial findings.
 */
export const coordinateInvestigation = action({
  args: { 
    claimId: v.id("claims"), 
    initialAnalysis: v.any() 
  },
  handler: async (ctx, args): Promise<void> => {
    const { claimId, initialAnalysis } = args;

    // 1. Gemini identifies branching topics
    const orchestratorPrompt = `
      You are the VERITAS Master Orchestrator (ERC-8004 Compliance).
      We are investigating an insurance claim for: ${initialAnalysis.objectDetected}.
      Initial Analysis: ${initialAnalysis.description}
      Policy Context: ${initialAnalysis.citedPolicy || "N/A"}
      
      Determine if we need specialized investigation branches.
      Potential Branches:
      - "PHYSICAL": Deep dive into impact patterns, mechanical stress, and repairability.
      - "METADATA": Detailed audit of EXIF data, GPS consistency, and image tampering detection.
      - "LEGAL": Mapping the evidence against specific policy exclusions or coverage thresholds.
      
      Strategy: Synthesize the RAG Policy Context against the evidence provided.
      
      Output strictly in JSON format:
      {
        "requiredBranches": ["BRANCH_TYPE"],
        "strategy": "string (Detailed RAG-aware strategy)"
      }
    `;

    const result = await model.generateContent(orchestratorPrompt);
    const text = result.response.text();
    const response = robustJSONParse(text);
    
    // 2. Spawn the root node for the debate
    const rootId = (await ctx.runMutation(internal.debateInternal.insertMessage, {
        claimId,
        agentRole: "SYSTEM",
        agentName: "VERITAS Orchestrator",
        content: `Fractal Investigation Initiated (Gemini 3). Strategy: ${response.strategy}`,
        round: 0,
        isOnChain: false,
    }) as unknown) as Id<"debateMessages">;

    // 3. For each branch, spawn specialized debate rounds
    for (const branch of response.requiredBranches) {
        // Spawn Branch Trigger Message (Parent Node for the branch)
        const branchMsgId = await ctx.runMutation(internal.debateInternal.insertMessage, {
            claimId,
            parentId: rootId,
            agentRole: "SYSTEM",
            agentName: `${branch} Unit`,
            content: `Investigating ${branch} evidence branch...`,
            round: 1,
            branchType: branch,
            isOnChain: false,
        });

        // Run the specialized debate for this branch
        // @ts-ignore
        await ctx.runAction(internal.agent.orchestrator.runBranchDebate, {
            claimId,
            parentId: branchMsgId,
            branchType: branch,
            analysis: initialAnalysis
        });
    }

    // 4. Final Aggregation
    // @ts-ignore
    await ctx.runAction(internal.agent.orchestrator.consolidateInvestigation, {
        claimId,
        rootId,
        analysis: initialAnalysis
    });
  }
});

/**
 * Runs a specialized 2-round debate focused on a specific evidence branch.
 */
export const runBranchDebate = action({
    args: {
        claimId: v.id("claims"),
        parentId: v.id("debateMessages"),
        branchType: v.string(),
        analysis: v.any()
    },
    handler: async (ctx, args): Promise<void> => {
        const { claimId, parentId, branchType, analysis } = args;
        
        const prompts: Record<string, { lawyer: string; auditor: string }> = {
            PHYSICAL: {
                lawyer: `You are a Forensic Engineer. Defend the authenticity of the physical damage described: ${analysis.description}. Why is this a covered event?`,
                auditor: `You are an Insurance Investigator. Find physical inconsistencies or signs of pre-existing wear in: ${analysis.description}.`
            },
            METADATA: {
                lawyer: `You are a Cyber Forensic Specialist. Argue why the temporal and spatial markers of this claim are valid.`,
                auditor: `You are a Fraud Analyst. Scrutinize the metadata for signs of AI generation, GPS spoofing, or EXIF manipulation.`
            },
            LEGAL: {
                lawyer: `You are a Consumer Rights Lawyer. Argue why this specific damage level (${analysis.damageLevel}) yields maximum payout eligibility.`,
                auditor: `You are a Claims Adjuster. Find policy exclusions that might limit the payout for this specific damage based on: ${analysis.citedPolicy || "Standard Rules"}.`
            }
        };

        const config = prompts[branchType] || prompts.PHYSICAL;

        // Round 1: Specialized Lawyer
        const lawyerRes = await model.generateContent(config.lawyer);
        await ctx.runMutation(internal.debateInternal.insertMessage, {
            claimId,
            parentId,
            agentRole: "LAWYER",
            agentName: `${branchType} Specialist A`,
            content: lawyerRes.response.text(),
            round: 2,
            branchType,
            isOnChain: false
        });

        // Round 2: Specialized Auditor
        const auditorRes = await model.generateContent(config.auditor);
        await ctx.runMutation(internal.debateInternal.insertMessage, {
            claimId,
            parentId,
            agentRole: "AUDITOR",
            agentName: `${branchType} Specialist B`,
            content: auditorRes.response.text(),
            round: 3,
            branchType,
            isOnChain: false
        });
    }
});

/**
 * Final Consensus: Gemini 3 reads the entire Graph and issues the verdict.
 */
export const consolidateInvestigation = action({
    args: {
        claimId: v.id("claims"),
        rootId: v.id("debateMessages"),
        analysis: v.any()
    },
    handler: async (ctx, args): Promise<void> => {
        const verdictPrompt = `
            You are the VERITAS SUPREME JUDGE (Gemini 2.5).
            Review the initial evidence: ${JSON.stringify(args.analysis)}
            Policy: ${args.analysis.citedPolicy || "N/A"}
            
            Synthesize all conflicting arguments and issue a final verdict.
            Output JSON:
            {
              "decision": "APPROVED" | "REJECTED",
              "payout": number,
              "reasoning": "string"
            }
        `;

        const result = await model.generateContent(verdictPrompt);
        const verdict = robustJSONParse(result.response.text());
        
        await ctx.runMutation(internal.debateInternal.insertMessage, {
            claimId: args.claimId,
            parentId: args.rootId,
            agentRole: "VERDICT",
            agentName: "VERITAS Supreme Judge",
            content: `${verdict.decision}: ${verdict.reasoning}. Payout: $${verdict.payout}`,
            round: 10,
            isOnChain: true
        });

        // Update Claim Status
        await ctx.runMutation(internal.debateInternal.updateClaimStatus, {
            claimId: args.claimId,
            status: verdict.decision
        });
    }
});

