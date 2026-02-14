"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UnderwriterPools } from "@/components/defi/UnderwriterPools";
import { MyPortfolio } from "@/components/defi/MyPortfolio";
import { RiskAnalytics } from "@/components/defi/RiskAnalytics";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function DeFiPage() {
  const { isConnected } = useAccount();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
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
                {isConnected ? (
                    <MyPortfolio />
                ) : (
                    <GlassCard className="h-[300px] flex flex-col gap-4 items-center justify-center text-muted-foreground">
                        <p>Connect Wallet to view your active positions.</p>
                        <ConnectButton />
                    </GlassCard>
                )}
            </TabsContent>
            
            <TabsContent value="analytics">
                <RiskAnalytics />
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
