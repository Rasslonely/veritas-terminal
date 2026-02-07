import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Create Demo Users (The "Cast")
    const users = [
        { name: "Alice Voyager", wallet: "0x71C...9A21", avatar: "https://i.pravatar.cc/150?u=alice" },
        { name: "Bob Builder", wallet: "0x3D2...1B4C", avatar: "https://i.pravatar.cc/150?u=bob" },
        { name: "Charlie Crypto", wallet: "0x9F1...8E2D", avatar: "https://i.pravatar.cc/150?u=charlie" },
        { name: "Diana Drone", wallet: "0xA4E...5F11", avatar: "https://i.pravatar.cc/150?u=diana" },
        { name: "Ethan Explorer", wallet: "0xB2C...9D33", avatar: "https://i.pravatar.cc/150?u=ethan" },
        { name: "Fiona Fotograf", wallet: "0xC3D...1E44", avatar: "https://i.pravatar.cc/150?u=fiona" },
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
        // APPROVED CLAIMS
        {
            user: userIds[0],
            img: "https://images.unsplash.com/photo-1592756616239-03b1297d0d01?w=800&q=80",
            item: "IPhone 15 Pro Max",
            damage: "MODERATE",
            desc: "Screen shattered after drop from 1.5m on concrete. Display flickering but touch responsive.",
            status: "APPROVED",
            payout: 250,
            reason: "Accidental drop covered under Clause 4.1.",
        },
        {
            user: userIds[3],
            img: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80", 
            item: "DJI Mavic 3",
            damage: "TOTAL_LOSS",
            desc: "Drone lost signal and collided with a tree. Gimbal detached, arm snapped.",
            status: "SETTLED",
            payout: 850,
            reason: "Flight log confirms signal loss. Not pilot error.",
        },
        {
            user: userIds[5],
            img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
            item: "Sony A7S III",
            damage: "SEVERE",
            desc: "Tripod fell over in high wind. Lens mount bent, sensor exposed to dust.",
            status: "APPROVED",
            payout: 1200,
            reason: "Act of God (Wind) covered. Metadata confirms location.",
        },

        // REJECTED CLAIMS (FRAUD/EXCLUSION)
        {
            user: userIds[2],
            img: "https://images.unsplash.com/photo-1588612140889-f5a8ce6c8366?w=800&q=80",
            item: "MacBook Air M2",
            damage: "SEVERE",
            desc: "Liquid damage (Coffee spill). Keyboard non-functional. Won't turn on.",
            status: "REJECTED",
            payout: 0,
            reason: "Policy explicitly excludes liquid damage for this tier.",
        },
        {
            user: userIds[1],
            img: "https://images.unsplash.com/photo-1629813295982-cb1dcb1433f4?w=800&q=80", // Using drone pic for variety
            item: "GoPro Hero 11",
            damage: "MINOR",
            desc: "Scratches on lens after mountain biking.",
            status: "REJECTED",
            payout: 0,
            reason: "Cosmetic damage only. Device still fully functional.",
        },

        // DEBATE IN PROGRESS
        {
            user: userIds[4],
            img: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80",
            item: "Apple Watch Ultra",
            damage: "MINOR",
            desc: "Cracked ceramic back after hitting a door frame.",
            status: "DEBATE_IN_PROGRESS",
            payout: 0,
            reason: undefined,
        },
    ];

    let count = 0;
    for (const c of claims) {
        // Skew timestamps to look like a timeline
        const timeOffset = count * 3600000 * 2; // Every few hours
        const createdAt = Date.now() - timeOffset;
        
        const claimId = await ctx.db.insert("claims", {
            userId: c.user,
            evidenceImageUrl: c.img,
            evidenceMetadata: {
                timestamp: createdAt,
                deviceInfo: "Veritas Mobile PWA",
            },
            initialAnalysis: {
                objectDetected: c.item,
                damageLevel: c.damage,
                confidenceScore: 85 + Math.random() * 14,
                description: c.desc,
            },
            status: c.status,
            estimatedValue: c.payout ? c.payout + 50 : 1000,
            payoutAmount: c.payout,
            payoutCurrency: "USDC",
            createdAt: createdAt,
            resolvedAt: c.status === "SETTLED" ? createdAt + 60000 : undefined,
        });

        // Add debate messages
        // Round 1: Lawyer
        await ctx.db.insert("debateMessages", {
            claimId,
            agentRole: "LAWYER",
            agentName: "Agent A: The Defender",
            content: `The user has provided clear visual evidence of ${c.damage} damage. The incident aligns with the 'Accidental Damage' clause. Payout is required for repairs.`,
            confidenceScore: 88,
            createdAt: createdAt + 1000,
            round: 1,
            isOnChain: true,
        });

        // Round 1: Auditor
        await ctx.db.insert("debateMessages", {
            claimId,
            agentRole: "AUDITOR",
            agentName: "Agent B: The Auditor",
            content: c.status === "REJECTED" 
                ? "I detect inconsistencies. The damage pattern suggests intentional force or excluded liquid contact. I recommend flagging for fraud." 
                : "The damage appears consistent, but we must verify the device serial number matches the policy.",
            confidenceScore: c.status === "REJECTED" ? 92 : 65,
            createdAt: createdAt + 2000,
            round: 1,
            isOnChain: true,
        });

        // Verdict (if not in progress)
        if (c.status !== "DEBATE_IN_PROGRESS" && c.status !== "PENDING_ANALYSIS") {
             await ctx.db.insert("debateMessages", {
                claimId,
                agentRole: "VERDICT",
                agentName: "VERITAS Judge",
                content: c.reason || "Verdict reached based on policy analysis.",
                confidenceScore: 95,
                createdAt: createdAt + 5000,
                round: 2,
                isOnChain: true,
            });
        }
        count++;
    }

    return `Seeding Complete: ${claims.length} Golden Samples Injected 🚀`;
  },
});
