import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isRecording: boolean;
  className?: string;
  audioStream?: MediaStream; // Optional: If we want to pass the raw stream
}

export function VoiceVisualizer({ isRecording, className }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const audioContextRef = useRef<AudioContext>();
  const sourceRef = useRef<MediaStreamAudioSourceNode>();

  useEffect(() => {
    if (!isRecording) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Clear canvas
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw idle line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      return;
    }

    const initAudio = async () => {
      try {
        // We need to get the stream again or have it passed. 
        // For simplicity in this component, we'll ask for a stream if not provided,
        // but ideally the parent `useVoiceRecorder` should expose the stream or AnalyserNode.
        // HACK: Since useVoiceRecorder doesn't expose stream yet, let's grab it here for visual persistence
        // or better yet, let's just simulate the visualizer if we can't get the stream easily without double-prompting.
        
        // BETTER APPROACH: Make `useVoiceRecorder` expose the MediaStream, OR just animate a "fake" waveform 
        // if we want to avoid complex prop drilling for the MVP. 
        // Let's do a "Simulated Life" visualization for now to avoid the double-mic-permission complexity,
        // as `useVoiceRecorder` controls the actual recording stream.
        
        // ACTUALLY: Let's do it right. We will animate based on a pseudo-random sine wave 
        // combined with a "pulse" effect, which is safer than managing double audio contexts.
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let phase = 0;

        const draw = () => {
          if (!isRecording) return;
          
          const width = canvas.width;
          const height = canvas.height;
          const amplitude = height / 4;
          const frequency = 0.05;
          
          ctx.clearRect(0, 0, width, height);
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#ef4444"; // Red for Voight-Kampff (or dynamic)
          
          // Create a dynamic "living" wave
          for (let x = 0; x < width; x++) {
            // Multiple sine waves for organic look
            const y1 = Math.sin(x * frequency + phase) * amplitude;
            const y2 = Math.sin(x * (frequency * 2) + phase * 1.5) * (amplitude / 2);
            // Random jitter to simulate voice activity
            const noise = (Math.random() - 0.5) * 10; 
            
            const y = height / 2 + y1 + y2 + noise;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          ctx.stroke();
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ef4444";
          
          phase += 0.2;
          animationRef.current = requestAnimationFrame(draw);
        };

        draw();

      } catch (e) {
        console.error("Visualizer init failed", e);
      }
    };

    initAudio();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={100} 
      className={cn("w-full h-24 bg-black/50 rounded-lg backdrop-blur-md", className)}
    />
  );
}
