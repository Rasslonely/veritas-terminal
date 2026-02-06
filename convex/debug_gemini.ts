"use node";
import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const listModels = action({
  args: {},
  handler: async (ctx) => {
    // There isn't a direct listModels method on the SDK's top level class in some versions,
    // but looking at the error message, it suggests calling ListModels.
    // We might need to use the REST API manually if the SDK doesn't expose it easily,
    // OR we can try to guess common ones.
    
    // Actually, let's try a direct fetch to the API endpoint using the key.
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    
    console.log("Fetching models from:", url.replace(key!, "HIDDEN"));
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.models) {
            console.log("=== AVAILABLE MODELS ===");
            const embeddingModels = data.models.filter((m: any) => m.supportedGenerationMethods?.includes("embedContent"));
            
            console.log("--- EMBEDDING MODELS ---");
            embeddingModels.forEach((m: any) => console.log(`Name: ${m.name} | Display: ${m.displayName}`));
            
            console.log("--- ALL MODELS ---");
            data.models.forEach((m: any) => console.log(`Name: ${m.name}`));
        } else {
            console.error("No models found in response:", data);
        }
    } catch (e) {
        console.error("Failed to list models:", e);
    }
  }
});
