"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimsList } from "@/components/claim/ClaimsList";
import { Shield, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClaimsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Shield className="w-6 h-6 text-emerald-500" />
                    Claims History
                </h1>
                <p className="text-sm text-muted-foreground">
                    Secure Ledger of Adjudicated Events
                </p>
            </div>
            
            <Link href="/scan">
                <Button size="sm" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                    <Plus className="w-4 h-4 mr-1" />
                    New
                </Button>
            </Link>
        </div>

        {/* Claims List */}
        <div className="min-h-[50vh]">
            <ClaimsList />
        </div>
      </div>
    </DashboardLayout>
  );
}
