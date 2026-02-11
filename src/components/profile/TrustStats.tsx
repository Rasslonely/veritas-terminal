"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Target, 
  TrendingUp,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Investigation Speed", value: 98, icon: Zap, color: "text-amber-500", detail: "TOP 2% GLOBAL" },
  { label: "Consensus Accuracy", value: 92, icon: Target, color: "text-emerald-500", detail: "0.4% DEVIATION" },
  { label: "Truth Bond Integrity", value: 100, icon: ShieldCheck, color: "text-blue-500", detail: "RANK: PRIME" },
];

export function TrustStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {STATS.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className={cn("absolute -right-4 -top-4 w-12 h-12 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity rounded-full bg-current", stat.color)} />
          
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2 rounded-lg bg-current/10", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold tracking-tighter text-white tabular-nums">
                {stat.value}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
             <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
               {stat.label}
             </h3>
             {/* Progress Bar */}
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                  className={cn("h-full bg-current", stat.color)}
                />
             </div>
             <p className={cn("text-[9px] font-bold tracking-tighter uppercase", stat.color)}>
               {stat.detail}
             </p>
          </div>
        </motion.div>
      ))}

      {/* Live Accuracy Feed */}
      <div className="md:col-span-3 p-4 rounded-2xl bg-zinc-950 border border-white/5 font-mono text-[9px] flex items-center gap-4 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
         <div className="flex items-center gap-2 text-emerald-500 shrink-0">
            <Cpu className="w-3 h-3" />
            <span className="animate-pulse">NEURAL_SYNC_ACTIVE:</span>
         </div>
         <div className="flex gap-4 animate-marquee whitespace-nowrap">
            <span className="text-white/30">DEBATE_ACCURACY: 99.4%</span>
            <span className="text-white/30">REASONING_LATENCY: 42ms</span>
            <span className="text-white/30">FRAUD_DETECTION_OVERRIDE: NULL</span>
            <span className="text-white/30">HCS_CONSENSUS: STABLE</span>
            {/* Duplicate for seamless marquee */}
            <span className="text-white/30">DEBATE_ACCURACY: 99.4%</span>
            <span className="text-white/30">REASONING_LATENCY: 42ms</span>
         </div>
      </div>
    </div>
  );
}
