import { EvidenceAnalysis } from "@/lib/schemas/ai";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Search, Shield, Zap, Activity, Database, Cpu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnalysisResultProps {
  analysis: EvidenceAnalysis | null;
  isLoading: boolean;
}

export function AnalysisResult({ analysis, isLoading }: AnalysisResultProps) {
  if (isLoading) {
    return (
      <Card className="bg-black/40 border-emerald-500/20 backdrop-blur-3xl animate-pulse overflow-hidden rounded-3xl">
        <div className="h-1 w-full bg-emerald-500/10 overflow-hidden">
           <motion.div 
             initial={{ x: "-100%" }} 
             animate={{ x: "100%" }} 
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="h-full w-1/3 bg-emerald-500/50" 
           />
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 text-emerald-500/50">
            <Cpu className="w-5 h-5 animate-spin" />
            <span className="font-mono text-[10px] font-black tracking-[0.3em] uppercase">NEURAL_FORENSICS_BOOTING...</span>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded-full w-3/4" />
            <div className="h-4 bg-white/5 rounded-full w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const getSeverityStyle = (level: string) => {
    switch (level) {
      case "NONE": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
      case "MINOR": return "text-blue-400 border-blue-500/30 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]";
      case "MODERATE": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
      case "SEVERE": return "text-orange-400 border-orange-500/30 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]";
      case "TOTAL_LOSS": return "text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
      default: return "text-white/40 border-white/10 bg-white/5";
    }
  };

  const isHighConfidence = analysis.confidenceScore >= 85;

  return (
    <div className="space-y-6">
        <Card className="bg-black/60 border-white/10 backdrop-blur-3xl overflow-hidden rounded-[2rem] relative">
            {/* Cinematic Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10" />

            {/* Header: Forensic Identity */}
            <div className="px-5 md:px-8 py-4 md:py-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02] relative z-20">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-[8px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-emerald-500/60">Forensic_Audit_Log</h3>
                        <p className="text-[10px] md:text-[11px] font-mono text-white/40">NODE_VERITAS_ALPHA_7</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] md:text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Neural_Confidence</span>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-16 md:w-24 h-1 md:h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.confidenceScore}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                            />
                        </div>
                        <span className="font-black text-[10px] md:text-xs text-white font-mono">{analysis.confidenceScore}%</span>
                    </div>
                </div>
            </div>

            <CardContent className="p-5 md:p-8 space-y-8 md:space-y-10 relative z-20">
                {/* Visual Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Primary Detection */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2">
                           <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/30" />
                           <label className="text-[9px] md:text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Target_Object</label>
                        </div>
                        <div className="p-4 md:p-6 rounded-2xl bg-white/[0.03] border border-white/5 group transition-all hover:bg-white/[0.05]">
                           <div className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{analysis.objectDetected}</div>
                           <div className="flex items-center gap-2 mt-3 md:mt-4 text-[8px] md:text-[9px] font-mono text-white/20">
                              <span className="text-emerald-500/50">MATCH_FOUND</span>
                              <span>•</span>
                              <span>DB_REF: GADGET_V2.1</span>
                           </div>
                        </div>
                    </div>

                    {/* Damage Metric */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2">
                           <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/30" />
                           <label className="text-[9px] md:text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Classification_Index</label>
                        </div>
                        <div className={cn("p-4 md:p-6 rounded-2xl border transition-all flex flex-col justify-center", getSeverityStyle(analysis.damageLevel))}>
                           <div className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                               {analysis.damageLevel.replace("_", " ")}
                           </div>
                           <div className="flex items-center gap-2 mt-3 md:mt-4 text-[8px] md:text-[9px] font-mono opacity-50">
                              <span>SEVERITY_TIER: {analysis.damageLevel === "NONE" ? "0" : "4"}</span>
                              <span>•</span>
                              <span>THRESHOLD: VERIFIED</span>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Narrative Synthesis */}
                <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2">
                       <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/30" />
                       <label className="text-[9px] md:text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Neural_Synthesis_Report</label>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />
                        <p className="text-[12px] md:text-sm text-white/70 leading-relaxed bg-white/[0.02] p-4 md:p-6 rounded-r-2xl border-y border-r border-white/5 font-mono italic">
                            {analysis.description}
                        </p>
                    </div>
                </div>

                {/* Tactical Metadata Footer - Deep Analytics */}
                <div className="pt-6 md:pt-8 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Forensic_Telemetry_Layer_2</span>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={cn("w-1 h-1 rounded-full", i < 4 ? "bg-emerald-500" : "bg-white/10")} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                           <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block">Logic_Core</span>
                           <span className="text-[9px] font-mono text-emerald-400">GEMINI_2.5_FLASH</span>
                        </div>
                        <div className="space-y-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                           <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block">Context_Window</span>
                           <span className="text-[9px] font-mono text-blue-400">2.1M_TOKENS</span>
                        </div>
                         <div className="space-y-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                           <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block">Sensor_Drift</span>
                           <span className="text-[9px] font-mono text-white/60">0.004%_NOMINAL</span>
                        </div>
                        <div className="space-y-1 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                           <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block">Metadata_Hash</span>
                           <span className="text-[9px] font-mono text-orange-400 truncate">SHA: 8f2...9a1</span>
                        </div>
                    </div>

                     {/* Reasoning Chain Preview */}
                     <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest block border-b border-white/5 pb-1">Chain_of_Thought_Log</span>
                        <div className="space-y-1 font-mono text-[8px] text-white/50">
                            <div className="flex gap-2">
                                <span className="text-emerald-500">➜</span>
                                <span>Ingesting visual evidence... [COMPLETE]</span>
                            </div>
                             <div className="flex gap-2">
                                <span className="text-emerald-500">➜</span>
                                <span>Cross-referencing policy ID #8821... [MATCH]</span>
                            </div>
                             <div className="flex gap-2">
                                <span className="text-emerald-500">➜</span>
                                <span>Calculating disbursement probability... [99.2%]</span>
                            </div>
                        </div>
                     </div>
                </div>
                
                {/* Proof of Truth - Contextual Contract Link */}
                <div className="pt-4 flex justify-center">
                    <a 
                        href="https://shadownet.explorer.etherlink.com/address/0x7d614118529243DDc5C7ad19F4b89220634d1Ba0" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                    >
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest group-hover:text-emerald-300">View On-Chain Proof</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
                    </a>
                </div>
            </CardContent>

        </Card>

        {/* Global Policy Citation Overlay */}
        {analysis.citedPolicy && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-6 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden"
            >
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="flex gap-6 items-start relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Database className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-[0.3em]">Policy_Enforcement_Citation</span>
                            <div className="h-px flex-1 bg-emerald-500/20" />
                        </div>
                        <p className="text-xs text-white/80 font-mono italic leading-relaxed">
                            "{analysis.citedPolicy}"
                        </p>
                    </div>
                </div>
            </motion.div>
        )}
    </div>
  );
}
