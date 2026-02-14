"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
    ShieldCheck, 
    ShieldAlert, 
    Clock, 
    ChevronRight, 
    Cpu, 
    Hash, 
    Database, 
    Fingerprint 
} from "lucide-react";
import { ClaimsSkeleton } from "./ClaimsSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Id } from "../../../convex/_generated/dataModel";

interface ClaimsListProps {
    variant?: "dossier" | "ledger";
    userId?: Id<"users">;
}

export function ClaimsList({ variant = "dossier", userId }: ClaimsListProps) {
    const claims = useQuery(api.claims.getUserClaims, { userId }); 
    const [displayCount, setDisplayCount] = useState(variant === "ledger" ? 10 : 6);
    const [isStreaming, setIsStreaming] = useState(false);

    if (!claims) {
        return <ClaimsSkeleton count={variant === "ledger" ? 5 : 3} variant={variant} />;
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
                    <h3 className="text-lg font-medium text-white">No Nexus Records</h3>
                    <p className="text-sm text-muted-foreground">The ledger is currently clear.</p>
                </div>
            </motion.div>
        );
    }

    const loadMore = () => {
        setIsStreaming(true);
        setTimeout(() => {
            setDisplayCount(prev => prev + (variant === "ledger" ? 10 : 4));
            setIsStreaming(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            {variant === "ledger" ? (
                /* HIGH-DENSITY LEDGER VIEW (Archives) */
                <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-black/20 backdrop-blur-xl">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <div className="col-span-2">Nexus_ID</div>
                        <div className="col-span-3">Object_Manifest</div>
                        <div className="col-span-3"><span className="flex items-center gap-1"><Hash className="w-3 h-3" /> TX_Hash</span></div>
                        <div className="col-span-2 text-center">HCS_Status</div>
                        <div className="col-span-2 text-right">Timestamp</div>
                    </div>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    >
                        <AnimatePresence mode="popLayout">
                            {displayedClaims.map((claim) => (
                                <Link key={claim._id} href={`/claims/${claim._id}`}>
                                    <motion.div
                                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                                        className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 hover:bg-emerald-500/10 transition-colors items-center group cursor-pointer relative overflow-hidden"
                                    >
                                        {/* Hover Scanline */}
                                        <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                        
                                        <div className="col-span-2 font-mono text-[11px] text-emerald-400 font-bold">
                                            {claim._id.substring(claim._id.length - 6).toUpperCase()}
                                        </div>
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="w-6 h-6 rounded bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                                <img src={claim.evidenceImageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                            </div>
                                            <span className="text-[12px] font-medium text-white/80 line-clamp-1 group-hover:text-white transition-colors">
                                                {claim.initialAnalysis?.objectDetected || "Unknown Object"}
                                            </span>
                                        </div>
                                        <div className="col-span-3 font-mono text-[10px] text-white/30">
                                            {claim.settlementTxHash ? (
                                                <span className="text-emerald-500/50 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                                                    <ShieldCheck className="w-3 h-3" /> {claim.settlementTxHash.slice(0, 12)}...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" /> Pending_Block
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 font-mono shadow-[0_0_10px_rgba(0,0,0,0.2)]", getStatusColor(claim.status))}>
                                                {claim.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-2 text-right text-[10px] text-white/40 font-mono group-hover:text-white/60 transition-colors">
                                            {formatDistanceToNow(claim.createdAt)}
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            ) : (
                /* TACTILE DOSSIER VIEW (Profile) */
                <motion.div 
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    <AnimatePresence mode="popLayout">
                        {displayedClaims.map((claim) => (
                            <motion.div
                                key={claim._id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                transition={{ duration: 0.4 }}
                            >
                                <Link href={`/claims/${claim._id}`}>
                                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all group relative overflow-hidden backdrop-blur-md">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <div className="flex gap-6 items-center relative z-10">
                                            <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative p-1">
                                                <img src={claim.evidenceImageUrl} alt="Evidence" className="w-full h-full object-cover rounded-lg" />
                                                <div className="absolute top-1 right-1">
                                                    <Fingerprint className="w-4 h-4 text-emerald-500/50" />
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <h4 className="font-black text-white text-base tracking-tight uppercase">
                                                            {claim.initialAnalysis?.objectDetected || "Unknown Object"}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500/60 font-bold tracking-widest">
                                                            <Database className="w-3 h-3" />
                                                            ID: VERI-{claim._id.substring(claim._id.length - 4).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <Badge className={cn("text-[9px] px-2 py-0.5", getStatusColor(claim.status))}>
                                                        {claim.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-white/40">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-white/20" />
                                                        {formatDistanceToNow(claim.createdAt)} ago
                                                    </div>
                                                    {claim.settlementTxHash && (
                                                        <div className="flex items-center gap-1 text-emerald-400 font-bold">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            SETTLED
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Load More Controller */}
            {hasMore && (
                 <div className="pt-6 flex flex-col items-center gap-4">
                    {isStreaming ? (
                        <div className="flex flex-col items-center gap-2">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full"
                            />
                            <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-[0.4em] animate-pulse">Neural_Syncing...</span>
                        </div>
                    ) : (
                        <button 
                            onClick={loadMore}
                            className="px-8 py-2.5 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-black text-white/40 hover:text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all uppercase tracking-[0.3em] group flex items-center gap-3"
                        >
                            <Cpu className="w-4 h-4 group-hover:text-emerald-500 transition-colors" />
                            Expand Archives
                        </button>
                    )}
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
