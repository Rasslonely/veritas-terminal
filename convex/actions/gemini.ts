"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EvidenceAnalysisSchema } from "../../src/lib/schemas/ai";
import { api } from "../_generated/api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

    // 4. Prompt Engineering
    const prompt = `
      You are VERITAS, an elite AI insurance adjuster.
      Analyze this image for physical damage.
      
      Output strictly in JSON format matching this schema:
      {
        "objectDetected": "string",
        "damageLevel": "NONE" | "MINOR" | "MODERATE" | "SEVERE" | "TOTAL_LOSS",
        "confidenceScore": number (0-100),
        "description": "string"
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
    
    // 6. Validate with Zod
    try {
        const json = JSON.parse(text);
        const validated = EvidenceAnalysisSchema.parse(json);
        return validated;
    } catch (e) {
        console.error("AI Error:", text);
        throw new Error("Failed to parse AI response");
    }
  },
});
