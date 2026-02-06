"use node";

import { ActionCtx, action } from "../_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EvidenceAnalysisSchema, LivenessSchema } from "../../src/lib/schemas/ai";
import { api } from "../_generated/api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const LIVENESS_CHALLENGES = [
  "Place your index finger pointing at the damage",
  "Hold a coin next to the damaged area",
  "Place a pen pointing at the damage",
  "Show a thumbs up next to the object",
  "Hold a piece of paper with today's date", // Harder to forge
];

export const analyzeEvidence = action({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    // 1. Get the file URL from Convex
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) throw new Error("File not found");

    // 2. Fetch the image
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // 3. Initialize Gemini Model
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

    // 3.5. RAG RETRIEVAL (The "Brain")
    let policyContext = "";
    try {
        // We query for broad damage categories to get relevant exclusions
        policyContext = await ctx.runAction(api.actions.rag.retrieveContext, { 
            query: "screen crack water damage cosmetic scratches intentional damage" 
        });
    } catch (e) {
        console.warn("RAG Retrieval Skipped:", e);
    }

    // 4. Prompt Engineering (RAG Enhanced)
    const prompt = `
      You are VERITAS, an elite AI insurance adjuster.
      
      === INSURANCE POLICY RULES (STRICT) ===
      ${policyContext || "No specific policy linked. Use standard device insurance principles."}
      =======================================

      Analyze this image for physical damage.
      Rules:
      1. If damage matches an EXCLUSION in the policy, mention it.
      2. If damage is COSMETIC but policy covers standard wear, note it.
      
      Output strictly in JSON format matching this schema:
      {
        "objectDetected": "string",
        "damageLevel": "NONE" | "MINOR" | "MODERATE" | "SEVERE" | "TOTAL_LOSS",
        "confidenceScore": number (0-100),
        "description": "string",
        "citedPolicy": "string (Quote the specific Policy Clause if relevant, e.g. 'Clause 4.2 excludes water damage')"
      }
    `;

    // 5. Generate Content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: response.headers.get("content-type") || "image/jpeg",
        },
      },
    ]);

    const text = result.response.text();
    
    // 6. Clean and Validate
    try {
        const cleanedText = text.replace(/```json\n?|```/g, "").trim(); // Strip Markdown
        const json = JSON.parse(cleanedText);
        const validated = EvidenceAnalysisSchema.parse(json);
        return validated;
    } catch (e) {
        console.error("AI Error:", text);
        throw new Error("Failed to parse AI response");
    }
  },
});

export const requestLivenessChallenge = action({
  args: { claimId: v.id("claims") },
  handler: async (ctx, args) => {
    const challenge = LIVENESS_CHALLENGES[Math.floor(Math.random() * LIVENESS_CHALLENGES.length)];
    
    await ctx.runMutation(api.claims.updateLiveness, {
        claimId: args.claimId,
        status: "CHALLENGED",
        challenge
    });
    
    return challenge;
  },
});

export const verifyLiveness = action({
  args: { 
      claimId: v.id("claims"), 
      storageId: v.string(), 
      challenge: v.string() 
  },
  handler: async (ctx, args) => {
      // 1. Get Image
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) throw new Error("File not found");
      const res = await fetch(fileUrl);
      const buffer = Buffer.from(await res.arrayBuffer()).toString("base64");

      // 2. Gemini Analysis
      const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          generationConfig: { responseMimeType: "application/json" } 
      });

      const prompt = `
        VERITAS LIVENESS CHECK.
        Challenge Issued: "${args.challenge}"
        
        Analyze this image.
        1. Does the user COMPLY with the challenge?
        2. Is this a REAL photo (depth, lighting) or a screen capture?
        
        Output JSON:
        {
          "complied": boolean,
          "isLive": boolean,
          "confidence": number,
          "reasoning": string
        }
      `;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: buffer, mimeType: "image/jpeg" } }
      ]);

      const text = result.response.text();
      const json = JSON.parse(text.replace(/```json\n?|```/g, "").trim());
      const analysis = LivenessSchema.parse(json);

      // 3. Update Status
      const isVerified = analysis.complied && analysis.isLive && analysis.confidence > 70;
      
      await ctx.runMutation(api.claims.updateLiveness, {
          claimId: args.claimId,
          status: isVerified ? "VERIFIED" : "FAILED",
      });

      return { success: isVerified, analysis };
  }
});
