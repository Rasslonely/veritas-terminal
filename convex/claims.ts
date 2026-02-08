import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createClaim = mutation({
  args: {
    evidenceImageUrl: v.string(),
    evidenceStorageId: v.string(),
    analysis: v.object({
        objectDetected: v.string(),
        damageLevel: v.string(),
        confidenceScore: v.number(),
        description: v.string(),
        citedPolicy: v.optional(v.string()), // <--- ADDED
        hcsLogId: v.optional(v.string()),    // <--- HCS Sequence Number
    }),
    stakeTxHash: v.optional(v.string()), // <--- TRUTH BOND
    stakeAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // In a real app we'd get the authenticated user. 
    // For this demo, we might pick the first user or require auth.
    const user = await ctx.db.query("users").first();
    let userId = user?._id;

    if (!userId) {
        // Fallback: create a temp user
        userId = await ctx.db.insert("users", {
            walletAddress: "0x0000000000000000000000000000000000000000",
            createdAt: Date.now(),
            displayName: "Guest User"
        });
    }

    const claimId = await ctx.db.insert("claims", {
        userId,
        evidenceImageUrl: args.evidenceImageUrl,
        evidenceMetadata: {
            timestamp: Date.now(),
            deviceInfo: "Veritas Terminal PWA", // Mock
        },
        initialAnalysis: args.analysis,
        status: "DEBATE_IN_PROGRESS",
        createdAt: Date.now(),
        
        // TRUTH BOND
        stakeTxHash: args.stakeTxHash,
        stakeAmount: args.stakeAmount,
        stakeCurrency: "USDC",
        stakeStatus: args.stakeTxHash ? "LOCKED" : undefined,
    });

    return claimId;
  },
});

export const getClaim = query({
  args: { claimId: v.id("claims") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.claimId);
  },
});

export const getDebateMessages = query({
    args: { claimId: v.id("claims") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("debateMessages")
            .withIndex("by_claim", (q) => q.eq("claimId", args.claimId))
            .order("asc")
            .collect();
    }
});

export const getRecentClaims = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("claims")
      .withIndex("by_created")
      .order("desc")
      .take(10);
  },
});

export const getUserClaims = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) {
        // Return empty or recent if no user
         return await ctx.db
            .query("claims")
            .withIndex("by_created")
            .order("desc")
            .take(20);
    }
    return await ctx.db
      .query("claims")
      .withIndex("by_user", (q) => q.eq("userId", args.userId!))
      .order("desc")
      .take(50);
  },
});

export const updateLiveness = mutation({
  args: {
    claimId: v.id("claims"),
    status: v.string(),
    challenge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.claimId, {
      livenessStatus: args.status,
      livenessChallenge: args.challenge,
    });
  },
});
