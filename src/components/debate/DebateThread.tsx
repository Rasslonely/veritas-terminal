"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ShieldAlert, Scale } from "lucide-react";
import { HCSBadge } from "./HCSBadge";

export function DebateThread({ claimId }: { claimId: Id<"claims"> }) {
  // Use 'any' or check if we need to regenerate types if getDebateMessages isn't showing up yet
  // It should be there after codegen.
  const messages = useQuery(api.claims.getDebateMessages, { claimId });

  if (!messages) {
    return <div className="text-center text-muted-foreground animate-pulse">Establishing Uplink to Council...</div>;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pb-10">
      {messages.map((msg) => {
        const isLawyer = msg.agentRole === "LAWYER";
        const isAuditor = msg.agentRole === "AUDITOR";
        const isVerdict = msg.agentRole === "VERDICT";

        return (
          <div
            key={msg._id}
            className={cn(
              "flex gap-3",
              isAuditor && "flex-row-reverse"
            )}
          >
            <Avatar className={cn(
                "w-8 h-8 border", 
                isLawyer && "border-blue-500 bg-blue-950",
                isAuditor && "border-orange-500 bg-orange-950",
                isVerdict && "border-green-500 bg-green-950 w-12 h-12"
            )}>
              <AvatarFallback className="text-[10px]">
                {isLawyer && "Adv"}
                {isAuditor && "Aud"}
                {isVerdict && "VERITAS"}
              </AvatarFallback>
            </Avatar>

            <Card className={cn(
                "p-3 max-w-[80%]",
                isLawyer && "bg-blue-500/10 border-blue-500/30 rounded-tl-none",
                isAuditor && "bg-orange-500/10 border-orange-500/30 rounded-tr-none",
                isVerdict && "w-full bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-in fade-in zoom-in duration-500"
            )}>
              <div className="flex justify-between items-center mb-1">
                <span className={cn(
                    "text-[10px] uppercase font-bold tracking-widest",
                    isLawyer && "text-blue-400",
                    isAuditor && "text-orange-400",
                    isVerdict && "text-green-400"
                )}>
                  {msg.agentName}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-white/90">
                {msg.content}
              </p>
              
              {msg.txHash && <HCSBadge txHash={msg.txHash} />}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
