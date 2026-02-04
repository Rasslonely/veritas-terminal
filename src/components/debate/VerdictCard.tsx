"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVeritasVault } from "@/hooks/useVeritasVault";
import { CheckCircle2, AlertTriangle, Loader2, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const [hasClaimed, setHasClaimed] = useState(false);

  const handleClaim = () => {
    if (hasClaimed || isConfirmed) return;
    payoutClaim(recipientAddress, claimId);
  };

  const isHighConfidence = confidenceScore >= 85;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-6"
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
            
            <h2 className="text-3xl font-black text-white tracking-tighter">
              {isHighConfidence ? "VERDICT: PA YOUT" : "ESCALATED"}
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
                onClick={handleClaim}
                disabled={isConfirming || isProcessing || isConfirmed}
                className={cn(
                  "w-full h-12 text-sm font-bold tracking-widest uppercase transition-all duration-300",
                  isConfirmed 
                    ? "bg-emerald-600/80 hover:bg-emerald-600/80 text-white border-emerald-500/50"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                )}
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 animate-bounce" /> Confirm in Wallet...
                  </span>
                ) : isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Chain...
                  </span>
                ) : isConfirmed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Payout Sent
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-black" /> Instant Claim
                  </span>
                )}
              </Button>

              {hash && (
                <a 
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[10px] text-emerald-500/50 hover:text-emerald-400 hover:underline transition-colors pt-2"
                >
                  View Transaction on BaseScan ↗
                </a>
              )}
            </div>
          )}
        </div>
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
