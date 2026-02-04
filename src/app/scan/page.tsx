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

export default function ScanPage() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const analyzeEvidence = useAction(api.actions.gemini.analyzeEvidence);
  const createClaim = useMutation(api.claims.createClaim);
  const requestLiveness = useAction(api.actions.gemini.requestLivenessChallenge);
  const verifyLiveness = useAction(api.actions.gemini.verifyLiveness);
  
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
            // We need to get storageId again, simplified here assuming we get it from result or use a second generate call
            // Actually, let's just do the upload properly
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
                // Maybe reset claim or allow retry?
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
      
    } catch (error) {
      console.error("Upload/Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateClaim = async () => {
    if (!analysis || !evidenceStorageId || !capturedImage) return;
    try {
        const claimId = await createClaim({
            evidenceImageUrl: capturedImage,
            evidenceStorageId: evidenceStorageId,
            analysis: analysis
        });
        
        setActiveClaimId(claimId);
        
        // Start Liveness Flow
        const challengeText = await requestLiveness({ claimId });
        setChallenge(challengeText);
        setShowLivenessOverlay(true);

    } catch (e) {
        console.error("Claim Creation Failed", e);
        alert("Failed to file claim. Please try again.");
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

      <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-md mx-auto relative">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          
          {capturedImage ? (
            analysis ? (
                <div className="w-full space-y-4">
                    <AnalysisResult analysis={analysis} isLoading={false} />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => { setCapturedImage(null); setAnalysis(null); }} variant="outline" className="w-full">
                            Discard
                        </Button>
                        <Button 
                            onClick={handleCreateClaim}
                            className="w-full bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        >
                            {isUploading ? "Processing..." : "File Claim & Verify"}
                        </Button>
                    </div>
                </div>
            ) : (
            <EvidenceViewer
              imageSrc={capturedImage}
              isUploading={isUploading}
              onRetake={handleRetake}
              onConfirm={handleConfirm}
            />
            )
          ) : (
            <div className="text-center space-y-6">
              <div className="relative mx-auto">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Button
                  onClick={() => {
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
