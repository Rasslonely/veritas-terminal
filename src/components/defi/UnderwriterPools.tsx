"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Car, Smartphone, Tornado, DollarSign, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

export function UnderwriterPools() {
  const pools = useQuery(api.underwriters.getPools);
  const seedPools = useMutation(api.underwriters.seedPools);
  const stakeFunds = useMutation(api.underwriters.stakeFunds);
  
  // Mock User ID (In real app, useAuth)
  const user = useQuery(api.users.getUser, { walletAddress: "0x0000000000000000000000000000000000000000" });

  useEffect(() => {
    // Auto-seed if empty
    if (pools && pools.length === 0) {
        seedPools({});
    }
  }, [pools, seedPools]);

  const handleStake = async (poolId: Id<"underwriterPools">) => {
    if (!user) return;
    await stakeFunds({
        poolId,
        amount: 1000,
        userId: user._id
    });
    alert("Staked 1,000 USDC successfully!");
  };

  if (!pools) return <div className="text-center animate-pulse text-emerald-500">Loading Liquidity Pools...</div>;

  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
        case "smartphone": return <Smartphone className="w-5 h-5 text-purple-400" />;
        case "car": return <Car className="w-5 h-5 text-blue-400" />;
        case "tornado": return <Tornado className="w-5 h-5 text-red-400" />;
        default: return <Shield className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Underwriter Pools
            </h2>
            <p className="text-sm text-muted-foreground">
                Stake USDC to back claims and earn premiums.
            </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-mono font-bold text-emerald-400">APY up to 45%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pools.map((pool, idx) => (
          <motion.div
            key={pool._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-0 border-white/10 overflow-hidden relative group">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            {getIcon(pool.icon)}
                        </div>
                        <Badge variant="outline" className={
                            pool.riskLevel === "LOW" ? "border-emerald-500/50 text-emerald-400" :
                            pool.riskLevel === "MEDIUM" ? "border-amber-500/50 text-amber-400" :
                            "border-red-500/50 text-red-400"
                        }>
                            {pool.riskLevel} RISK
                        </Badge>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-white/90">{pool.name}</h3>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-mono font-bold text-emerald-400">{pool.apy}%</span>
                            <span className="text-xs text-muted-foreground">APY</span>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">TVL</span>
                            <span className="font-mono text-white">${pool.totalStaked.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Claims Paid</span>
                            <span className="font-mono text-white">${pool.totalClaims.toLocaleString()}</span>
                        </div>
                    </div>

                    <Button 
                        className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        onClick={() => handleStake(pool._id)}
                    >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Stake 1000 USDC
                    </Button>
                </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
