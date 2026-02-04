import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const storeUser = mutation({
  args: {
    walletAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();

    if (user) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      walletAddress: args.walletAddress,
      createdAt: Date.now(),
      displayName: `User ${args.walletAddress.slice(0, 6)}`,
    });

    return userId;
  },
});

export const getUser = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress))
      .first();
  },
});
