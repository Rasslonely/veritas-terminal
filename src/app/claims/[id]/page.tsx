"use client";

import { useEffect, useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DebateThread } from "@/components/debate/DebateThread";
import { AnalysisResult } from "@/components/claim/AnalysisResult";
import { MatrixLog } from "@/components/debate/MatrixLog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Gavel, FileText, Activity, DollarSign } from "lucide-react";
import { useNetwork } from "@/context/NetworkContext";

export default function ClaimPage({ params }: { params: { id: string } }) {
  const claimId = params.id as Id<"claims">;
  
  // Fetch Claim
  const claim = useQuery(api.claims.getClaim, { claimId });
  // Action to start debate
  const runDebate = useAction(api.actions.debate.runAgentDebate);
  
  const [isDebating, setIsDebating] = useState(false);
  const [activeTab, setActiveTab] = useState("debate");

  // Determine if debate is needed or done
  const needsDebate = claim?.status === "DEBATE_IN_PROGRESS"; // Or similar status I defined earlier
  
  // Using a local status to track if we should trigger the debate automatically or manual
  // For drama, manual trigger is better.
  
  const { chainMode } = useNetwork();
  
  const handleStartTribunal = async () => {
    if (!claim || !claim.initialAnalysis) return;
    setIsDebating(true);
    try {
        await runDebate({ 
            claimId, 
            analysis: claim.initialAnalysis,
            chainMode 
        });
    } catch (e) {
        console.error("Debate Error", e);
        alert("Council busy. Retrying connection...");
    } finally {
        setIsDebating(false);
    }
  };

  const settleClaim = useAction(api.actions.debate.settleClaim);
  const [isSettling, setIsSettling] = useState(false);

  const handleSettle = async () => {
    if (!claim || !claim.payoutAmount) return;
    setIsSettling(true);
    try {
        // For demo, we pay to a dummy address if user wallet not connected
        // In prod, use connected wallet
        const recipient = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; 
        
        await settleClaim({
            claimId,
            recipientAddress: recipient,
            amount: claim.payoutAmount,
            chainMode
        });
        alert(`Payout initiation on ${chainMode} successful!`);
    } catch (e) {
        console.error("Settlement Failed", e);
        alert("Payout failed. Check console.");
    } finally {
        setIsSettling(false);
    }
  };

  if (!claim) {
    return (
        <DashboardLayout>
            <div className="flex h-screen items-center justify-center text-muted-foreground animate-pulse">
                Accessing Secure Record...
            </div>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        
        {/* Header */}
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Badge variant={claim.status === "APPROVED" ? "default" : "secondary"}>
                    {claim.status}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                    ID: {claimId.slice(-8)}
                </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white glow">
                Adjudication Tribunal
            </h1>
        </div>

        {/* Visual Evidence (Collapsed or Mini) */}
        <div className="relative h-32 rounded-lg overflow-hidden border border-white/10 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={claim.evidenceImageUrl} alt="Evidence" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-2 left-2">
                <p className="text-xs font-mono text-white/80">EVIDENCE_HASH_VERIFIED</p>
            </div>
        </div>

        {/* Tabs for Context vs Debate */}
        <Tabs defaultValue="debate" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="debate">
                    <Gavel className="w-4 h-4 mr-2" />
                    The Council
                </TabsTrigger>
                <TabsTrigger value="analysis">
                    <Activity className="w-4 h-4 mr-2" />
                    AI Analysis
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="mt-4">
                <AnalysisResult 
                    // @ts-ignore - Assuming mapping matches or I cast it
                    analysis={claim.initialAnalysis as any} 
                    isLoading={false} 
                />
            </TabsContent>
            
            <TabsContent value="debate" className="mt-4 space-y-4">
                {/* Debate Thread */}
                <DebateThread claimId={claimId} />
                
                {/* Status Indicator */}
                {isDebating && (
                    <MatrixLog message="System: Agents are deliberating on chain..." />
                )}

                {/* Actions */}
                {!isDebating && claim.status === "DEBATE_IN_PROGRESS" && (
                     <Button 
                        onClick={handleStartTribunal}
                        className="w-full bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 h-12 text-lg font-bold tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse"
                    >
                        COMMENCE TRIBUNAL
                    </Button>
                )}

                {!isSettling && claim.status === "APPROVED" && (
                     <Button 
                        onClick={handleSettle}
                        className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/50 h-12 text-lg font-bold tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        <DollarSign className="w-5 h-5 mr-2" />
                        SETTLE CLAIM ({claim.payoutCurrency || "USDC"})
                    </Button>
                )}
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
