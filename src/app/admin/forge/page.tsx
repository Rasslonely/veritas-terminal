"use client";

import { PolicyForge } from "@/components/admin/PolicyForge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminForgePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        
        {/* Admin Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link 
                    href="/"
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white glow flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-indigo-500" />
                        Policy Forge <span className="text-zinc-600 font-mono text-sm tracking-widest mt-2 ml-2">v3.0_GENESIS</span>
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Architect autonomous agent behaviors via visual logic bricks.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Compiler_Status</span>
                    <span className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       Ready_For_Uplink
                    </span>
                </div>
            </div>
        </div>

        {/* The Forge Area */}
        <div className="rounded-[3rem] bg-zinc-950 border border-white/5 shadow-2xl overflow-hidden min-h-[85vh]">
             <PolicyForge />
        </div>

        {/* Footer info */}
        <div className="text-center opacity-20 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-mono tracking-[0.4em] text-white">
                VERITAS_PROTOCOL // ERC-8004_COMPLIANT // NEUROBLOX_MODULE_ACTIVE
            </p>
        </div>

      </div>
    </DashboardLayout>
  );
}
