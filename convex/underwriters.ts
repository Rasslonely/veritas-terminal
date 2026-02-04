import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getPools = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("underwriterPools").collect();
  },
});

export const getStakes = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("underwriterStakes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const stakeFunds = mutation({
  args: {
    poolId: v.id("underwriterPools"),
    amount: v.number(),
    userId: v.id("users"), // In prod, get from auth
  },
  handler: async (ctx, args) => {
    const pool = await ctx.db.get(args.poolId);
    if (!pool) throw new Error("Pool not found");

    // 1. Record Stake
    await ctx.db.insert("underwriterStakes", {
      userId: args.userId,
      poolId: args.poolId,
      amount: args.amount,
      stakedAt: Date.now(),
      earnings: 0,
    });

    // 2. Update Pool Stats
    await ctx.db.patch(args.poolId, {
      totalStaked: pool.totalStaked + args.amount,
    });
  },
});

export const seedPools = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("underwriterPools").first();
    if (existing) return; // Already seeded

    await ctx.db.insert("underwriterPools", {
      name: "Gadget Protection Vault",
      totalStaked: 154000,
      totalClaims: 12500,
      apy: 12.5,
      riskLevel: "LOW",
      icon: "smartphone",
    });

    await ctx.db.insert("underwriterPools", {
      name: "Vehicle Damage Risk",
      totalStaked: 520000,
      totalClaims: 85000,
      apy: 18.2,
      riskLevel: "MEDIUM",
      icon: "car",
    });

    await ctx.db.insert("underwriterPools", {
      name: "Natural Disaster Re-Insurance",
      totalStaked: 1250000,
      totalClaims: 450000,
      apy: 45.0,
      riskLevel: "HIGH",
      icon: "tornado",
    });
  },
});
