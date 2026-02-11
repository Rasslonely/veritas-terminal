"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ShieldCheck, ShieldAlert, Clock, ChevronRight, Cpu } from "lucide-react";
import { ClaimsSkeleton } from "./ClaimsSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ClaimsList() {
    const claims = useQuery(api.claims.getUserClaims, {}); 
    const [displayCount, setDisplayCount] = useState(6);
    const [isStreaming, setIsStreaming] = useState(false);

    if (!claims) {
        return <ClaimsSkeleton count={3} />;
    }

    const displayedClaims = claims.slice(0, displayCount);
    const hasMore = displayCount < claims.length;

    if (claims.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 space-y-4"
            >
                <div className="bg-white/5 rounded-full p-6 w-20 h-20 mx-auto border border-dashed border-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">No Claims Found</h3>
                    <p className="text-sm text-muted-foreground">Your history is clean.</p>
                </div>
            </motion.div>
        );
    }

    const loadMore = () => {
        setIsStreaming(true);
        setTimeout(() => {
            setDisplayCount(prev => prev + 4);
            setIsStreaming(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
            >
                <AnimatePresence mode="popLayout">
                    {displayedClaims.map((claim) => (
                        <motion.div
                            key={claim._id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <Link href={`/claims/${claim._id}`}>
                                <Card className="p-4 bg-black/40 border-white/10 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    
                                    <div className="flex gap-4 items-start relative z-10">
                                        <div className="w-16 h-16 rounded-md bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                            {claim.evidenceImageUrl ? (
                                                <img src={claim.evidenceImageUrl} alt="Evidence" className="w-full h-full object-cover" />
                                            ) : (
                                                <ShieldAlert className="w-6 h-6 text-white/20" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-white text-[13px] md:text-sm">
                                                    {claim.initialAnalysis?.objectDetected || "Unknown Object"}
                                                </h4>
                                                <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 md:text-[10px]", getStatusColor(claim.status))}>
                                                    {claim.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-1">
                                                {claim.initialAnalysis?.description || "No description available."}
                                            </p>
                                            
                                            <div className="flex items-center gap-2 pt-2 text-[10px] text-muted-foreground/60 font-mono">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(claim.createdAt)} ago
                                                {claim.settlementTxHash && (
                                                    <span className="text-emerald-500 flex items-center gap-1 ml-2">
                                                        • PAID
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/20 mt-6 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Load More Controller */}
            {hasMore && (
                 <div className="pt-4 flex flex-col items-center gap-4">
                    {isStreaming ? (
                        <div className="flex flex-col items-center gap-2">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full"
                            />
                            <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest animate-pulse">Neural_Syncing...</span>
                        </div>
                    ) : (
                        <button 
                            onClick={loadMore}
                            className="px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all uppercase tracking-[0.2em] group flex items-center gap-2"
                        >
                            <Cpu className="w-3 h-3 group-hover:text-emerald-500 transition-colors" />
                            Load More Records
                        </button>
                    )}
                    
                    <div className="text-[9px] font-mono text-white/10 uppercase tracking-widest">
                        Total_Nodes_Found: {claims.length} // Buffer_Index: {displayCount}
                    </div>
                 </div>
            )}
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case "APPROVED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "REJECTED": return "bg-red-500/10 text-red-400 border-red-500/20";
        case "SETTLED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "DEBATE_IN_PROGRESS": return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
        default: return "bg-white/5 text-muted-foreground border-white/10";
    }
}
