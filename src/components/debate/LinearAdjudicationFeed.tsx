"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";

export function LinearAdjudicationFeed({ claimId }: { claimId: Id<"claims"> }) {
  const messages = useQuery(api.claims.getDebateMessages, { claimId });

  if (!messages) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-mono text-emerald-500/50 uppercase tracking-widest">Awaiting Uplink...</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 space-y-8 py-4">
      {/* The Vertical Line */}
      <div className="absolute left-[15px] top-6 bottom-6 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />

      {messages.map((msg, index) => {
        const isLatest = index === messages.length - 1;
        const isVerdict = msg.agentRole === "VERDICT";
        
        return (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Status Dot */}
            <div className={cn(
              "absolute -left-[24px] top-1 w-4 h-4 rounded-full border-2 bg-black flex items-center justify-center z-10",
              isVerdict ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "border-emerald-500/30",
              isLatest && !isVerdict && "animate-pulse border-emerald-400"
            )}>
              {isVerdict ? (
                <CheckCircle2 className="w-2 h-2 text-emerald-500" />
              ) : (
                <div className={cn("w-1 h-1 rounded-full", isLatest ? "bg-emerald-400" : "bg-emerald-500/30")} />
              )}
            </div>

            {/* Content Card */}
            <div className={cn(
              "p-4 rounded-2xl border transition-all duration-500",
              isVerdict 
                ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                : "bg-white/5 border-white/5"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-[10px] font-bold tracking-[0.2em] uppercase",
                  isVerdict ? "text-emerald-400" : "text-white/40"
                )}>
                  {msg.agentName}
                </span>
                <span className="text-[8px] font-mono text-white/20">
                  {new Date(msg._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className={cn(
                "text-sm leading-relaxed",
                isVerdict ? "text-white font-medium" : "text-white/70"
              )}>
                {msg.content}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Loading state if still active */}
      {!messages.some(m => m.agentRole === "VERDICT") && (
        <div className="relative pl-1">
           <div className="absolute -left-[25px] top-1">
             <Loader2 className="w-4 h-4 text-emerald-500/20 animate-spin" />
           </div>
           <p className="text-[10px] font-mono text-emerald-500/30 uppercase tracking-widest animate-pulse">
             System: Deliberating...
           </p>
        </div>
      )}
    </div>
  );
}
