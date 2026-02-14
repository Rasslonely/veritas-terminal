"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVeritasVault } from "@/hooks/useVeritasVault";
import { CheckCircle2, AlertTriangle, Loader2, DollarSign, Wallet, Receipt, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptics } from "@/hooks/useHaptics";

interface VerdictCardProps {
  claimId: string;
  recipientAddress: string;
  confidenceScore: number;
  analyzedSeverity: string;
  payoutAmount: string;
}

export function VerdictCard({ 
  claimId, 
  recipientAddress, 
  confidenceScore, 
  analyzedSeverity,
  payoutAmount
}: VerdictCardProps) {
  
  const { payoutClaim, isConfirming, isProcessing, isConfirmed, hash } = useVeritasVault();
  const { triggerHaptic } = useHaptics();
  
  // For testing UI without blockchain interaction, you can uncomment this:
  // const isConfirmed = true; 
  // const hash = "0x712893...123";

  const isHighConfidence = confidenceScore >= 85;

  return (
    <div className="w-full max-w-md mx-auto mt-6 perspective-1000">
      <AnimatePresence mode="wait">
        {!isConfirmed ? (
           <motion.div
             key="verdict-card"
             initial={{ opacity: 0, rotateX: -15, scale: 0.9 }}
             animate={{ opacity: 1, rotateX: 0, scale: 1 }}
             exit={{ opacity: 0, rotateX: 15, scale: 0.95 }}
             transition={{ duration: 0.5 }}
           >
            <Card className={cn(
              "relative overflow-hidden border-2 p-6 backdrop-blur-xl bg-black/40",
              isHighConfidence ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-yellow-500/50"
            )}>
              {/* BACKGROUND GLOW */}
              <div className={cn(
                "absolute inset-0 opacity-20 pointer-events-none",
                isHighConfidence ? "bg-gradient-to-b from-emerald-500/0 via-emerald-500/10 to-emerald-500/20" : "bg-gradient-to-b from-yellow-500/0 via-yellow-500/10 to-yellow-500/20"
              )} />

              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                
                {/* HEADER STATUS */}
                <div className="space-y-2">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest",
                    isHighConfidence 
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                      : "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
                  )}>
                    {isHighConfidence ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{isHighConfidence ? "Claim Approved" : "Manual Review Required"}</span>
                  </div>
                  
                  <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-200 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    {isHighConfidence ? "VERDICT: PAYOUT" : "ESCALATED"}
                  </h2>
                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Severity</span>
                    <span className="text-lg font-bold text-white/90">{analyzedSeverity}</span>
                  </div>
                  <div className="flex flex-col p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Confidence</span>
                    <span className={cn(
                      "text-lg font-bold",
                      isHighConfidence ? "text-emerald-400" : "text-yellow-400"
                    )}>
                      {confidenceScore}%
                    </span>
                  </div>
                </div>

                {/* ACTION AREA */}
                {isHighConfidence && (
                  <div className="w-full space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs text-white/50 font-mono">ESTIMATED PAYOUT</span>
                      <span className="text-xl font-bold text-emerald-300 font-mono flex items-center">
                        <DollarSign className="w-4 h-4 mr-0.5" />
                        {payoutAmount}
                      </span>
                    </div>

                    <Button 
                      onClick={() => {
                        triggerHaptic("heavy");
                        payoutClaim(recipientAddress, claimId);
                      }}
                      disabled={isConfirming || isProcessing}
                      className={cn(
                        "w-full h-12 text-sm font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group",
                        "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                      )}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      
                      {isConfirming ? (
                        <span className="flex items-center gap-2 relative z-10">
                          <Wallet className="w-4 h-4 animate-bounce" /> Confirm in Wallet...
                        </span>
                      ) : isProcessing ? (
                        <span className="flex items-center gap-2 relative z-10">
                          <Loader2 className="w-4 h-4 animate-spin" /> Processing Chain...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 relative z-10">
                          <Zap className="w-4 h-4 fill-black" /> Instant Claim
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
           </motion.div>
        ) : (
           <ReceiptView 
              key="receipt-card"
              hash={hash || "0x..."} 
              amount={payoutAmount} 
              claimId={claimId}
            />
        )}
      </AnimatePresence>
    </div>
  );
}

import { useNetwork } from "@/context/NetworkContext";

function ReceiptView({ hash, amount, claimId }: { hash: string, amount: string, claimId: string }) {
    const { explorerUrl, chainName } = useNetwork();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            <Card className="relative overflow-hidden border-2 border-emerald-500/20 p-0 bg-black/90 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                 {/* Top Tear Line Visual */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_center,_transparent_4px,_#10b981_5px)] bg-[size:10px_10px] opacity-20" />

                 <div className="p-8 flex flex-col items-center text-center space-y-6 relative">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <CheckCircle2 className="w-64 h-64" />
                    </div>

                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-2 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-emerald-400 font-mono text-sm tracking-[0.2em] uppercase">Settlement Confirmed</h3>
                        <div className="flex items-baseline justify-center gap-1">
                             <span className="text-4xl font-bold text-white tracking-tighter">${amount}</span>
                             <span className="text-sm text-white/50 font-mono">USDC</span>
                        </div>
                    </div>

                    <div className="w-full space-y-4 pt-6 border-t border-dashed border-white/10">
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-white/40 uppercase tracking-widest">Claim ID</span>
                             <span className="font-mono text-white/80">{claimId.slice(-6).toUpperCase()}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-white/40 uppercase tracking-widest">Date</span>
                             <span className="font-mono text-white/80">{new Date().toLocaleDateString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs bg-white/5 p-2 rounded">
                             <span className="text-white/40 uppercase tracking-widest">TX Hash</span>
                             <div className="flex items-center gap-2">
                                <span className="font-mono text-emerald-500/80 truncate w-24">{hash.slice(0,6)}...{hash.slice(-4)}</span>
                                <Copy className="w-3 h-3 text-white/20 cursor-pointer hover:text-white" />
                             </div>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-white/40 uppercase tracking-widest">Network</span>
                             <span className="font-mono text-emerald-400 text-[10px] uppercase">{chainName}</span>
                         </div>
                    </div>

                    <Button 
                        variant="ghost" 
                        className="w-full text-xs text-white/30 hover:text-emerald-400 hover:bg-emerald-950/30 uppercase tracking-widest"
                        onClick={() => window.open(explorerUrl(hash, "tx"), '_blank')}
                    >
                        View on Block Explorer ↗
                    </Button>
                 </div>
                 
                 {/* Bottom Tear Line Visual */}
                 <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle_at_center,_transparent_4px,_#000_5px)] bg-[size:12px_12px] opacity-100 rotate-180" />
            </Card>
        </motion.div>
    );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

