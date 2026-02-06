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
    }),
  },
  handler: async (ctx, args) => {
    // In a real app we'd get the authenticated user. 
    // For this demo, we might pick the first user or require auth.
    // Let's assume the auth middleware is separate, but we'll try to find a user 
    // or create a guest user if needed. 
    // Ideally, we use ctx.auth.getUserIdentity() but we set up a custom auth flow.
    // For PWA demo speed, we'll look up the most recent user or just hardcode if needed
    // But better: we passed `userId` in args? No, let's just use a placeholder if no auth
    // or rely on a "current user" query.
    
    // For now, let's just find the first user in the DB to attach to, 
    // or create a "Guest" claim if no users exist.
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
        evidenceImageUrl: args.evidenceImageUrl, // We might want to resolve storageId to URL or keep ID? 
        // Schema says evidenceImageUrl is string. We can store the storageId or the public URL.
        // Let's store the URL for now, but also keeping storageId in metadata might be good.
        // Actually, let's use the provided URL.
        
        evidenceMetadata: {
            timestamp: Date.now(),
            deviceInfo: "Veritas Terminal PWA", // Mock
        },
        initialAnalysis: args.analysis,
        status: "DEBATE_IN_PROGRESS",
        createdAt: Date.now()
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
