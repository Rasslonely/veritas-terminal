import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

export function MatrixLog({ message }: { message: string }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + message.charAt(i));
      i++;
      if (i >= message.length) clearInterval(interval);
    }, 40); // Tactical typing speed
    
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="font-mono text-[11px] leading-relaxed text-emerald-400 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden group">
      {/* Tactical Header */}
      <div className="flex items-center gap-2 mb-2 opacity-40 group-hover:opacity-100 transition-opacity">
         <div className="w-1.5 h-1.5 rounded-sm bg-emerald-500 animate-pulse" />
         <span className="text-[9px] font-black uppercase tracking-[0.2em]">System_Event_Log</span>
      </div>

      <div className="flex gap-3">
        <span className="text-emerald-500/50 shrink-0 select-none">»</span>
        <div className="flex-1 italic">
          {displayedText}
          <span className="inline-block w-2 h-4 bg-emerald-500/50 ml-1 animate-pulse align-middle" />
        </div>
      </div>

      {/* Decorative Bits */}
      <div className="absolute bottom-1 right-2 text-[8px] font-mono text-emerald-500/10 uppercase tracking-widest">
         X-8004_UPLINK
      </div>
    </div>
  );
}
