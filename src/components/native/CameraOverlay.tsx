"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

const videoConstraints = {
  facingMode: "environment",
  width: { ideal: 1920 },
  height: { ideal: 1080 },
};

interface CameraOverlayProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export function CameraOverlay({ onCapture, onClose }: CameraOverlayProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isReady, setIsReady] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Haptic feedback if available
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pb-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full h-12 w-12"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm animate-pulse">
            Initializing Optics...
          </div>
        )}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isReady ? "opacity-100" : "opacity-0"
          )}
          onUserMedia={() => setIsReady(true)}
        />
        
        {/* Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-[3/4] border border-white/30 rounded-lg">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
            
            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/80 backdrop-blur-xl p-8 pb-12 flex justify-center items-center gap-8 z-20">
        <div className="w-12" /> {/* Spacer */}
        
        {/* Shutter Button */}
        <button
          onClick={capture}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all duration-300" />
          <div className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent group-active:scale-95 transition-transform">
            <div className="w-16 h-16 rounded-full bg-white group-hover:bg-primary transition-colors duration-300" />
          </div>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 rounded-full"
          onClick={() => {
             // Basic switch camera logic would go here, requiring state management for constraints
          }}
        >
          <RefreshCw className="w-6 h-6 opacity-50" />
        </Button>
      </div>
    </div>
  );
}
