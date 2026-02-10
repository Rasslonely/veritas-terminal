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
      citedPolicy: v.optional(v.string()), // <--- ADDED
      hcsLogId: v.optional(v.string()),    // <--- HCS Sequence Number (Proof)
    }),
    
    // Policy Link (The NFT)
    policyId: v.optional(v.id("microPolicies")), // <--- LINK TO ASSET
    
    // Claim Status
    status: v.string(), // PENDING_ANALYSIS, DEBATE_IN_PROGRESS, APPROVED, REJECTED, SETTLED
    
    // Financial
    estimatedValue: v.optional(v.number()),
    payoutAmount: v.optional(v.number()),
    payoutCurrency: v.optional(v.string()), // "USDC", "HBAR"
    
    // Blockchain Settlement
    settlementChain: v.optional(v.string()), // "HEDERA" | "BASE"
    settlementTxHash: v.optional(v.string()),

    // ============================================
    // THE TRUTH BOND (Staking)
    // ============================================
    stakeAmount: v.optional(v.number()), // e.g. 5 (USDC)
    stakeCurrency: v.optional(v.string()), // "USDC"
    stakeTxHash: v.optional(v.string()),
    stakeStatus: v.optional(v.string()), // "LOCKED", "SLASHED", "RETURNED"
    
    // ============================================
    // NEW: LIVENESS (God-Tier Feature)
    // ============================================
    livenessStatus: v.optional(v.string()), // "PENDING", "CHALLENGED", "VERIFIED", "FAILED"
    livenessChallenge: v.optional(v.string()), // "Place finger on crack"
    livenessImageId: v.optional(v.string()),   // Storage ID of verification image

    // ============================================
    // VOIGHT-KAMPFF PROTOCOL (Voice Truth)
    // ============================================
    voiceEvidence: v.optional(v.object({
      audioUrl: v.string(),       // URL to stored audio
      storageId: v.string(),      // Storage ID
      transcript: v.optional(v.string()), // Transcribed text
    })),
    voiceAnalysis: v.optional(v.object({
      consistencyScore: v.number(), // 0-100
      analysis: v.string(),         // "User hesitated..."
      isReal: v.boolean(),
      hcsLogId: v.optional(v.string()), // <--- HCS Sequence Number (Proof)
    })),
    
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
    tokenId: v.optional(v.string()),
    mintTxHash: v.optional(v.string()),
    
    // Burning
    burnTxHash: v.optional(v.string()),
    burnedAt: v.optional(v.number()),
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

  // ============================================
  // UNDERWRITER POOLS (DeFi Layer)
  // ============================================
  underwriterPools: defineTable({
    name: v.string(),           // "Gadget Protection", "Vehicle Claims"
    totalStaked: v.number(),    // Total USDC in pool
    totalClaims: v.number(),    // Claims paid out
    apy: v.number(),            // Current APY %
    riskLevel: v.string(),      // "LOW", "MEDIUM", "HIGH"
    icon: v.optional(v.string()),
  }),

  underwriterStakes: defineTable({
    userId: v.id("users"),
    poolId: v.id("underwriterPools"),
    amount: v.number(),
    stakedAt: v.number(),
    earnings: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_pool", ["poolId"]),

  // ============================================
  // RAG ENGINE (The Brain)
  // ============================================
  policies: defineTable({
    title: v.string(),          // "Veritas Gadget Protection v1"
    version: v.string(),        // "1.0"
    isActive: v.boolean(),
    createdAt: v.number(),
  }),

  policyChunks: defineTable({
    policyId: v.id("policies"),
    content: v.string(),        // The text clause
    embedding: v.array(v.number()), // Vector embedding (768 dims for Gemini)
    chunkIndex: v.number(),
  })
    .index("by_policy", ["policyId"])
    // Vector Index for Semantic Search
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 3072,
    }),

  // ============================================
  // ERC-8004 AGENT ECONOMY (Discovery Layer)
  // ============================================
  jobs: defineTable({
    claimId: v.id("claims"),
    status: v.string(), // "OPEN", "LOCKED", "VALIDATED", "COMPLETED"
    rewardAmount: v.number(), // Payment for agents
    requiredRoles: v.array(v.string()), // ["LAWYER", "AUDITOR"]
    assignedAgents: v.array(v.id("users")), 
    validationProof: v.optional(v.string()), // ERC-8004 Validation Hash
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_claim", ["claimId"]),
});
