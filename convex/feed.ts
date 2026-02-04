import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPublicFeed = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch recent resolved claims
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_status", (q) => q.eq("status", "APPROVED"))
      .order("desc")
      .take(20);

    const rejected = await ctx.db
        .query("claims")
        .withIndex("by_status", (q) => q.eq("status", "REJECTED"))
        .order("desc")
        .take(10);
    
    // Combine and sort (memory sort for now, fine for demo)
    const all = [...claims, ...rejected].sort((a, b) => b.createdAt - a.createdAt);

    // 2. Enhance with user info (basic join)
    const feedItems = await Promise.all(all.map(async (claim) => {
        const user = await ctx.db.get(claim.userId);
        
        // Fetch the VERDICT message for this claim
        const verdictMsg = await ctx.db
            .query("debateMessages")
            .withIndex("by_claim", (q) => q.eq("claimId", claim._id))
            .filter((q) => q.eq(q.field("agentRole"), "VERDICT"))
            .first();

        return {
            ...claim,
            userName: user?.displayName || "Anonymous",
            userAvatar: user?.avatarUrl,
            verdictStatement: verdictMsg?.content || "Verdict Pending",
            verdictTx: verdictMsg?.txHash
        };
    }));

    return feedItems;
  },
});
