"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomConnectButton } from "@/components/auth/CustomConnectButton";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Zap, Gavel, ScanLine, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function FieldView() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center text-center space-y-6 min-h-[80vh] w-full">
        
        {/* HERO: Animated Scanner Reticle */}
        <div className="relative group cursor-pointer">
           {/* Pulsing Rings */}
           <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-8 rounded-full border border-emerald-500/30 blur-sm"
           />
           <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-emerald-500/50 border-t-transparent border-l-transparent"
           />
           
           {/* Center Core */}
           <div className="relative z-10 p-6 bg-black/50 backdrop-blur-xl rounded-full ring-1 ring-white/10 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <img 
                src="/icon.png" 
                alt="Veritas Scanner" 
                className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              />
           </div>

           <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/30 rounded-full border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">System Online</span>
              </div>
           </div>
        </div>

        {/* TITLE: Cinematic Typography */}
        <div className="space-y-2 pt-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 drop-shadow-sm">
            VERITAS
          </h1>
          <p className="text-[10px] md:text-xs text-emerald-500/60 font-mono tracking-[0.3em] uppercase">
            Start Scanning
          </p>
        </div>

        {/* ACTION: Wallet Connection */}
        <div className="w-full max-w-xs space-y-6 relative z-20">
          <div className="backdrop-blur-md bg-white/5 p-1 rounded-2xl border border-white/5 shadow-2xl">
              <CustomConnectButton />
          </div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            Secure Neural Link Required
          </p>
        </div>

        {/* FEATURES: Glass Cards */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-md flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group">
            <Zap className="w-5 h-5 text-yellow-500/80 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all" />
            <span className="text-[10px] font-medium text-white/60 tracking-wider uppercase">Instant Settle</span>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-md flex flex-col items-center gap-2 hover:bg-white/10 transition-colors group">
            <Gavel className="w-5 h-5 text-purple-500/80 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all" />
            <span className="text-[10px] font-medium text-white/60 tracking-wider uppercase">AI Jury</span>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
