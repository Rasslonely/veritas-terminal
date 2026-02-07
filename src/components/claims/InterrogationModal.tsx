import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VoiceVisualizer } from "@/components/ui/VoiceVisualizer";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Loader2, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterrogationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAudio: (audioBlob: Blob) => Promise<void>;
  challengeText?: string;
}

export function InterrogationModal({ isOpen, onClose, onSubmitAudio, challengeText }: InterrogationModalProps) {
  const { isRecording, startRecording, stopRecording, audioBlob, audioUrl, resetRecording } = useVoiceRecorder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setIsSubmitting(true);
    try {
      await onSubmitAudio(audioBlob);
      // Close handled by parent or success state
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-red-500/30 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500 font-mono tracking-tighter flex items-center gap-2">
            <span className="animate-pulse">●</span> VOIGHT-KAMPFF PROTOCOL
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-mono">
             Discrepancy detected in your claim. Verbal verification required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="bg-zinc-900/50 p-4 rounded-md border border-zinc-800">
            <p className="text-sm text-zinc-300 italic">
              "System: {challengeText || 'Explain exactly how the damage occurred. My sensors indicate physics inconsistencies in your initial report.'}"
            </p>
          </div>

          <div className="relative">
             <VoiceVisualizer isRecording={isRecording} className="border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" />
             
             {audioUrl && !isRecording && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                 <p className="text-green-400 font-mono text-sm">✓ Recording Captured</p>
               </div>
             )}
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording && !audioUrl && (
              <Button 
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full h-16 w-16 p-0 shadow-[0_0_20px_rgba(220,38,38,0.5)] border-4 border-zinc-900"
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}

            {isRecording && (
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="rounded-full h-16 w-16 p-0 animate-pulse"
              >
                <Square className="h-6 w-6 fill-current" />
              </Button>
            )}

            {audioUrl && (
               <div className="flex gap-2 w-full">
                 <Button variant="outline" onClick={resetRecording} className="flex-1 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                   Retake
                 </Button>
                 <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                 >
                   {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Verify Truth"}
                 </Button>
               </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            Identity Integrity System v2.5
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
