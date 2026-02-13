import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CheckCircle2, 
    Circle, 
    Clock, 
    Loader2, 
    ShieldCheck, 
    Zap, 
    Gavel, 
    Database, 
    CreditCard,
    Cpu
} from "lucide-react";

export function LinearAdjudicationFeed({ claimId }: { claimId: Id<"claims"> }) {
  const messages = useQuery(api.claims.getDebateMessages, { claimId });
  const claim = useQuery(api.claims.getClaim, { claimId });

  if (!messages || !claim) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-mono text-emerald-500/50 uppercase tracking-widest">Bridging Nexus Gateway...</p>
      </div>
    );
  }

  const isApproved = claim.status === "APPROVED";
  const isSettled = claim.status === "SETTLED";
  const hasVerdict = messages.some(m => m.agentRole === "VERDICT");

  // Milestones Mapping
  const milestones = [
    { id: "LODGED", label: "Claim_Lodged", icon: ShieldCheck, status: "completed", desc: "Evidence hash recorded on HCS." },
    { id: "ANALYSIS", label: "Visual_Forensics", icon: Zap, status: "completed", desc: "Neural scan of imagery verified." },
    { id: "CONCLAVE", label: "Council_Conclave", icon: Gavel, status: hasVerdict ? "completed" : "active", desc: "Autonomous agents deliberating." },
    { id: "VERDICT", label: "Consensus_Live", icon: Cpu, status: hasVerdict ? "completed" : "pending", desc: "BFT-backed adjudication achieved." },
    { id: "SETTLEMENT", label: "Settlement_Uplink", icon: CreditCard, status: isSettled ? "completed" : (isApproved ? "active" : "pending"), desc: "Final disbursement finalized." },
  ];

  return (
    <div className="relative">
      <div 
        className="space-y-12 py-8 relative overflow-y-auto h-[calc(100svh-420px)] pb-10 scrollbar-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
      {/* Background Vertical Line with Animated Signal Pulse */}
      <div className="absolute left-[31px] top-12 bottom-12 w-[2px] bg-white/5 overflow-hidden">
         <motion.div 
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-1/4 bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent"
         />
      </div>

      {milestones.map((milestone, idx) => {
        const Icon = milestone.icon;
        const isActive = milestone.status === "active";
        const isCompleted = milestone.status === "completed";
        const isPending = milestone.status === "pending";

        return (
          <motion.div 
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-6 items-start group relative"
          >
            {/* Status Indicator (Tactical Node) */}
            <div className="relative z-10">
               <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 backdrop-blur-xl shadow-2xl overflow-hidden",
                  isActive ? "bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/20" :
                  isCompleted ? "bg-black/60 border-emerald-500/20" :
                  "bg-black/80 border-white/5 opacity-40 grayscale"
               )}>
                  {/* Internal Glow for Active Node */}
                  {isActive && (
                      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                  )}
                  
                  {isActive && (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border border-emerald-500/40 rounded-2xl" 
                      />
                  )}

                  <Icon className={cn(
                      "w-6 h-6 transition-colors duration-500",
                      isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" :
                      isCompleted ? "text-emerald-500/60" :
                      "text-white/20"
                  )} />
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 space-y-3 pt-1">
               <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] font-mono",
                        isActive ? "text-white" : isCompleted ? "text-white/60" : "text-white/20"
                    )}>
                       {milestone.id}_SEQ_{idx}
                    </h3>
                    {isActive && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                           <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[7px] font-mono text-emerald-400 uppercase tracking-widest">Live</span>
                        </div>
                    )}
                  </div>
                  <h2 className={cn(
                      "text-sm font-bold tracking-tight",
                      isActive ? "text-white" : isCompleted ? "text-white/80" : "text-white/20"
                  )}>
                      {milestone.label}
                  </h2>
               </div>
               
               <p className={cn(
                   "text-[11px] leading-relaxed italic",
                   isPending ? "text-white/5" : "text-white/40"
               )}>
                  "{milestone.desc}"
               </p>

               {/* Agent Logs Injection (For Conclave Step) */}
               {milestone.id === "CONCLAVE" && messages.length > 0 && (
                   <div className="mt-6 space-y-4 pl-4 border-l-2 border-emerald-500/10">
                       {messages.slice(-2).map((msg, i) => (
                           <div key={msg._id} className="space-y-1.5">
                               <div className="flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-emerald-500/40 shadow-[0_0_5px_#10b981]" />
                                  <span className="text-[9px] font-black font-mono text-emerald-400/60 uppercase tracking-widest">{msg.agentName.split(' ')[0]}</span>
                               </div>
                               <p className="text-[10px] text-white/40 line-clamp-3 leading-relaxed font-inter">
                                  {msg.content}
                               </p>
                           </div>
                       ))}
                   </div>
               )}
            </div>
          </motion.div>
        );
      })}

      {/* Forensic Final Footer */}
      {isSettled && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-3 shadow-3xl backdrop-blur-2xl"
          >
             <div className="text-[11px] font-black font-mono text-emerald-400 uppercase tracking-[0.4em] mb-1">
                TRANSACTION_FINALIZED
             </div>
             <p className="text-[9px] text-white/30 font-mono italic">Adjudication consensus reached. Payout signed by Verifier-7.</p>
             <div className="text-[8px] font-mono text-white/20 truncate bg-black/40 p-2 rounded-lg border border-white/5">
                LEDGER_REF: {claim.initialAnalysis.hcsLogId || "HEDERA_NODE_01"}
             </div>
          </motion.div>
      )}
      </div>
    </div>
  );
}
