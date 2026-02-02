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

export default function ScanPage() {
  const router = useRouter();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const analyzeEvidence = useAction(api.actions.gemini.analyzeEvidence);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<EvidenceAnalysis | null>(null);

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setIsCameraOpen(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraOpen(true);
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;

    try {
      setIsUploading(true);

      // 1. Get Upload URL
      const postUrl = await generateUploadUrl();

      // 2. Convert Base64 to Blob
      const res = await fetch(capturedImage);
      const blob = await res.blob();

      // 3. Upload File
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      const { storageId } = await result.json();

      // 4. Analyze Image
      const analysisResult = await analyzeEvidence({ storageId });
      setAnalysis(analysisResult);
      
    } catch (error) {
      console.error("Upload/Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsUploading(false);
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
      <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-md mx-auto relative">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          
          {capturedImage ? (
            analysis ? (
                <div className="w-full space-y-4">
                    <AnalysisResult analysis={analysis} isLoading={false} />
                    <Button onClick={() => { setCapturedImage(null); setAnalysis(null); }} variant="outline" className="w-full">
                        Scan Another Item
                    </Button>
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
                  onClick={() => setIsCameraOpen(true)}
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
