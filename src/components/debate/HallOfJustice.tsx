"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, CheckCircle2, XCircle, ShieldCheck, Zap, Activity, Cpu } from "lucide-react";
import { HCSBadge } from "../debate/HCSBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";

function HallOfJusticeSkeleton() {
    return (
        <div className="space-y-8 relative z-10">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-2 w-32 bg-white/5 rounded-full animate-pulse" />
                </div>
                <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                {/* Featured Skeleton */}
                <div className="md:col-span-2 lg:col-span-3">
                    <div className="h-[420px] bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
                         <div className="grid md:grid-cols-2 lg:grid-cols-5 h-full">
                            <div className="md:col-span-1 lg:col-span-3 bg-white/5" />
                            <div className="md:col-span-1 lg:col-span-2 p-10 space-y-6">
                                <div className="h-10 w-10 rounded-full bg-white/5" />
                                <div className="space-y-3">
                                    <div className="h-8 w-full bg-white/5 rounded-lg" />
                                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                                </div>
                                <div className="h-24 w-full bg-white/5 rounded-lg" />
                            </div>
                         </div>
                    </div>
                </div>
                {/* Standard Skeletons */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-80 bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
                         <div className="h-40 bg-white/5" />
                         <div className="p-6 space-y-4">
                            <div className="h-4 w-24 bg-white/5 rounded-full" />
                            <div className="h-6 w-full bg-white/5 rounded-lg" />
                            <div className="h-12 w-full bg-white/10 rounded-lg" />
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NeuralAura() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Ambient Cyan Blob */}
            <motion.div 
                animate={{ 
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full mix-blend-screen"
            />
            {/* Ambient Emerald Blob */}
            <motion.div 
                animate={{ 
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1.1, 1, 1.1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full mix-blend-screen"
            />
        </div>
    );
}

// --- Sub-Components ---

function NeuralMeter({ label, value, color = "blue" }: { label: string, value: number, color?: "blue" | "emerald" | "amber" }) {
    const colorMap = {
        blue: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
        emerald: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
        amber: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    };

    return (
        <div className="space-y-1.5 w-full">
            <div className="flex justify-between items-center px-0.5">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">{label}</span>
                <span className="text-[8px] font-mono text-white/60">{value}%</span>
            </div>
            <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden flex items-center">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn("h-full rounded-full transition-all duration-1000", colorMap[color])} 
                />
            </div>
        </div>
    );
}

function CornerBrackets() {
    return (
        <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700 z-[4]">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/40" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/40" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/40" />
        </div>
    );
}

function Scanline() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/[0.03] animate-scanline" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20" />
        </div>
    );
}

export function HallOfJustice() {
  const feed = useQuery(api.feed.getPublicFeed);
  const [displayCount, setDisplayCount] = useState(6);
  const [isStreaming, setIsStreaming] = useState(false);

  if (!feed) {
    return (
        <div className="relative">
            <NeuralAura />
            <HallOfJusticeSkeleton />
        </div>
    );
  }

  const displayedItems = feed.slice(0, displayCount);
  const hasMore = displayCount < feed.length;

  const loadMore = () => {
    setIsStreaming(true);
    setTimeout(() => {
        setDisplayCount(prev => prev + 6);
        setIsStreaming(false);
    }, 1200);
  };

  return (
    <div className="relative">
      <NeuralAura />

      <div className="relative z-10 space-y-8">
        {/* Visual Overrides */}
      <style jsx global>{`
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(1000%); }
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-scanline {
            animation: scanline 8s linear infinite;
        }
        .animate-shimmer {
            animation: shimmer 2s linear infinite;
        }
      `}</style>

      <div className="flex items-center justify-between border-b border-white/5 pb-6">
         <div className="space-y-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                Hall of Justice
            </h2>
            <div className="flex items-center gap-2">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Neural_Nexus_Live_Archive</p>
                <div className="h-px w-8 bg-white/10" />
                <span className="text-[9px] font-mono text-blue-400/50">SECURE_CHANNEL_8004</span>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Status</span>
                <span className="text-[10px] text-emerald-500 font-mono">UPLINK_STABLE</span>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] py-1 px-3 border-blue-500/30 text-blue-400 bg-blue-500/5 animate-pulse">
                LIVE
            </Badge>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max text-white">
        <AnimatePresence mode="popLayout">
        {displayedItems.map((item, idx) => {
          const isFeatured = idx === 0;
          const nexusID = `NXS-8004-${item._id.substring(item._id.length - 4).toUpperCase()}`;
          
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={cn(
                isFeatured ? "md:col-span-2 lg:col-span-3" : "col-span-1 border-b md:border-none border-white/5 pb-6 md:pb-0"
              )}
            >
            <GlassCard 
                intensity={isFeatured ? "tactical" : "medium"} 
                className="p-0 overflow-hidden group border-white/5 hover:border-blue-500/20 transition-all duration-700 h-full shadow-2xl"
              >
                <div className={cn(
                    "w-full h-full",
                    isFeatured && "md:grid md:grid-cols-2 lg:grid-cols-5 md:h-[420px]"
                )}>
                    {/* Image Section */}
                    <div className={cn(
                        "relative overflow-hidden bg-zinc-950",
                        isFeatured ? "md:col-span-1 lg:col-span-3 h-64 md:h-full" : "h-48"
                    )}>
                        <img 
                            src={item.evidenceImageUrl} 
                            alt="Evidence" 
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110 opacity-90 group-hover:opacity-100"
                        />
                        
                        <Scanline />
                        <CornerBrackets />

                        <div className={cn(
                            "absolute inset-0 pointer-events-none transition-opacity duration-700 z-[2]",
                            isFeatured 
                                ? "bg-gradient-to-r from-transparent via-transparent to-black/80 opacity-0 md:opacity-100" 
                                : "bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"
                        )} />
                        
                        <div className="absolute top-4 left-4 flex gap-2 z-[3]">
                            {item.status === "APPROVED" ? (
                                <div className="p-1 px-3 rounded-sm bg-emerald-500 text-[10px] font-black text-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                    <CheckCircle2 className="w-3 h-3 stroke-[3]" /> VERIFIED
                                </div>
                            ) : (
                                <div className="p-1 px-3 rounded-sm bg-red-500 text-[10px] font-black text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                                    <XCircle className="w-3 h-3 stroke-[3]" /> FRAUD
                                </div>
                            )}
                            <div className="p-1 px-2 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/60">
                                {nexusID}
                            </div>
                        </div>

                        {/* Floating Tech Data (Featured Only) */}
                        {isFeatured && (
                            <div className="absolute bottom-6 left-6 hidden md:block z-[3] space-y-1 bg-black/40 backdrop-blur-md p-3 rounded-sm border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-tighter">Signal_Strength: Extreme</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-tighter">Encryption: Level_4</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className={cn(
                        "p-6 flex flex-col justify-between relative",
                        isFeatured ? "md:col-span-1 lg:col-span-2 md:p-10" : "space-y-4"
                    )}>
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                            <Avatar className="w-10 h-10 border border-white/20">
                                                <AvatarImage src={item.userAvatar} />
                                                <AvatarFallback className="bg-white/5 text-[10px]">U</AvatarFallback>
                                            </Avatar>
                                            <motion.div 
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full" 
                                            />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white leading-none">{item.userName}</span>
                                            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        </div>
                                        <span className="text-[10px] font-mono text-white/30 uppercase mt-1 tracking-wider">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                                {isFeatured && <HCSBadge txHash={item.verdictTx || "0x..."} />}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="h-px w-4 bg-blue-500" />
                                    <span className="text-[9px] font-mono text-blue-400 uppercase">Object_Analysis</span>
                                </div>
                                <h3 className={cn(
                                    "font-black text-white leading-tight tracking-tight uppercase",
                                    isFeatured ? "text-3xl" : "text-sm"
                                )}>
                                    {item.initialAnalysis.objectDetected}
                                </h3>
                                <div className="flex items-center gap-4">
                                     <p className="text-[10px] font-bold text-blue-400/80 tracking-[0.2em] uppercase">
                                        Lvl: {item.initialAnalysis.damageLevel}
                                     </p>
                                     <div className="h-3 w-px bg-white/10" />
                                     <p className="text-[9px] font-mono text-white/30 uppercase">
                                        P_ID: {item._id.substring(0, 8)}
                                     </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className={cn(
                                    "text-white/70 leading-relaxed font-medium",
                                    isFeatured ? "text-lg italic" : "text-[11px] line-clamp-3"
                                )}>
                                "{item.verdictStatement}"
                                </p>

                                {isFeatured && (
                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <NeuralMeter label="Neural_Confidence" value={98} color="emerald" />
                                        <NeuralMeter label="Peer_Consensus" value={100} color="blue" />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className={cn(
                            "pt-6 flex flex-col gap-3",
                            !isFeatured && "border-t border-white/5 mt-4 pt-4"
                        )}>
                            {!isFeatured && (
                                <NeuralMeter label="Consensus" value={idx % 2 === 0 ? 94 : 88} color={item.status === 'APPROVED' ? 'emerald' : 'amber'} />
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
                                    <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" />
                                    NEXUS_SYNC_DONE
                                </div>
                                {!isFeatured && item.verdictTx && <HCSBadge txHash={item.verdictTx} size="sm" />}
                            </div>
                        </div>

                        {/* Aesthetic Divider (Featured Only) */}
                        {isFeatured && (
                            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none opacity-5">
                                <div className="absolute top-[-50%] right-[-50%] w-full h-full border-2 border-white rotate-45" />
                            </div>
                        )}
                    </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
        </AnimatePresence>

        {feed.length > 0 && hasMore && (
            <div className="col-span-full pt-12 flex flex-col items-center gap-4">
                {isStreaming ? (
                    <div className="flex flex-col items-center gap-3">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full"
                        />
                        <span className="text-[10px] font-mono text-blue-400/50 uppercase tracking-[0.4em] animate-pulse">Neural_Sync_Active...</span>
                    </div>
                ) : (
                    <button 
                        onClick={loadMore}
                        className="px-10 py-3 rounded-sm border border-white/5 bg-white/[0.02] text-[10px] font-black text-white/40 hover:text-white hover:bg-white/10 hover:border-blue-500/30 transition-all uppercase tracking-[0.3em] group flex items-center gap-3 shadow-2xl"
                    >
                        <Cpu className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                        Load More Archives
                    </button>
                )}
                <div className="text-[9px] font-mono text-white/10 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    Buffer_Index: {displayCount} // Total_Nexus_Nodes: {feed.length}
                </div>
            </div>
        )}

        {feed.length === 0 && (
            <div className="col-span-full text-center py-40 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                <Scale className="w-12 h-12 mx-auto mb-4 text-white/10" />
                <h3 className="text-lg font-bold text-white/40">Nexus Archives Empty</h3>
                <p className="text-xs text-white/20 uppercase tracking-widest mt-1">Awaiting Consensus Stream...</p>
            </div>
        )}
      </div>
    </div>
    </div>
  );
}
