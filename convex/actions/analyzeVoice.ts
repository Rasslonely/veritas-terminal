"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const verifyTestimony = action({
  args: {
    audioBase64: v.string(),       // User's voice explanation
    evidenceImageUrl: v.string(),  // Original evidence image URL
    claimId: v.id("claims"),
  },
  handler: async (ctx, args) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Fetch the image execution context
    // In a real scenario, we might need to fetch the image blob if passing directly,
    // or pass the URL if the model supports it. 
    // For this implementation, we assume we fetch the image to pass as inline data
    // or that the user passes the base64 of the image directly.
    // Optimization: The client should probably pass the storage ID or URL.
    // For now, let's assume we can fetch the image bytes from the URL.
    
    let imagePart;
    try {
        const imageResponse = await fetch(args.evidenceImageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        imagePart = {
            inlineData: {
                data: Buffer.from(imageBuffer).toString("base64"),
                mimeType: "image/jpeg" // Assumed, should be dynamic ideally
            }
        };
    } catch (e) {
        console.error("Failed to fetch evidence image:", e);
        throw new Error("Failed to retrieve evidence image for analysis.");
    }

    const audioPart = {
        inlineData: {
            data: args.audioBase64,
            mimeType: "audio/mp3" // Assumed format from MediaRecorder
        }
    };

    const prompt = `You are a forensic investigator using the Voight-Kampff Protocol.
    
    TASK:
    1. Listen to the user's audio testimony explanation of an incident.
    2. Analyze the provided evidence image of the damage.
    3. Determine if the narrative matches the physical reality (physics, lighting, damage patterns).
    4. Detect acoustic signs of deception (hesitation, stuttering, inconsistent tone).

    OUTPUT JSON ONLY:
    {
      "transcript": "Transcribed text of the audio",
      "consistencyScore": number (0-100),
      "analysis": "Detailed analysis of why it matches or fails. Be sharp and critical.",
      "isReal": boolean (true if score > 70)
    }`;

    const result = await model.generateContent([
        prompt,
        imagePart,
        audioPart
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(cleanJson);

    // 2. LOG TO HEDERA CONSENSUS SERVICE (The Black Box)
    let hcsLogId: string | undefined;
    try {
        const { getAdapter } = await import("../blockchain/adapter");
        const adapter = await getAdapter("HEDERA");
        
        // Log the "Thought Process"
        hcsLogId = await adapter.logEvidence(JSON.stringify({
            app: "VERITAS_VOIGHT_KAMPFF",
            claimId: args.claimId,
            type: "VOICE_ANALYSIS",
            input_hash: "hash_of_audio_blob", // In prod, hash the actual blob
            analysis: analysis,
            verdict: analysis.isReal ? "VERIFIED" : "DECEPTIVE"
        }));
        console.log("✅ HCS Voice Log:", hcsLogId);
    } catch (e) {
        console.warn("⚠️ HCS Logging Skipped (Demo/Config Alert):", e);
    }

    // 3. SAVE TO DB
    // We need to store the analysis, the audio URL (mocked here or passed), and update status
    // Import internal mutation to update claim
    const { internal } = await import("../_generated/api");
    
    // Update Claim with Voice Evidence
    await ctx.runMutation(internal.debateInternal.updateClaimVoiceEvidence, {
        claimId: args.claimId,
        voiceAnalysis: {
            consistencyScore: analysis.consistencyScore,
            analysis: analysis.analysis,
            isReal: analysis.isReal,
            hcsLogId: hcsLogId // <--- PROOF OF VERIFICATION
        },
        // In a real app, we'd upload the audioBlob to storage and get the ID/URL
        // For now, we assume the client might upload receiving a URL, or we just store the transcript.
        voiceEvidence: {
             // We don't have the storage ID here unless we uploaded first. 
             // Let's assume the frontend uploads it and passes the URL/ID? 
             // The args only have audioBase64. 
             // For this demo, we'll skip storing the audio file blob in `voiceEvidence` 
             // if we don't have it, or we rely on the client to upload.
             // Let's just store the transcript.
             audioUrl: "https://example.com/audio-placeholder.mp3", 
             storageId: "mock-storage-id",
             transcript: analysis.transcript
        }
    });

    // 4. LOG TO DEBATE STREAM
    await ctx.runMutation(internal.debateInternal.insertMessage, {
        claimId: args.claimId,
        agentRole: "SYSTEM",
        agentName: "Voight-Kampff Protocol",
        content: `VOICE TESTIMONY RECEIVED.\nTranscript: "${analysis.transcript}"\nAnalysis: ${analysis.analysis}\nConsistency Score: ${analysis.consistencyScore}/100\nHEDERA PROOF: ${hcsLogId || "Pending"}`,
        round: 2.5, // Intermission round
        isOnChain: !!hcsLogId,
        txHash: hcsLogId
    });

    // 4. UPDATE CLAIM STATUS
    // If Real -> Resume Debate (Set to DEBATE_IN_PROGRESS so the UI can trigger the Tribunal again)
    // If Fake -> REJECT immediately? Or let the judge decide in Round 3?
    // Let's set to DEBATE_IN_PROGRESS regardless, but the Judge will see the low score in the logs/context.
    // Actually, if it's a "Living Tribunal", the next run of `runAgentDebate` should pick this up.
    
    await ctx.runMutation(internal.debateInternal.updateClaimStatus, {
        claimId: args.claimId,
        status: analysis.isReal ? "DEBATE_IN_PROGRESS" : "REJECTED_FRAUD_DETECTED" 
        // If rejected here, we stop. If DEBATE_IN_PROGRESS, user can click "Resume".
    });
    
    return analysis;
  },
});
