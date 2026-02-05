import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Create Demo Users
    const users = [
        { name: "Alice Voyager", wallet: "0x71C...9A21", avatar: "https://i.pravatar.cc/150?u=alice" },
        { name: "Bob Builder", wallet: "0x3D2...1B4C", avatar: "https://i.pravatar.cc/150?u=bob" },
        { name: "Charlie Crypto", wallet: "0x9F1...8E2D", avatar: "https://i.pravatar.cc/150?u=charlie" },
    ];

    const userIds = [];
    for (const u of users) {
        const existing = await ctx.db.query("users").withIndex("by_wallet", q => q.eq("walletAddress", u.wallet)).first();
        if (existing) {
            userIds.push(existing._id);
        } else {
            const id = await ctx.db.insert("users", {
                walletAddress: u.wallet,
                displayName: u.name,
                avatarUrl: u.avatar,
                createdAt: Date.now(),
            });
            userIds.push(id);
        }
    }

    // 2. Create Golden Sample Claims
    const claims = [
        {
            user: userIds[0],
            img: "https://images.unsplash.com/photo-1592756616239-03b1297d0d01?w=800&auto=format&fit=crop&q=60", // Cracked screen
            item: "IPhone 15 Pro Max",
            damage: "MODERATE",
            desc: "Screen shattered after drop from 1.5m. Display flickering but touch responsive.",
            status: "APPROVED",
            payout: 250,
        },
        {
            user: userIds[1],
            img: "https://images.unsplash.com/photo-1535970793482-07de93762dc4?w=800&auto=format&fit=crop&q=60", // Dented Car
            item: "Tesla Model 3",
            damage: "MINOR",
            desc: "Scratch and dent on rear bumper. Parking lot incident. No sensors affected.",
            status: "DEBATE_IN_PROGRESS",
            payout: undefined,
        },
        {
            user: userIds[2],
            img: "https://images.unsplash.com/photo-1588612140889-f5a8ce6c8366?w=800&auto=format&fit=crop&q=60", // Broken Laptop
            item: "MacBook Air M2",
            damage: "SEVERE",
            desc: "Liquid damage (Coffee spill). Keyboard non-functional. Won't turn on.",
            status: "REJECTED",
            payout: undefined,
        },
        {
            user: userIds[0],
            img: "https://images.unsplash.com/photo-1629813295982-cb1dcb1433f4?w=800&auto=format&fit=crop&q=60", // Broken Drone
            item: "DJI Mini 3 Pro",
            damage: "TOTAL_LOSS",
            desc: "Gimbal detached and arm snapped after collision with tree.",
            status: "SETTLED",
            payout: 450,
        }
    ];

    for (const c of claims) {
        // Check if exists roughly
        const exists = await ctx.db.query("claims").withIndex("by_user", q => q.eq("userId", c.user)).first();
        // Just always insert for now, or maybe skip if user has claims? 
        // Let's just insert to fill the feed.
        
        const claimId = await ctx.db.insert("claims", {
            userId: c.user,
            evidenceImageUrl: c.img,
            evidenceMetadata: {
                timestamp: Date.now() - Math.floor(Math.random() * 10000000),
                deviceInfo: "Veritas Mobile PWA",
            },
            initialAnalysis: {
                objectDetected: c.item,
                damageLevel: c.damage,
                confidenceScore: 85 + Math.random() * 14,
                description: c.desc,
            },
            status: c.status,
            estimatedValue: c.payout ? c.payout + 50 : 0,
            payoutAmount: c.payout,
            payoutCurrency: "USDC",
            createdAt: Date.now() - Math.floor(Math.random() * 10000000),
        });

        // Add dummy debate messages
        if (c.status !== "PENDING_ANALYSIS") {
             await ctx.db.insert("debateMessages", {
                claimId,
                agentRole: "LAWYER",
                agentName: "Agent A: The Defender",
                content: `The user has provided clear evidence of ${c.damage} damage to the ${c.item}. The timestamp matches the policy period.`,
                confidenceScore: 88,
                createdAt: Date.now(),
                round: 1,
                isOnChain: true,
             });
             
             await ctx.db.insert("debateMessages", {
                claimId,
                agentRole: "AUDITOR",
                agentName: "Agent B: The Auditor",
                content: c.status === "REJECTED" ? "Metadata suggests the image was edited. Shadows are inconsistent." : "Damage appears consistent with the description. No obvious signs of manipulation.",
                confidenceScore: c.status === "REJECTED" ? 92 : 60,
                createdAt: Date.now(),
                round: 1,
                isOnChain: true,
             });
        }
    }

    return "Seeding Complete: Golden Samples Injected 🚀";
  },
});
