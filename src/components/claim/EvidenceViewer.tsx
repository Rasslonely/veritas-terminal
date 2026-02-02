"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, CheckCircle2 } from "lucide-react";

interface EvidenceViewerProps {
  imageSrc: string;
  isUploading: boolean;
  onRetake: () => void;
  onConfirm: () => void;
}

export function EvidenceViewer({ imageSrc, isUploading, onRetake, onConfirm }: EvidenceViewerProps) {
  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <Card className="flex-1 relative overflow-hidden border-primary/20 bg-black/50 backdrop-blur-sm">
        <CardContent className="p-0 h-full flex items-center justify-center relative">
          {/* Image Preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageSrc} 
            alt="Evidence Preview" 
            className="w-full h-full object-contain"
          />
          
          {/* Scanning Overlay Effect */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-4 z-10">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
              </div>
              <p className="text-primary font-mono text-sm tracking-widest animate-pulse">
                UPLOADING TO HCS...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={onRetake}
          disabled={isUploading}
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Retake
        </Button>
        <Button 
          onClick={onConfirm}
          disabled={isUploading}
          className="bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          {isUploading ? "Uploading..." : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Evidence
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
