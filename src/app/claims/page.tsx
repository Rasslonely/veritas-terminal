"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimsList } from "@/components/claim/ClaimsList";
import { Archive, Plus, Database } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClaimsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                    <Archive className="w-6 h-6 text-emerald-500" />
                    Global_Archives
                </h1>
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1"><Database className="w-3 h-3 text-emerald-500" /> Total_Records: 1,248</span>
                    <span className="flex items-center gap-1">• System_Liveness: 99.8%</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="h-8 px-3 rounded-md border border-white/5 bg-white/5 flex items-center gap-2 text-[10px] font-mono text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE_HCS_SYNC
                </div>
                <Link href="/scan">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Button size="sm" className="relative bg-emerald-500 text-black hover:bg-emerald-400 font-black tracking-widest uppercase text-[10px] border-b-4 border-emerald-700 hover:border-emerald-500 active:border-b-0 active:translate-y-1 transition-all h-9 px-6 shadow-xl">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-[size:8px_8px] opacity-20" />
                            <Plus className="w-3 h-3 mr-2" />
                            INITIATE_SCAN
                        </Button>
                    </div>
                </Link>
            </div>
        </div>

        {/* Forensic Ledger List */}
        <div className="min-h-[60vh]">
            <ClaimsList variant="ledger" />
        </div>
      </div>
    </DashboardLayout>
  );
}
