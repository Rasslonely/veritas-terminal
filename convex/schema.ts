import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // USERS
  // ============================================
  users: defineTable({
    walletAddress: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_wallet", ["walletAddress"]),

  // ============================================
  // CLAIMS
  // ============================================
  claims: defineTable({
    userId: v.id("users"),
    
    // Evidence Data
    evidenceImageUrl: v.string(),        // Stored image URL
    evidenceMetadata: v.object({
      timestamp: v.number(),
      location: v.optional(v.object({
        lat: v.number(),
        lng: v.number(),
      })),
      deviceInfo: v.optional(v.string()),
    }),
    
    // AI Analysis
    initialAnalysis: v.object({
      objectDetected: v.string(),
      damageLevel: v.string(), // "NONE", "MINOR", "MODERATE", "SEVERE", "TOTAL_LOSS"
      confidenceScore: v.number(),
      description: v.string(),
    }),
    
    // Claim Status
    status: v.string(), // PENDING_ANALYSIS, DEBATE_IN_PROGRESS, APPROVED, REJECTED, SETTLED
    
    // Financial
    estimatedValue: v.optional(v.number()),
    payoutAmount: v.optional(v.number()),
    payoutCurrency: v.optional(v.string()), // "USDC", "HBAR"
    
    // Blockchain Settlement
    settlementChain: v.optional(v.string()), // "HEDERA" | "BASE"
    settlementTxHash: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // ============================================
  // DEBATE MESSAGES (The AI Jury)
  // ============================================
  debateMessages: defineTable({
    claimId: v.id("claims"),
    
    // Agent Info
    agentRole: v.string(),      // "LAWYER", "AUDITOR", "VERDICT"
    agentName: v.string(),      // "Agent A: The Defender"
    
    // Message Content
    content: v.string(),
    reasoning: v.optional(v.string()),
    
    // Confidence & Evidence
    confidenceScore: v.optional(v.number()),
    evidencePoints: v.optional(v.array(v.string())),
    
    // Blockchain Logging
    txHash: v.optional(v.string()),
    isOnChain: v.boolean(),
    
    // Timestamp
    createdAt: v.number(),
    round: v.number(),          // Debate round (1, 2, 3...)
  })
    .index("by_claim", ["claimId"])
    .index("by_claim_round", ["claimId", "round"]),

  // ============================================
  // MICRO-INSURANCE POLICIES (Flash Insurance)
  // ============================================
  microPolicies: defineTable({
    userId: v.id("users"),
    assetType: v.string(),
    assetDescription: v.string(),
    coverageAmount: v.number(),
    premiumPaid: v.number(),
    currency: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    durationHours: v.number(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),
    
  // ============================================
  // BLOCKCHAIN LOGS
  // ============================================
  blockchainLogs: defineTable({
    entityType: v.string(),
    entityId: v.string(),
    chain: v.string(),
    txHash: v.string(),
    action: v.string(),
    dataHash: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_entity", ["entityType", "entityId"]),
});
