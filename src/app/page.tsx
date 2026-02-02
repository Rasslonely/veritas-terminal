"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomConnectButton } from "@/components/auth/CustomConnectButton";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Zap, Gavel } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center pt-10 text-center space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full ring-1 ring-primary/30 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            VERITAS<br />TERMINAL
          </h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
            Autonomous AI Adjudicator for Physical World Assets
          </p>
        </div>

        {/* Action */}
        <div className="w-full max-w-xs space-y-4">
          <CustomConnectButton />
          <p className="text-xs text-muted-foreground">
            Connect wallet to access the neural link.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-8">
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-xs font-medium">Instant Settle</span>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm flex flex-col items-center gap-2">
            <Gavel className="w-6 h-6 text-purple-400" />
            <span className="text-xs font-medium">AI Jury</span>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
