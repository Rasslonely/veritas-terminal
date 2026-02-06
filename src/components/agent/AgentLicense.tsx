"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Globe, Activity, Zap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AgentLicense() {
  const profile = useQuery(api.agent.identity.getAgentProfile, {});

  if (!profile) return (
      <div className="h-48 w-full animate-pulse bg-white/5 rounded-xl" />
  );

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto">
      <motion.div
        initial={{ rotateX: 10, rotateY: 10 }}
        animate={{ rotateX: 0, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
        className="relative group"
      >
        {/* HOLOGRAPHIC CARD */}
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black/80 backdrop-blur-xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            
            {/* Holographic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Background Circuitry */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Cpu className="w-24 h-24 text-emerald-500" />
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-start relative z-10 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase">Veritas Agent</h3>
                        <p className="text-[10px] text-emerald-500 font-mono">ERC-8004 COMPLIANT</p>
                    </div>
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-mono animate-pulse">
                    {profile.status}
                </div>
            </div>

            {/* IDENTITY GRID */}
            <div className="space-y-4 relative z-10">
                
                {/* Node ID */}
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Node Identifier</span>
                    <span className="font-mono text-lg font-bold text-white tracking-tighter shadow-emerald-500/50 drop-shadow-sm">
                        {profile.nodeId}
                    </span>
                </div>

                {/* Reputation */}
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Trust Score</span>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(profile.reputation / 1000) * 100}%` }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                        <span className="text-emerald-400 font-bold text-xs">{profile.reputation}</span>
                    </div>
                </div>

                {/* Services */}
                <div className="pt-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">Verified Services</span>
                    <div className="flex flex-wrap gap-2">
                        {profile.services.map((s: any) => (
                            <span key={s.id} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-white/70 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-yellow-500" /> {s.id}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-white/30 font-mono relative z-10">
                <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {profile.network}
                </span>
                <span>ID: {profile.tokenId}</span>
            </div>

        </div>
      </motion.div>
    </div>
  );
}
