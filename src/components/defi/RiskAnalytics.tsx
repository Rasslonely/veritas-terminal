"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldAlert, Activity, Lock, Search } from "lucide-react";

const DATA = [
  { day: "Day 1", risk: 12, solvency: 200 },
  { day: "Day 2", risk: 15, solvency: 198 },
  { day: "Day 3", risk: 18, solvency: 210 },
  { day: "Day 4", risk: 8, solvency: 240 },
  { day: "Day 5", risk: 10, solvency: 245 },
  { day: "Day 6", risk: 11, solvency: 255 },
  { day: "Day 7", risk: 9, solvency: 260 },
];

export function RiskAnalytics() {
  return (
    <div className="space-y-6">
        {/* HERO METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-4 flex flex-col gap-1 border-emerald-500/30">
                <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-mono">Protocol Health</span>
                <span className="text-2xl font-bold text-white">98.9%</span>
                <span className="text-xs text-white/50">Optimal Range</span>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col gap-1 border-white/10">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Reserve Ratio</span>
                <span className="text-2xl font-bold text-white">245%</span>
                <span className="text-xs text-emerald-400">Over-Collateralized</span>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col gap-1 border-white/10">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Active Claims</span>
                <span className="text-2xl font-bold text-white">12</span>
                <span className="text-xs text-yellow-500">Moderate Load</span>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col gap-1 border-white/10">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Loss Ratio</span>
                <span className="text-2xl font-bold text-white">4.2%</span>
                <span className="text-xs text-emerald-400">Profitable</span>
            </GlassCard>
        </div>

        {/* CHART */}
        <GlassCard className="p-6 h-[300px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white/90 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" /> Solvency vs Risk Simulation
                </h3>
                <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> Solvency Index</span>
                    <span className="flex items-center gap-1 text-red-400"><div className="w-2 h-2 bg-red-400 rounded-full" /> Risk Event Prob</span>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={DATA}>
                    <defs>
                        <linearGradient id="colorSolvency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="day" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: "#000", border: "1px solid #333", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="solvency" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSolvency)" />
                    <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
                </AreaChart>
            </ResponsiveContainer>
        </GlassCard>

        {/* AI AUDIT LOG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <GlassCard className="p-4 border-l-2 border-l-emerald-500">
                <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm text-white">Smart Contract Audit</h4>
                        <p className="text-xs text-white/60 mt-1">
                            Daily automated verification of vault contents on Base L2 matches off-chain indexers. Delta: 0.0000%.
                        </p>
                        <div className="mt-2 text-[10px] font-mono text-emerald-400">VERIFIED 2 MINS AGO</div>
                    </div>
                </div>
             </GlassCard>
             <GlassCard className="p-4 border-l-2 border-l-blue-500">
                <div className="flex gap-3">
                    <Search className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm text-white">Fraud Pattern Scan</h4>
                        <p className="text-xs text-white/60 mt-1">
                            Heuristic scan across 12 active claims detected 0 anomalies resembling centralized coordinate attacks.
                        </p>
                        <div className="mt-2 text-[10px] font-mono text-blue-400">SCAN COMPLETED</div>
                    </div>
                </div>
             </GlassCard>
        </div>
    </div>
  );
}
