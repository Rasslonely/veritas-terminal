import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertMessage = internalMutation({
  args: {
    claimId: v.id("claims"),
    agentRole: v.string(),
    agentName: v.string(),
    content: v.string(),
    round: v.number(),
    isOnChain: v.boolean(),
    txHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("debateMessages", {
        createdAt: Date.now(),
        ...args
    });
  },
});

export const updateClaimStatus = internalMutation({
    args: {
        claimId: v.id("claims"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.claimId, { status: args.status });
    }
});
