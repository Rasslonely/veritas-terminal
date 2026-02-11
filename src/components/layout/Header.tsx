"use client";

import { useNetwork } from "@/context/NetworkContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { chainMode, setChainMode } = useNetwork();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-6 pt-6 flex justify-between items-center max-w-7xl mx-auto pointer-events-none">
      {/* Brand / Logo */}
      <div className="pointer-events-auto flex items-center gap-2">
         <Avatar className="h-8 w-8 border border-white/20">
            <AvatarImage src="/logo.svg" />
            <AvatarFallback className="bg-emerald-900 text-emerald-400 font-bold">V</AvatarFallback>
         </Avatar>
         <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            VERITAS
         </span>
      </div>

      {/* Network Toggle Pill */}
      <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-1 flex items-center gap-1 shadow-2xl">
        <button
          onClick={() => setChainMode("HEDERA")}
          className={cn(
            "relative px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 flex items-center gap-1",
            chainMode === "HEDERA" ? "text-black" : "text-white/50 hover:text-white"
          )}
        >
          {chainMode === "HEDERA" && (
            <motion.div
              layoutId="network-pill"
              className="absolute inset-0 bg-white rounded-full mix-blend-screen"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">HEDERA</span>
        </button>

        <button
          onClick={() => setChainMode("BASE")}
          className={cn(
            "relative px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 flex items-center gap-1",
            chainMode === "BASE" ? "text-white" : "text-white/50 hover:text-white"
          )}
        >
           {chainMode === "BASE" && (
            <motion.div
              layoutId="network-pill"
              className="absolute inset-0 bg-[#0052FF] rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            BASE
            {chainMode === "BASE" && <Zap className="w-3 h-3 fill-white" />}
          </span>
        </button>
      </div>
    </div>
  );
}
