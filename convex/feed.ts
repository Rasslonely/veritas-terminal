import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPublicFeed = query({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch recent claims of all interesting statuses
    const claims = await ctx.db
      .query("claims")
      .withIndex("by_created")
      .order("desc")
      .take(50);

    // Filter out boring ones (PENDING_ANALYSIS)
    const all = claims.filter(c => c.status !== "PENDING_ANALYSIS");

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
