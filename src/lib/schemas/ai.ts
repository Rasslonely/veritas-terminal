import { z } from "zod";

export const EvidenceAnalysisSchema = z.object({
  objectDetected: z.string().describe("The name of the main object detected in the image"),
  damageLevel: z.enum(["NONE", "MINOR", "MODERATE", "SEVERE", "TOTAL_LOSS"]).describe("The severity of damage observed"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence score between 0 and 100"),
  description: z.string().describe("A concise but detailed description of the visible damage"),
  citedPolicy: z.string().optional().describe("Relevant policy clause IF referencing specific rules"),
  hcsLogId: z.string().optional().describe("Hedera Consensus Service Sequence Number"),
});

export type EvidenceAnalysis = z.infer<typeof EvidenceAnalysisSchema>;

export const LivenessSchema = z.object({
  complied: z.boolean().describe("Whether the user followed the specific physical instruction"),
  isLive: z.boolean().describe("Whether the image appears to be a real photo and not a screen capture"),
  confidence: z.number().min(0).max(100),
  reasoning: z.string().describe("Why the AI believes the user complied or failed"),
});

export type LivenessResult = z.infer<typeof LivenessSchema>;
