import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPolicyRecord = internalMutation({
  args: {
    assetType: v.string(),
    assetDescription: v.string(),
    coverageAmount: v.number(),
    premiumPaid: v.number(),
    durationHours: v.number(),
    tokenId: v.string(),
    userAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.userAddress))
      .first();

    if (!user) throw new Error("User not found");

    const now = Date.now();
    await ctx.db.insert("microPolicies", {
      userId: user._id,
      assetType: args.assetType,
      assetDescription: args.assetDescription,
      coverageAmount: args.coverageAmount,
      premiumPaid: args.premiumPaid,
      currency: "USDC",
      startTime: now,
      endTime: now + (args.durationHours * 3600000),
      durationHours: args.durationHours,
      status: "ACTIVE",
      createdAt: now,
      tokenId: args.tokenId,
      mintTxHash: args.tokenId, // Using TokenID as "Hash" for Hedera if logId
    });
  },
});

export const updatePolicyStatus = internalMutation({
    args: {
        policyId: v.id("microPolicies"),
        status: v.string(),
        burnTxHash: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.policyId, {
            status: args.status,
            burnTxHash: args.burnTxHash,
            burnedAt: args.status === "BURNED" ? Date.now() : undefined
        });
    }
});

export const saveBlueprint = internalMutation({
  args: {
    name: v.string(),
    description: v.string(),
    visualBlocks: v.string(),
    generatedPrompt: v.string(),
    config: v.any(),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("policyBlueprints", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
