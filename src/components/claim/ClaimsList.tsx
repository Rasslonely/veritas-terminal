"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ShieldCheck, ShieldAlert, Clock, ChevronRight } from "lucide-react";

export function ClaimsList() {
    // For demo, we fetch all recent claims (simulating user history)
    const claims = useQuery(api.claims.getUserClaims, {}); 

    if (!claims) {
        return <div className="text-center text-muted-foreground animate-pulse">Loading secure records...</div>;
    }

    if (claims.length === 0) {
        return (
            <div className="text-center py-10 space-y-4">
                <div className="bg-white/5 rounded-full p-6 w-20 h-20 mx-auto border border-dashed border-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">No Claims Found</h3>
                    <p className="text-sm text-muted-foreground">Your history is clean.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {claims.map((claim) => (
                <Link key={claim._id} href={`/claims/${claim._id}`}>
                    <Card className="p-4 bg-black/40 border-white/10 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <div className="flex gap-4 items-start relative z-10">
                            {/* Thumbnail or Icon */}
                            <div className="w-16 h-16 rounded-md bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                                {claim.evidenceImageUrl ? (
                                    <img src={claim.evidenceImageUrl} alt="Evidence" className="w-full h-full object-cover" />
                                ) : (
                                    <ShieldAlert className="w-6 h-6 text-white/20" />
                                )}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-white text-sm">
                                        {claim.initialAnalysis?.objectDetected || "Unknown Object"}
                                    </h4>
                                    <Badge variant="outline" className={`text-[10px] ${getStatusColor(claim.status)}`}>
                                        {claim.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">
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
                            
                            <ChevronRight className="w-5 h-5 text-white/20 mt-6 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Card>
                </Link>
            ))}
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
