"use node";

import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ============================================
// ACTIONS (Gemini Interactions)
// ============================================

/**
 * Ingests a raw policy text, chunks it, embeds it, and stores it.
 */
export const ingestPolicy = action({
  args: { 
    title: v.string(),
    text: v.string() 
  },
  handler: async (ctx, args) => {
    console.log(`Ingesting Policy: ${args.title}...`);

    // 1. Create Policy Entry
    const policyId = await ctx.runMutation(internal.rag.createPolicy, {
        title: args.title,
        version: "1.0"
    });

    // 2. Chunk Text (Simple Split by Paragraph)
    const chunks = args.text.split("\n\n").filter(c => c.length > 20);
    console.log(`Generated ${chunks.length} chunks.`);

    // 3. Embed & Store Chunks
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    for (const [i, chunk] of chunks.entries()) {
        const result = await model.embedContent(chunk);
        const embedding = result.embedding.values;

        await ctx.runMutation(internal.rag.storeChunk, {
            policyId,
            content: chunk,
            embedding,
            chunkIndex: i
        });
    }

    console.log("RAG Ingestion Complete.");
    return { success: true, chunks: chunks.length };
  },
});

/**
 * Retrieves relevant policy clauses for a given query (e.g., "Screen Crack").
 */
export const retrieveContext = action({
    args: { query: v.string() },
    handler: async (ctx, args): Promise<string> => {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        
        // 1. Embed Query
        const result = await model.embedContent(args.query);
        const embedding = result.embedding.values;

        // 2. Vector Search
        const results = await ctx.vectorSearch("policyChunks", "by_embedding", {
            vector: embedding,
            limit: 3
        });

        // 3. Fetch Text
        const context = await Promise.all(results.map(async (r) => {
            const chunk = await ctx.runQuery(internal.rag.getChunk, { id: r._id });
            return chunk?.content;
        }));

        return context.filter((c): c is string => c !== undefined).join("\n---\n");
    }
});
