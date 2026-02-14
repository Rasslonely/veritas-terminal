"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Types
interface Claim {
  _id: string;
  createdAt: number;
  status: string;
  [key: string]: any;
}

interface LiveFeedProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

const DUMMY_LOGS = [
  { id: "LOG-001", time: "10:42:05", node: "VTS-09", msg: "VERIFIED_CLAIM_#882" },
  { id: "LOG-002", time: "10:42:08", node: "VTS-012", msg: "ANALYZING_IMAGE_BUFFER" },
  { id: "LOG-003", time: "10:42:15", node: "VTS-04", msg: "FRAUD_PATTERN_DETECTED" },
];

export function LiveFeed({ claims, onSelectClaim }: LiveFeedProps) {
  const [typedText, setTypedText] = useState("");
  const fullText = "ENCRYPTED_UPLINK_ESTABLISHED";

  // Typewriter effect for footer
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 font-mono text-xs flex flex-col hover:border-[#00ff9d]/30 transition-colors duration-300 h-[400px] relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-[#00ff9d]" />
          <span className="text-[#00ff9d] font-bold tracking-widest drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">
            LIVE_OPS_FEED
          </span>
          <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-ping ml-2 wait-1s" />
        </div>
        <a 
          href="/admin/forge" 
          className="text-[10px] text-white/30 hover:text-[#00ff9d] transition-colors flex items-center gap-1 font-bold group-hover:translate-x-1 duration-300"
        >
          <Cpu className="w-3 h-3" /> POLICY_FORGE
        </a>
      </div>

      {/* Feed Content */}
      <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar z-10 flex-1">
        <AnimatePresence mode='popLayout'>
          {claims.length > 0 ? claims.map((claim) => (
            <motion.button 
              key={claim._id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              onClick={() => onSelectClaim(claim)}
              className="flex gap-3 items-start border-l-2 border-[#00ff9d]/20 pl-3 w-full text-left hover:bg-[#00ff9d]/10 transition-all p-2 rounded-r group/item"
              whileHover={{ x: 5 }}
            >
              <span className="text-[#00ff9d]/50 whitespace-nowrap font-mono text-[10px] mt-0.5">
                [{new Date(claim.createdAt).toLocaleTimeString()}]
              </span>
              <div className="flex flex-col">
                <span className={cn(
                  "font-bold tracking-wide flex items-center gap-2",
                  claim.status === "APPROVED" ? "text-emerald-400" :
                  claim.status === "REJECTED" ? "text-red-400" : "text-amber-400"
                )}>
                  CLAIM_#{claim._id.slice(-4).toUpperCase()}
                  {claim.status === "REJECTED" && <ShieldAlert className="w-3 h-3" />}
                  {claim.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                </span>
                <span className="text-[10px] text-white/40 group-hover/item:text-white/70 transition-colors">
                  STATUS: {claim.status}
                </span>
              </div>
            </motion.button>
          )) : DUMMY_LOGS.map((log) => (
            <div key={log.id} className="flex gap-3 items-start opacity-50 border-l-2 border-white/5 pl-3 py-1">
              <span className="text-white/30 whitespace-nowrap text-[10px]">[{log.time}]</span>
              <div className="flex flex-col">
                <span className="text-[#00ff9d]/70 font-bold">{log.node}</span>
                <span className="text-[10px] text-white/30">{log.msg}</span>
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Footer (Scanline & Typed Text) */}
      <div className="mt-auto pt-2 border-t border-white/5 text-[10px] text-center text-white/20 font-mono tracking-[0.2em] relative">
        <span className="animate-pulse">{typedText}</span>
        <span className="inline-block w-1.5 h-3 bg-[#00ff9d] ml-1 animate-blink align-middle" />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#00ff9d]/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00ff9d]/10 to-transparent pointer-events-none rounded-bl-3xl" />
    </div>
  );
}
