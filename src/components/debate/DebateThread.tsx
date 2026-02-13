import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, ShieldAlert, Scale, ChevronDown, ListTree, Zap, BrainCircuit, Cpu } from "lucide-react";
import { HCSBadge } from "./HCSBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function DebateThread({ claimId }: { claimId: Id<"claims"> }) {
  const messages = useQuery(api.claims.getDebateMessages, { claimId });
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const toggleReasoning = (id: string) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!messages) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <BrainCircuit className="w-8 h-8 text-emerald-500/50" />
        <p className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-[0.3em]">Synapsing Council Logic...</p>
      </div>
    );
  }

  return (
    <div className="relative group/thread">
      <div 
        className="space-y-6 md:h-[450px] h-[calc(100svh-420px)] overflow-y-auto pb-10 md:pb-4 pr-1 scrollbar-thin scrollbar-thumb-emerald-500/10"
        style={{
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
      <AnimatePresence mode="popLayout">
        {messages.map((msg, idx) => {
          const isLawyer = msg.agentRole === "LAWYER";
          const isAuditor = msg.agentRole === "AUDITOR";
          const isVerdict = msg.agentRole === "VERDICT";
          const isSystem = msg.agentRole === "SYSTEM"; // New role support
          const isExpanded = expandedReasoning[msg._id];

          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={cn(
                "flex gap-3 md:gap-4 group px-2 md:px-4",
                isAuditor && "flex-row-reverse"
              )}
            >
              {/* Icon Wrapper with Visual Safe Zone */}
              <div className="flex-shrink-0 flex items-center justify-center p-1 md:p-2">
                <Avatar className={cn(
                    "border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl", 
                    isLawyer && "border-blue-500/50 bg-blue-950/60 shadow-blue-500/20 w-10 h-10 md:w-12 md:h-12",
                    isAuditor && "border-red-500/50 bg-red-950/60 shadow-red-500/20 w-10 h-10 md:w-12 md:h-12",
                    (isVerdict || isSystem) && "border-emerald-500/50 bg-emerald-950/60 shadow-emerald-500/30 w-14 h-14 md:w-16 md:h-16"
                )}>
                  <AvatarFallback className="text-[10px] font-black font-mono">
                    {isLawyer && <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
                    {isAuditor && <ListTree className="w-5 h-5 md:w-6 md:h-6 text-red-400" />}
                    {isVerdict && <Scale className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />}
                    {isSystem && <Cpu className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />}
                  </AvatarFallback>
                </Avatar>
              </div>


              <div className={cn("flex-1 min-w-0 space-y-2", isVerdict && "w-full")}>
                  <Card className={cn(
                      "p-4 md:p-5 backdrop-blur-3xl transition-all duration-500 relative overflow-hidden",
                      isLawyer && "bg-blue-500/5 border-blue-500/20 rounded-tl-none hover:bg-blue-500/10",
                      isAuditor && "bg-red-500/5 border-red-500/20 rounded-tr-none hover:bg-red-500/10 text-right",
                      isVerdict && "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-xl"
                  )}>
                    {/* Header: Identity */}
                    <div className={cn("flex items-center justify-between mb-3", isAuditor && "flex-row-reverse")}>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[8px] md:text-[9px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase",
                                isLawyer && "text-blue-400/60",
                                isAuditor && "text-red-400/60",
                                (isVerdict || isSystem) && "text-emerald-400/60"
                            )}>
                                {isLawyer ? "INVESTIGATOR_ALPHA" : isAuditor ? "FORENSIC_AUDITOR" : isSystem ? "CORE_ORCHESTRATOR" : "MASTER_ADJUDICATOR"}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-white tracking-tight">{msg.agentName}</span>
                        </div>
                        {(msg.confidenceScore || isSystem) && (
                            <div className="text-[9px] md:text-[10px] font-mono text-white/30 flex items-center gap-1 md:gap-2">
                                <Zap className={cn("w-2.5 h-2.5 md:w-3 md:h-3", (isVerdict || isSystem) ? "text-emerald-500" : "text-current")} />
                                {isSystem ? "MAX_SYNC" : `${msg.confidenceScore}%`}
                            </div>
                        )}

                    </div>

                    {/* Content Body */}
                    <p className={cn(
                        "text-[12px] md:text-sm leading-relaxed tracking-tight mb-4 break-words hyphens-auto",
                        isVerdict ? "text-white font-medium" : "text-white/80"
                    )}>
                      {msg.content}
                    </p>
                    
                    {/* HCS Link */}
                    {msg.txHash && (
                        <div className={cn("pt-3 border-t border-white/5", isAuditor && "flex justify-end")}>
                            <HCSBadge txHash={msg.txHash} />
                        </div>
                    )}

                    {/* Chain of Thought Toggle */}
                    {msg.reasoning && (
                        <div className="mt-4">
                            <button 
                                onClick={() => toggleReasoning(msg._id)}
                                className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-mono font-black text-white/20 hover:text-white/40 uppercase tracking-widest transition-colors mb-2 ml-auto lg:ml-0"
                            >
                                <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                                Chain_of_Thought
                            </button>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-3 md:p-4 bg-black/40 rounded-xl border border-white/5 text-[10px] md:text-[11px] font-mono text-white/50 leading-relaxed italic break-words">
                                            {msg.reasoning}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                  </Card>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      </div>
    </div>
  );
}
