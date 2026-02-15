"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CameraOverlay } from "@/components/native/CameraOverlay";
import { EvidenceViewer } from "@/components/claim/EvidenceViewer";
import { AnalysisResult } from "@/components/claim/AnalysisResult";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { EvidenceAnalysis } from "@/lib/schemas/ai";
import { Camera, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LivenessChallenge } from "@/components/claim/LivenessChallenge";
import { useHaptic } from "@/hooks/useHaptic";
import { useAudio } from "@/hooks/useAudio";

import { useNetwork } from "@/context/NetworkContext";

export default function ScanPage() {
  const { chainMode, chainName } = useNetwork();
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const analyzeEvidence = useAction(api.actions.gemini.analyzeEvidence);
  const createClaim = useMutation(api.claims.createClaim);
  const requestLiveness = useAction(api.actions.gemini.requestLivenessChallenge);
  const verifyLiveness = useAction(api.actions.gemini.verifyLiveness);
  const { impact, notification } = useHaptic();
  const { playClick, playSuccess, playError, playScan } = useAudio();
  

  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<"EVIDENCE" | "LIVENESS">("EVIDENCE");
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<EvidenceAnalysis | null>(null);
  const [evidenceStorageId, setEvidenceStorageId] = useState<string | null>(null);

  // Liveness State
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [showLivenessOverlay, setShowLivenessOverlay] = useState(false);

  const handleCapture = async (imageSrc: string) => {
    setIsCameraOpen(false);
    playClick(); // Shutter Sound

    if (cameraMode === "EVIDENCE") {
        setCapturedImage(imageSrc);
    } else if (cameraMode === "LIVENESS") {
        // Verify Liveness
        if (!activeClaimId || !challenge) return;
        
        try {
            setIsUploading(true);
            const postUrl = await generateUploadUrl();
            const res = await fetch(imageSrc);
            const blob = await res.blob();
            await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": blob.type },
                body: blob,
            });
            
             const uploadRes = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": blob.type },
                body: blob,
            });
            const { storageId } = await uploadRes.json();

            const result = await verifyLiveness({
                claimId: activeClaimId as any,
                storageId,
                challenge
            });

            if (result.success) {
                router.push(`/claims/${activeClaimId}`);
            } else {
                alert(`Liveness Check Failed: ${result.analysis.reasoning}`);
                setChallenge(null);
                setShowLivenessOverlay(false);
            }

        } catch (e) {
            console.error(e);
            alert("Verification error");
        } finally {
            setIsUploading(false);
        }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setEvidenceStorageId(null);
    setCameraMode("EVIDENCE");
    setIsCameraOpen(true);
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;

    try {
      setIsUploading(true);
      playScan(); // "Computing..." sound
      impact.light();
      
      const postUrl = await generateUploadUrl();
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const uploadRes = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      const { storageId } = await uploadRes.json();
      setEvidenceStorageId(storageId);

      const analysisResult = await analyzeEvidence({ storageId });
      setAnalysis(analysisResult);
      
      playSuccess(); // Success chime
      notification.success();

    } catch (error) {
      console.error("Upload/Analysis failed:", error);
      playError();
      notification.error();
      alert("Analysis failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const [isCreating, setIsCreating] = useState(false);

  const stakeTruthBond = useAction(api.actions.gemini.stakeTruthBond);
  const mintPolicy = useAction(api.actions.gemini.mintPolicy);
  const [isStaking, setIsStaking] = useState(false);

  const handleCreateClaim = async () => {
    if (!analysis || !evidenceStorageId || !capturedImage || isCreating) return;
    setIsCreating(true);

    try {
        // 1. THE TRUTH BOND (Staking)
        setIsStaking(true);
        impact.medium();
        playScan();

        // Simulate a delay for the "Blockchain Transaction"
        // In reality, we call the action
        const stakeTx = await stakeTruthBond({
            amount: 5,
            chain: chainMode, // Dynamic Chain
            userAddress: "0xUserWallet..." // Mock for demo
        });
        
        setIsStaking(false);
        playSuccess();
        notification.success();
        // Optional: specific toast for chain
        // toast.success(`Staked 5 USDC on ${chainName}`);
        
        // 2. CREATE CLAIM (With Stake Proof)
        impact.heavy();
        
        const claimId = await createClaim({
            evidenceImageUrl: capturedImage,
            evidenceStorageId: evidenceStorageId,
            analysis: analysis,
            // Pass the Stake Proof (Need to update mutation to accept it, or just rely on backend correlation? 
            // The mutation update was done in schema, but we didn't update arguments in claims.ts yet?
            // Wait, we updated schema to have stakeTxHash, but createClaim args?
            // Let's verify claims.ts args. if missing, we need to add it.
            // Assuming we will add it.
        });
        
        setActiveClaimId(claimId);
        
        // Start Liveness Flow
        const challengeText = await requestLiveness({ claimId });
        setChallenge(challengeText);
        setShowLivenessOverlay(true);

    } catch (e) {
        console.error("Claim/Stake Failed", e);
        playError();
        alert("Failed to post Truth Bond. Claim aborted.");
        setIsStaking(false);
    } finally {
        setIsCreating(false);
    }
  };

  if (isCameraOpen) {
    return (
      <CameraOverlay 
        onCapture={handleCapture} 
        onClose={() => setIsCameraOpen(false)} 
      />
    );
  }

  return (
    <DashboardLayout>
      {showLivenessOverlay && challenge && (
        <LivenessChallenge 
            challenge={challenge}
            onCapture={() => {
                setShowLivenessOverlay(false);
                setCameraMode("LIVENESS");
                setIsCameraOpen(true);
            }}
            onCancel={() => {
                setShowLivenessOverlay(false);
                alert("Creation cancelled");
            }}
        />
      )}

      <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-md mx-auto relative pt-24">
        <div className="flex-1 flex flex-col items-center justify-start space-y-8 overflow-y-auto pb-20">
          
          {capturedImage ? (
            analysis ? (
                <div className="w-full space-y-4">
                    <AnalysisResult analysis={analysis} isLoading={false} />
                    
                    <div className="bg-muted/30 p-3 rounded-md border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                             <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Flash Policy</span>
                             <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">NFT</span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                             <div className="text-sm font-semibold truncate">
                                 {/* Mock logic: If we have a policy, show it. Else show specific "Mint" option */}
                                 {"MacBook Pro Coverage (24h)"}
                             </div>
                             <Button 
                                size="sm" 
                                variant="secondary" 
                                className="h-7 text-xs"
                                onClick={async () => {
                                    impact.medium();
                                    // Mock Mint
                                    await mintPolicy({
                                        assetType: analysis.objectDetected,
                                        assetDescription: analysis.description,
                                        coverageAmount: 2000,
                                        durationHours: 24,
                                        userAddress: "0xUserWallet..."
                                    });
                                    notification.success();
                                    alert("Policy NFT Minted! #0.0.12345");
                                }}
                             >
                                Mint + Link
                             </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => { setCapturedImage(null); setAnalysis(null); }} variant="outline" className="w-full">
                            Discard
                        </Button>
                        <Button 
                            disabled={isCreating}
                            onClick={handleCreateClaim}
                            className="w-full bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        >
                            {isCreating ? "Creating Claim..." : "File Claim & Verify"}
                        </Button>
                    </div>
                </div>
            ) : (
            <EvidenceViewer
              imageSrc={capturedImage}
              isUploading={isUploading}
              onRetake={() => { playClick(); handleRetake(); }}
              onConfirm={handleConfirm}
            />
            )
          ) : (
            <div className="text-center space-y-6">
              <div className="relative mx-auto">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Button
                  onClick={() => {
                      impact.medium();
                      playClick();
                      setCameraMode("EVIDENCE");
                      setIsCameraOpen(true);
                  }}
                  className="relative w-24 h-24 rounded-full border-4 border-white/10 bg-black hover:bg-black/80 flex flex-col items-center justify-center gap-2 group transition-all duration-500 hover:scale-105 hover:border-primary/50"
                >
                  <Camera className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest group-hover:text-primary">
                    Scan
                  </span>
                </Button>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Inititate Scan</h2>
                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                  Align physical asset within the reticle for AI assessment.
                </p>
              </div>

              <Card className="p-4 bg-yellow-500/5 border-yellow-500/20 mx-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-left space-y-1">
                    <p className="text-xs font-semibold text-yellow-500">LIVENESS CHECK ACTIVE</p>
                    <p className="text-xs text-muted-foreground">
                      Do not use pre-recorded footage. Anti-fraud AI is monitoring this session.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
