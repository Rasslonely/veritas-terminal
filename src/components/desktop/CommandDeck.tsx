"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DUMMY_LOGS = [
  { id: 1, time: "10:42:05", node: "VTS-09", msg: "VERIFIED_CLAIM_#882" },
  { id: 2, time: "10:42:08", node: "VTS-012", msg: "ANALYZING_IMAGE_BUFFER" },
  { id: 3, time: "10:42:15", node: "VTS-04", msg: "FRAUD_PATTERN_DETECTED" },
  { id: 4, time: "10:42:22", node: "VTS-07", msg: "PAYOUT_EXECUTED_TX_0x82...99" },
  { id: 5, time: "10:42:30", node: "VTS-01", msg: "NEW_NODE_CONNECTED_TO_MESH" },
  { id: 6, time: "10:42:45", node: "VTS-09", msg: "CONSENSUS_REACHED_BLOCK_992" },
  { id: 7, time: "10:43:01", node: "VTS-03", msg: "UPLINK_ESTABLISHED_SOUTH_ASIA" },
  { id: 8, time: "10:43:12", node: "VTS-05", msg: "SYNCING_LEDGER_STATE" },
];

import { VerdictCard } from "@/components/debate/VerdictCard";
import { useState } from "react";
import { X } from "lucide-react";

export function CommandDeck() {
  const recentClaims = useQuery(api.claims.getRecentClaims) || [];
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  
  // Calculate Stats
  const totalSecured = (recentClaims || []).reduce((acc: number, curr: any) => acc + (curr?.estimatedValue || 0), 12450000); // Base value
  const activeAgents = 1024 + (recentClaims?.length || 0);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* VERDICT OVERLAY MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="relative w-full max-w-lg">
              <button 
                onClick={() => setSelectedClaim(null)}
                className="absolute -top-4 -right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors z-50"
              >
                <X className="w-5 h-5" />
              </button>
              <VerdictCard 
                claimId={selectedClaim._id}
                recipientAddress="0x5f80439206742Ac04e031665d1DFEDe11C9730aD" // Demo Address or from claim
                confidenceScore={selectedClaim.confidence || 92}
                analyzedSeverity={selectedClaim.severity || "CRITICAL_DAMAGE_DETECTED"}
                payoutAmount="0.001"
              />
           </div>
        </div>
      )}

      <div className="relative z-10 p-8 grid grid-cols-12 gap-6 min-h-screen content-start">
        
        {/* LEFT COLUMN: HERO MAP & SCENE */}
        <div className="col-span-8 flex flex-col gap-6">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b border-white/10 pb-4"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        VERITAS <span className="text-white">COMMAND</span>
                    </h1>
                    <p className="text-xs text-emerald-500/50 tracking-[0.2em] mt-1">SECURE OPERATIONS CENTER // NODE_ID: VTS-ALPHA</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        SYSTEM_NORMAL
                    </div>
                </div>
            </motion.div>

            {/* Main Visual - Radar Map */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {/* Radar Grid */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-[600px] h-[600px] border border-emerald-500/20 rounded-full absolute" />
                    <div className="w-[400px] h-[400px] border border-emerald-500/20 rounded-full absolute" />
                    <div className="w-[200px] h-[200px] border border-emerald-500/20 rounded-full absolute" />
                    <div className="w-full h-[1px] bg-emerald-500/20 absolute" />
                    <div className="h-full w-[1px] bg-emerald-500/20 absolute" />
                </div>
                
                {/* Radar Sweep Effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[600px] h-[600px] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(16,185,129,0.1)_60deg,transparent_60deg)] animate-[spin_4s_linear_infinite] rounded-full mix-blend-screen" />
                </div>

                {/* Blips */}
                 <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                 <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-700" />

                <div className="absolute bottom-4 left-4 text-xs font-mono text-emerald-500/70">
                    <p>SCANNING_SECTOR_07...</p>
                    <p>TARGETS_ACQUIRED: 2</p>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/50 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/50 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 rounded-br-lg" />
            </div>
        </div>

        {/* RIGHT COLUMN: DATA STREAM & STATS */}
        <div className="col-span-4 flex flex-col gap-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                    <p className="text-[10px] text-emerald-500/70 uppercase tracking-wider">Total Value Secured</p>
                    <p className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                         ${totalSecured.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300">
                    <p className="text-[10px] text-red-500/70 uppercase tracking-wider">Fraud Blocked</p>
                    <p className="text-2xl font-bold text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">843</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg col-span-2 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                    <p className="text-[10px] text-emerald-500/70 uppercase tracking-wider">Active Field Agents</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <p className="text-xl font-bold text-white tracking-widest">{activeAgents} <span className="text-xs text-white/50 font-normal">NODES ONLINE</span></p>
                    </div>
                </div>
            </div>

            {/* Live Feed */}
            <div className="flex-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-4 font-mono text-xs flex flex-col hover:border-emerald-500/30 transition-colors duration-300 h-[400px]">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <span className="text-emerald-500 font-bold tracking-widest">LIVE_FEED</span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <div className="space-y-3 overflow-y-auto pr-2">
                    {/* Render Real Claims if map exists, else use dummy logs for visual fidelity */}
                    {recentClaims.length > 0 ? recentClaims.map((claim) => (
                        <motion.button 
                            key={claim._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSelectedClaim(claim)}
                            className="flex gap-2 items-start border-l-2 border-emerald-500/20 pl-2 w-full text-left hover:bg-emerald-500/10 transition-colors p-2 rounded-r"
                        >
                            <span className="text-emerald-500/50 whitespace-nowrap">[{new Date(claim.createdAt).toLocaleTimeString()}]</span>
                            <div className="flex flex-col">
                                <span className={cn(
                                    "font-bold",
                                    claim.status === "APPROVED" ? "text-emerald-400" :
                                    claim.status === "REJECTED" ? "text-red-400" : "text-yellow-400"
                                )}>
                                    CLAIM_#{claim._id.slice(-4).toUpperCase()}
                                </span>
                                <span className="text-[10px] text-white/40">STATUS: {claim.status}</span>
                            </div>
                        </motion.button>
                    )) : DUMMY_LOGS.map((log) => (
                        <div key={log.id} className="flex gap-2 items-start opacity-70 border-l-2 border-emerald-500/10 pl-2">
                            <span className="text-emerald-500/50 whitespace-nowrap">[{log.time}]</span>
                            <div className="flex flex-col">
                                <span className="text-emerald-400 font-bold">{log.node}</span>
                                <span className="text-[10px] text-white/40">{log.msg}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Feed Footer */}
                <div className="mt-auto pt-2 border-t border-white/5 text-[10px] text-center text-white/20">
                     ENCRYPTED_CONNECTION_ESTABLISHED
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
