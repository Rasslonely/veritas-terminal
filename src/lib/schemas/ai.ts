import { z } from "zod";

export const EvidenceAnalysisSchema = z.object({
  objectDetected: z.string().describe("The name of the main object detected in the image"),
  damageLevel: z.enum(["NONE", "MINOR", "MODERATE", "SEVERE", "TOTAL_LOSS"]).describe("The severity of damage observed"),
  confidenceScore: z.number().min(0).max(100).describe("Confidence score between 0 and 100"),
  description: z.string().describe("A concise but detailed description of the visible damage"),
});

export type EvidenceAnalysis = z.infer<typeof EvidenceAnalysisSchema>;
