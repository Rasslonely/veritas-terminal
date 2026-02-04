"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Scale, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { HCSBadge } from "../debate/HCSBadge";

export function HallOfJustice() {
  const feed = useQuery(api.feed.getPublicFeed);

  if (!feed) {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Hall of Justice
         </h2>
         <Badge variant="outline" className="font-mono text-xs border-blue-500/30 text-blue-400">
            LIVE FEED
         </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {feed.map((item, idx) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-0 overflow-hidden group border-white/10">
                <div className="grid grid-cols-12 gap-0">
                    {/* Image Section */}
                    <div className="col-span-4 relative h-full min-h-[160px]">
                        <img 
                            src={item.evidenceImageUrl} 
                            alt="Evidence" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="col-span-8 p-4 flex flex-col justify-between">
                        <div className="space-y-2">
                             <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6 border border-white/20">
                                        <AvatarImage src={item.userAvatar} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{item.userName}</span>
                                </div>
                                <span className="text-[10px] font-mono text-white/40">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                             </div>

                             <div className="flex items-center gap-2">
                                {item.status === "APPROVED" ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED
                                    </Badge>
                                ) : (
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                                        <XCircle className="w-3 h-3 mr-1" /> REJECTED
                                    </Badge>
                                )}
                                <span className="text-xs font-medium text-white/80 line-clamp-1">
                                    {item.initialAnalysis.objectDetected} ({item.initialAnalysis.damageLevel})
                                </span>
                             </div>

                             <p className="text-sm italic text-white/70 border-l-2 border-white/10 pl-3 line-clamp-2">
                                "{item.verdictStatement}"
                             </p>
                        </div>
                        
                        <div className="pt-3 mt-3 border-t border-white/5 flex justify-end">
                             {item.verdictTx && <HCSBadge txHash={item.verdictTx} />}
                        </div>
                    </div>
                </div>
            </GlassCard>
          </motion.div>
        ))}

        {feed.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                <Scale className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No verdicts rendered yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
