import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Create a new Policy Container
export const createPolicy = internalMutation({
  args: { title: v.string(), version: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("policies", {
        title: args.title,
        version: args.version,
        isActive: true,
        createdAt: Date.now()
    });
  },
});

// Store a single Vector Chunk
export const storeChunk = internalMutation({
  args: { 
    policyId: v.id("policies"),
    content: v.string(),
    embedding: v.array(v.number()),
    chunkIndex: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("policyChunks", {
        policyId: args.policyId,
        content: args.content,
        embedding: args.embedding,
        chunkIndex: args.chunkIndex
    });
  },
});

// Retrieve a Chunk by ID
export const getChunk = internalQuery({
    args: { id: v.id("policyChunks") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
});
