import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mock pricing
const ASSET_TYPES = {
    "SMARTPHONE": { premium: 5, coverage: 1000 },
    "LAPTOP": { premium: 12, coverage: 2500 },
    "CAMERA": { premium: 8, coverage: 1500 },
    "VEHICLE": { premium: 25, coverage: 10000 },
};

export const createPolicy = mutation({
  args: {
    userId: v.optional(v.id("users")),
    assetType: v.string(), // "SMARTPHONE", "LAPTOP", etc.
    durationHours: v.number(),
    assetDescription: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Resolve User (Simulated for demo)
    let userId = args.userId;
    if (!userId) {
        const user = await ctx.db.query("users").first();
        if (user) userId = user._id;
        else {
             // Create guest if needed, but for now throwing error or handling gracefully
             throw new Error("User required");
        }
    }

    // 2. Calculate Terms
    const settings = ASSET_TYPES[args.assetType as keyof typeof ASSET_TYPES] || ASSET_TYPES.SMARTPHONE;
    const premium = settings.premium; // Flat rate for demo, usually * duration
    const coverage = settings.coverage;

    const startTime = Date.now();
    const endTime = startTime + (args.durationHours * 60 * 60 * 1000);

    // 3. Create Policy
    const policyId = await ctx.db.insert("microPolicies", {
        userId: userId!,
        assetType: args.assetType,
        assetDescription: args.assetDescription,
        coverageAmount: coverage,
        premiumPaid: premium,
        currency: "USDC",
        startTime,
        endTime,
        durationHours: args.durationHours,
        status: "ACTIVE",
        createdAt: Date.now(),
        // Mocking blockchain mint
        tokenId: `0.0.${Math.floor(Math.random() * 100000)}`,
        mintTxHash: "0x" + Math.random().toString(16).slice(2),
    });

    return policyId;
  },
});

export const getMyPolicies = query({
    args: { userId: v.optional(v.id("users")) },
    handler: async (ctx, args) => {
        let userId = args.userId;
        if (!userId) {
             const user = await ctx.db.query("users").first();
             if (user) userId = user._id;
             else return []; // No user, no policies
        }

        return await ctx.db
            .query("microPolicies")
            .withIndex("by_user", (q) => q.eq("userId", userId!))
            .order("desc")
            .collect();
    }
});
