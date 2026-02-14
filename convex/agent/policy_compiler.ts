"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * The "Neuroblox" compiler for Veritas.
 * Translates visual block configurations into high-fidelity AI agent instructions.
 */
export const compilePolicyBlueprint = action({
  args: { 
    name: v.string(),
    description: v.string(),
    visualBlocksJson: v.string(), // The output from our React Flow builder
    userId: v.id("users")
  },
  handler: async (ctx, args): Promise<{ blueprintId: Id<"policyBlueprints">; promptPreview: string }> => {
    const { visualBlocksJson, name, description, userId } = args;

    // 1. Gemini translates the blocks into a System Prompt
    const compilerPrompt = `
      You are the VERITAS Policy Compiler.
      Translate the following visual block logic into a comprehensive System Prompt for an Insurance Agent.
      
      Visual Blocks:
      ${visualBlocksJson}
      
      Requirements for the System Prompt:
      1. Define the Agent's Persona based on the "Agent Type" block.
      2. Set Payout Thresholds based on the "Monetary" blocks.
      3. Include specific "Exclusion Zones" based on the "Rule" blocks.
      4. Ensure the prompt is optimized for Gemini 1.5/2.5 models.
      
      Also, provide a Solidity-compatible configuration object.
      
      IMPORTANT: Output strictly valid JSON.
      - No Markdown code blocks (e.g. \`\`\`json).
      - No comments in the JSON.
      - All strings must be properly escaped (no literal newlines).
      
      Output Structure:
      {
        "systemPrompt": "string (multiline text must be escaped with \\n)",
        "agentConfig": {
          "maxPayout": number,
          "riskAppetite": "LOW|MED|HIGH",
          "requiredEvidence": ["string"]
        }
      }
    `;

    const result = await model.generateContent(compilerPrompt);
    let text = result.response.text();
    
    // Robust Sanitization
    // 1. Remove markdown code blocks if present
    text = text.replace(/```json\n?|```/g, "").trim();
    
    // 2. Find the JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        text = jsonMatch[0];
    }

    let compiled;
    try {
        compiled = JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error. Raw Text:", text);
        // Fallback: Return a safe default instead of crashing the demo
        compiled = {
            systemPrompt: "Error parsing AI response. Using fallback safe-mode prompt.\n\nAct as a conservative insurance adjuster.",
            agentConfig: { maxPayout: 0, riskAppetite: "LOW", requiredEvidence: [] }
        };
    }

    // 2. Save the Blueprint to the database
    const blueprintId = await ctx.runMutation(internal.policyInternal.saveBlueprint, {
        name,
        description,
        visualBlocks: visualBlocksJson,
        generatedPrompt: compiled.systemPrompt,
        config: compiled.agentConfig,
        createdBy: userId,
    });

    return { 
        blueprintId, 
        promptPreview: compiled.systemPrompt.substring(0, 100) + "..."
    };
  }
});
