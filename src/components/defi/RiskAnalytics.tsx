"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { ShieldAlert, Activity, Lock, Search, TrendingUp, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

// Mock Data for the graph
const POINTS = [
  { x: 0, y: 30, y2: 80 },
  { x: 10, y: 45, y2: 75 },
  { x: 20, y: 35, y2: 70 },
  { x: 30, y: 60, y2: 65 },
  { x: 40, y: 55, y2: 60 },
  { x: 50, y: 75, y2: 50 },
  { x: 60, y: 65, y2: 55 },
  { x: 70, y: 85, y2: 45 },
  { x: 80, y: 80, y2: 40 },
  { x: 90, y: 95, y2: 30 },
  { x: 100, y: 90, y2: 35 },
];

// Helper to create smooth bezier curves
const getSmoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return "";

  const first = points[0];
  let path = `M ${first.x} ${first.y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    
    // Control points for smooth curve (simplified)
    const controlX1 = current.x + (next.x - current.x) * 0.4;
    const controlY1 = current.y;
    const controlX2 = next.x - (next.x - current.x) * 0.4;
    const controlY2 = next.y;

    path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
  }
  return path;
};

export function RiskAnalytics() {
  
  // Create SMOOTH SVG path strings
  const solvencyPath = useMemo(() => {
    // Flip Y for SVG coords (0 is top)
    const mappedPoints = POINTS.map(p => ({ x: p.x, y: 100 - p.y }));
    return getSmoothPath(mappedPoints);
  }, []);

  const riskPath = useMemo(() => {
    const mappedPoints = POINTS.map(p => ({ x: p.x, y: 100 - p.y2 }));
    return getSmoothPath(mappedPoints);
  }, []);

  return (
    <div className="space-y-6">
        {/* HERO METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-5 flex flex-col justify-between border-emerald-500/30 bg-emerald-500/5">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono">Protocol Health</span>
                    <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-white block">98.9%</span>
                    <span className="text-xs text-white/50 mt-1 block">Optimal Range</span>
                </div>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between border-white/10">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Reserve Ratio</span>
                    <Lock className="w-4 h-4 text-white/30" />
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-white block">245%</span>
                    <span className="text-xs text-emerald-400 mt-1 block">Over-Collateralized</span>
                </div>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between border-white/10">
                <div className="flex justify-between items-start">
                     <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Active Claims</span>
                     <Search className="w-4 h-4 text-white/30" />
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-white block">12</span>
                    <span className="text-xs text-yellow-500 mt-1 block">Moderate Load</span>
                </div>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between border-white/10">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Loss Ratio</span>
                    <TrendingUp className="w-4 h-4 text-white/30" />
                </div>
                <div className="mt-4">
                    <span className="text-3xl font-bold text-white block">4.2%</span>
                    <span className="text-xs text-emerald-400 mt-1 block">Profitable</span>
                </div>
            </GlassCard>
        </div>

        {/* CUSTOM FRAMER CHART */}
        <GlassCard className="p-6 h-[320px] relative overflow-hidden group border-white/5 bg-black/40">
             {/* Header */}
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-bold text-lg text-white/90 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" /> 
                    Solvency vs Risk Simulation
                </h3>
                <div className="flex gap-6 text-xs font-mono">
                    <span className="flex items-center gap-2 text-emerald-400">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> 
                        Solvency Index
                    </span>
                    <span className="flex items-center gap-2 text-red-500">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> 
                        Risk Event Prob
                    </span>
                </div>
            </div>
            
            {/* Simple Visible Chart */}
            <div className="relative w-full h-[220px] mt-4">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-white/20 font-mono pointer-events-none z-20">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[9px] text-white/20 font-mono pointer-events-none z-20">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>LIVE</span>
                </div>

                {/* Graph Area */}
                <div className="absolute left-8 right-0 top-0 bottom-6">
                    <svg
                        viewBox="0 0 100 100"
                        width="100%"
                        height="100%"
                        preserveAspectRatio="none"
                        className="overflow-visible"
                    >
                        {/* Technical Grid Lines */}
                        {[0, 25, 50, 75, 100].map(y => (
                            <line 
                                key={y} 
                                x1="0" 
                                y1={y} 
                                x2="100" 
                                y2={y} 
                                stroke="white" 
                                strokeOpacity="0.05" 
                                strokeWidth="0.5" 
                            />
                        ))}
                         {[20, 40, 60, 80].map(x => ( // Vertical Lines
                            <line 
                                key={x} 
                                x1={x}
                                y1="0" 
                                x2={x} 
                                y2="100" 
                                stroke="white" 
                                strokeOpacity="0.03" 
                                strokeWidth="0.5" 
                            />
                        ))}

                        <defs>
                            <linearGradient id="solvencyFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="scannerGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity={0} />
                                <stop offset="50%" stopColor="white" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="white" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* Risk AREA */}
                        <motion.path
                            d={`${riskPath} L 100 100 L 0 100 Z`}
                            fill="url(#riskFill)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        />
                        
                        {/* Risk LINE (Trading Style: Thin & Sharp) */}
                        <motion.path
                            d={riskPath}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            style={{ filter: "drop-shadow(0 0 2px rgba(239,68,68,0.5))" }}
                        />
                        
                        {/* Solvency AREA */}
                        <motion.path
                            d={`${solvencyPath} L 100 100 L 0 100 Z`}
                            fill="url(#solvencyFill)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />

                        {/* Solvency LINE (Trading Style: Thin & Sharp) */}
                        <motion.path
                            d={solvencyPath}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            style={{ filter: "drop-shadow(0 0 2px rgba(16,185,129,0.5))" }}
                        />

                        {/* Live Price Dot (Solvency) */}
                        <motion.circle
                            cx="100"
                            cy="10" 
                            r="4"
                            fill="#10b981"
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: 2, duration: 2, repeat: Infinity }}
                        />
                         <motion.circle
                            cx="100"
                            cy="10"
                            r="4"
                            stroke="#10b981"
                            strokeWidth="2"
                            fill="none"
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: 4, opacity: 0 }}
                            transition={{ delay: 2.2, duration: 1.5, repeat: Infinity }}
                        />

                        {/* Pulsing End Point (Risk) */}
                         <motion.circle
                            cx="100"
                            cy="35" // Oops, should be different y. Risk end is 35 too? Let's check POINTS. Last point for risk (y2) is 35. Correct.
                            r="4"
                            fill="#ef4444"
                            initial={{ scale: 0 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
                        />


                        {/* Scanning Line Effect */}
                        <motion.line
                            x1="0" y1="0" x2="0" y2="100"
                            stroke="white"
                            strokeOpacity="0.2"
                            strokeWidth="1"
                            initial={{ x1: "0%", x2: "0%" }}
                            animate={{ x1: ["0%", "100%", "0%"], x2: ["0%", "100%", "0%"] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />

                    </svg>

                     {/* Floating Badge for Current Value */}
                     <motion.div 
                        className="absolute right-0 -top-8 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.5 }}
                     >
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        LIVE: 98.9%
                     </motion.div>
                </div>
            </div>
        </GlassCard>

        {/* AI AUDIT LOG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <GlassCard className="p-5 border-l-4 border-l-emerald-500 bg-emerald-500/5">
                <div className="flex gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg h-fit">
                        <Lock className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-white">Smart Contract Audit</h4>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                            Daily automated verification of vault contents on Base L2 matches off-chain indexers. Delta: <span className="text-emerald-400 font-mono">0.0000%</span>.
                        </p>
                        <div className="mt-3 text-[10px] uppercase font-mono text-emerald-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            VERIFIED 2 MINS AGO
                        </div>
                    </div>
                </div>
             </GlassCard>
             
             <GlassCard className="p-5 border-l-4 border-l-blue-500 bg-blue-500/5">
                <div className="flex gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                        <ShieldAlert className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-white">Fraud Pattern Scan</h4>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                            Heuristic scan across 12 active claims detected 0 anomalies resembling centralized coordinate attacks.
                        </p>
                        <div className="mt-3 text-[10px] uppercase font-mono text-blue-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            SCAN COMPLETED
                        </div>
                    </div>
                </div>
             </GlassCard>
        </div>
    </div>
  );
}
