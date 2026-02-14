"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, DollarSign } from "lucide-react";
import { useAccount } from "wagmi";

export function MyPortfolio() {
  const { address } = useAccount();
  
  // In a real app, query by wallet address
  // For demo, we might fall back to the guest user or mock data if address exists
  const user = useQuery(api.users.getUser, { walletAddress: address || "0x0000000000000000000000000000000000000000" });
  
  // Mock Data for "God Tier" visual even if DB is empty
  const data = [
    { name: "Gadget Pool", value: 4000, color: "#10b981" },
    { name: "Vehicle Pool", value: 3000, color: "#3b82f6" },
    { name: "Disaster Pool", value: 1500, color: "#ef4444" },
  ];

  const totalStaked = data.reduce((acc, curr) => acc + curr.value, 0);
  const totalEarnings = 842.50; // Mock earnings

  if (!address) return <div>Wallet Disconnected</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT: Stats & Chart */}
      <GlassCard className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white/90">Asset Allocation</h3>
            <Wallet className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-muted-foreground">Total Staked</span>
                <span className="text-2xl font-bold text-white">${totalStaked.toLocaleString()}</span>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.map((item) => (
                <div key={item.name} className="flex flex-col items-center p-2 rounded bg-white/5">
                    <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-muted-foreground text-center line-clamp-1">{item.name}</span>
                    <span className="text-xs font-bold">${item.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
      </GlassCard>

      {/* RIGHT: Earnings & History */}
      <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col justify-between h-[140px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
               <div className="relative z-10">
                   <span className="text-sm text-emerald-400 font-mono uppercase tracking-widest">Unclaimed Yield</span>
                   <div className="flex items-end gap-2 mt-2">
                       <h2 className="text-4xl font-bold text-white">${totalEarnings}</h2>
                       <span className="mb-1 text-emerald-500 text-sm font-bold flex items-center">
                           <TrendingUp className="w-4 h-4 mr-1" /> +12.4%
                       </span>
                   </div>
               </div>
               <div className="relative z-10 pt-4">
                   <button className="text-xs font-bold text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-full border border-emerald-500/50 transition-colors">
                       CLAIM REWARDS
                   </button>
               </div>
          </GlassCard>

          <GlassCard className="p-6 flex-1">
               <h3 className="font-bold text-sm text-white/80 mb-4">Recent Activity</h3>
               <div className="space-y-3">
                   {[1,2,3].map((_, i) => (
                       <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0">
                           <div className="flex items-center gap-2">
                               <div className="p-1.5 rounded-full bg-blue-500/20 text-blue-400">
                                   <DollarSign className="w-3 h-3" />
                               </div>
                               <div className="flex flex-col">
                                   <span className="text-white">Staked into Vehicle Pool</span>
                                   <span className="text-white/40">{i * 2 + 1} hours ago</span>
                               </div>
                           </div>
                           <span className="font-mono text-emerald-400">+ $500.00</span>
                       </div>
                   ))}
               </div>
          </GlassCard>
      </div>
    </div>
  );
}
