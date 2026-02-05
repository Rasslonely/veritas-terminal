"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UnderwriterPools } from "@/components/defi/UnderwriterPools";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DeFiPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Earn Yield</h1>
            <p className="text-muted-foreground">
                Participate in the Veritas ecosystem by staking capital to secure truth.
            </p>
        </div>

        <Tabs defaultValue="pools" className="space-y-4">
            <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
                <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
                <TabsTrigger value="analytics">Risk Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="pools" className="space-y-4">
                <UnderwriterPools />
            </TabsContent>

            <TabsContent value="portfolio">
                <GlassCard className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Connect Wallet to view portfolio.
                </GlassCard>
            </TabsContent>
            
            <TabsContent value="analytics">
                <GlassCard className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Advanced analytics coming in Phase 4.
                </GlassCard>
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
