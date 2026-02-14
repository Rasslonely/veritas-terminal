"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Play, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  Code,
  Save,
  Cpu,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAccount } from "wagmi";

type BlockType = "TRIGGER" | "RULE" | "THRESHOLD" | "AGENT";

interface LogicBlock {
  id: string;
  type: BlockType;
  label: string;
  value: string;
  color: string;
}

const AVAILABLE_BLOCKS: LogicBlock[] = [
  // TRIGGERS (When to run)
  { id: "t1", type: "TRIGGER", label: "On Physical Damage", value: "physical_damage", color: "bg-amber-500" },
  { id: "t2", type: "TRIGGER", label: "On Internal Failure", value: "internal_sensor", color: "bg-amber-500" },
  { id: "t3", type: "TRIGGER", label: "On Stolen Device", value: "stolen_device", color: "bg-amber-500" },
  { id: "t4", type: "TRIGGER", label: "On Flight Delay > 2h", value: "flight_delay", color: "bg-amber-500" },
  { id: "t5", type: "TRIGGER", label: "On IoT Water Leak", value: "iot_leak", color: "bg-amber-500" },
  { id: "t6", type: "TRIGGER", label: "On Crop Health < 40%", value: "crop_failure", color: "bg-amber-500" },

  // RULES (Hard checks)
  { id: "r1", type: "RULE", label: "Exclude Water Damage", value: "exclude_water", color: "bg-blue-500" },
  { id: "r2", type: "RULE", label: "Exclude Cosmetic Scratch", value: "exclude_cosmetic", color: "bg-blue-500" },
  { id: "r3", type: "RULE", label: "Require GPS Match", value: "require_gps", color: "bg-blue-500" },
  { id: "r4", type: "RULE", label: "Require Purchase Receipt", value: "require_receipt", color: "bg-blue-500" },
  { id: "r5", type: "RULE", label: "Require Police Report", value: "require_police_report", color: "bg-blue-500" },
  { id: "r6", type: "RULE", label: "Exclude Pre-existing", value: "exclude_preexisting", color: "bg-blue-500" },
  { id: "r7", type: "RULE", label: "Region: US Only", value: "region_us", color: "bg-blue-500" },
  { id: "r8", type: "RULE", label: "Device Age < 2 Years", value: "age_limit_2y", color: "bg-blue-500" },

  // THRESHOLDS (Financial Limits)
  { id: "h1", type: "THRESHOLD", label: "Max Payout $100", value: "limit_100", color: "bg-emerald-500" },
  { id: "h2", type: "THRESHOLD", label: "Max Payout $500", value: "limit_500", color: "bg-emerald-500" },
  { id: "h3", type: "THRESHOLD", label: "Instant Pay < $50", value: "instant_50", color: "bg-emerald-500" },
  { id: "h4", type: "THRESHOLD", label: "Deductible $50", value: "deductible_50", color: "bg-emerald-500" },
  { id: "h5", type: "THRESHOLD", label: "Deductible $200", value: "deductible_200", color: "bg-emerald-500" },
  { id: "h6", type: "THRESHOLD", label: "Apply Depreciation 15%", value: "depreciation_15", color: "bg-emerald-500" },
  { id: "h7", type: "THRESHOLD", label: "Surge Multiplier 2x", value: "surge_2x", color: "bg-emerald-500" },

  // AGENTS (The Personality)
  { id: "a1", type: "AGENT", label: "Aggressive Auditor", value: "aggressive", color: "bg-purple-500" },
  { id: "a2", type: "AGENT", label: "Leniant Judge", value: "leniant", color: "bg-purple-500" },
  { id: "a3", type: "AGENT", label: "Balanced Juror", value: "balanced", color: "bg-purple-500" },
  { id: "a4", type: "AGENT", label: "Skeptical Detective", value: "skeptical", color: "bg-purple-500" },
  { id: "a5", type: "AGENT", label: "Tech Specialist (Apple)", value: "specialist_tech", color: "bg-purple-500" },
  { id: "a6", type: "AGENT", label: "Jewelry Expert", value: "specialist_jewelry", color: "bg-purple-500" },
  { id: "a7", type: "AGENT", label: "Compliance Officer", value: "compliance", color: "bg-purple-500" },
];

export function PolicyForge() {
  const { address } = useAccount();
  const user = useQuery(api.users.getUser, address ? { walletAddress: address } : "skip");
  
  const [activeBlocks, setActiveBlocks] = useState<LogicBlock[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState<string | null>(null);
  const [uplinkStatus, setUplinkStatus] = useState<"IDLE" | "SIGNING" | "SUBMITTING" | "COMPLETE">("IDLE");

  const compileAction = useAction(api.agent.policy_compiler.compilePolicyBlueprint);

  const handleUplink = async () => {
    setUplinkStatus("SIGNING");
    // Simulate Wallet Signature
    setTimeout(() => {
        setUplinkStatus("SUBMITTING");
        // Simulate Blockchain Transaction
        setTimeout(() => {
            setUplinkStatus("COMPLETE");
        }, 2000);
    }, 1500);
  };

  const addBlock = (block: LogicBlock) => {
    // Generate a unique ID to ensure reordering stability
    const uniqueId = `${block.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setActiveBlocks([...activeBlocks, { ...block, id: uniqueId }]);
  };

  const removeBlock = (id: string) => {
    setActiveBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleCompile = async () => {
    if (activeBlocks.length === 0) return;
    
    // For demo, if no user found, use a hardcoded fallback ID or alert
    if (!user) {
        alert("Neural Link Required. Please connect your wallet.");
        return;
    }

    setIsCompiling(true);
    try {
      const result = await compileAction({
        name: "New Custom Policy",
        description: "Generated via Policy Forge",
        visualBlocksJson: JSON.stringify(activeBlocks),
        userId: user._id,
      });
      setCompiledResult(result.promptPreview);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Compilation Error");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-full mx-auto min-h-[800px]">
      
      {/* Toolbox (Restored Width) */}
      <div className="lg:col-span-3 space-y-6">
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Logic Toolbox
          </h2>
          
          <div className="space-y-2">
            {Object.entries(
              AVAILABLE_BLOCKS.reduce((acc, block) => {
                if (!acc[block.type]) acc[block.type] = [];
                acc[block.type].push(block);
                return acc;
              }, {} as Record<BlockType, LogicBlock[]>)
            ).map(([type, blocks]) => (
              <ToolboxGroup 
                key={type} 
                type={type as BlockType} 
                blocks={blocks} 
                onAdd={addBlock} 
              />
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl">
           <p className="text-[10px] text-indigo-300 leading-relaxed italic">
             "Architect the truth. Gemini 3 weaves ERC-8004 Service Definitions."
           </p>
        </div>
      </div>

      {/* Editor Surface (Optimized) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Added layoutScroll to Reorder.Group to help with scrolling inside container */}
        <div className="relative h-[650px] w-full rounded-[40px] border-2 border-dashed border-white/10 bg-black/40 p-6 flex flex-col items-center justify-start gap-4 overflow-y-auto custom-scrollbar scroll-smooth">
          
          <AnimatePresence>
            {activeBlocks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-4 pointer-events-none"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center">
                   <Plus className="w-8 h-8" />
                </div>
                <p className="text-sm font-mono tracking-tighter uppercase">Drop Logic Bricks Here</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Reorder.Group 
            axis="y" 
            values={activeBlocks} 
            onReorder={setActiveBlocks}
            className="w-full space-y-4"
          >
            {activeBlocks.map((block) => (
              <PolicyBlock 
                key={block.id} 
                block={block} 
                onRemove={removeBlock} 
              />
            ))}
          </Reorder.Group>

          {activeBlocks.length > 0 && (
             <div className="w-full pt-8 flex justify-center">
                <div className="w-1 h-12 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
             </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button 
            disabled={activeBlocks.length === 0 || isCompiling}
            onClick={handleCompile}
            className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest gap-2 shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all active:scale-95"
          >
            {isCompiling ? "COMPILING..." : <><Play className="w-5 h-5" /> COMPILE POLICY</>}
          </Button>
          <Button 
            variant="outline"
            className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
          >
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Compiler Output (Balanced) */}
      <div className="lg:col-span-4">
        <div className="p-6 rounded-3xl bg-black/60 border border-white/5 backdrop-blur-xl h-full flex flex-col min-h-[700px]">
           <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Code className="w-4 h-4" /> Agent System Prompt
          </h2>
          
          <div className="flex-1 font-mono text-xs leading-relaxed text-zinc-400 overflow-y-auto custom-scrollbar">
            {compiledResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-indigo-400 text-xs">// PROMPT_GENERATED_BY_GEMINI_2.5</div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 h-[400px] overflow-y-auto shadow-inner">
                    {compiledResult}
                </div>

                {/* TIMELOCK DEPLOYMENT SIMULATION */}
                <div className="pt-6 border-t border-white/10">
                    {uplinkStatus === "IDLE" && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-bold">READY FOR DEPLOYMENT</p>
                                    <p className="opacity-70">Policy validated. Ready for Timelock (24h).</p>
                                </div>
                            </div>
                            <Button 
                                onClick={handleUplink}
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm"
                            >
                                <Clock className="w-5 h-5" /> INITIATE TIMELOCK (24H)
                            </Button>
                        </div>
                    )}

                    {(uplinkStatus === "SIGNING" || uplinkStatus === "SUBMITTING") && (
                        <div className="space-y-6 animate-pulse py-8">
                            <div className="flex flex-col items-center justify-center gap-4 text-amber-400">
                                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                <div className="text-center">
                                    <p className="font-bold tracking-widest">
                                        {uplinkStatus === "SIGNING" ? "REQUESTING SIGNATURE..." : "BROADCASTING TO BASE SEPOLIA..."}
                                    </p>
                                    <p className="opacity-70 text-xs mt-1">Please confirm in your wallet.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {uplinkStatus === "COMPLETE" && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-3 opacity-20">
                                    <ShieldCheck className="w-32 h-32 text-emerald-500 rotate-12 translate-x-10 -translate-y-10" />
                                </div>
                                
                                <h3 className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                    Deployment Successful
                                </h3>

                                <div className="space-y-4 font-mono text-xs text-zinc-400 relative z-10">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="opacity-50">STATUS:</span>
                                        <span className="text-white font-bold">QUEUED (Timelock Active)</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="opacity-50">PROPOSAL ID:</span>
                                        <span className="text-white font-mono break-all text-[10px]">0x7f8a9...3a21</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                        <span className="text-amber-500/70">ETA LIVE:</span>
                                        <span className="text-amber-400 font-bold">24 Hours</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                                    <Button size="sm" variant="outline" className="flex-1 h-10 border-white/10 bg-black/40 hover:bg-white/5 hover:text-emerald-400/80 transition-colors">
                                        <ExternalLink className="w-3 h-3 mr-2" /> View on Etherscan
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
              </motion.div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                    <Code className="w-8 h-8" />
                </div>
                <div>
                    <p className="font-bold tracking-widest uppercase text-sm">Waiting for compilation...</p>
                    <p className="text-[10px] mt-1 max-w-[200px] mx-auto">Build your logic blocks on the left and click Compile to generate the Agent Persona.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// ------------------------------------------------------------
// Sub-Component: PolicyBlock (Smoother Full-Item Drag)
// ------------------------------------------------------------
function PolicyBlock({ block, onRemove }: { block: LogicBlock; onRemove: (id: string) => void }) {
  // Removed useDragControls to allow default "drag anywhere" behavior
  
  return (
    <Reorder.Item
      value={block}
      id={block.id}
      initial={{ scale: 0.9, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 50,
        boxShadow: "0px 20px 50px rgba(0,0,0,0.5)",
      }}
      className={`relative w-full p-4 pl-3 rounded-2xl border flex items-center justify-between shadow-xl ${block.color} bg-opacity-10 border-opacity-20 hover:border-opacity-40 transition-colors group cursor-grab active:cursor-grabbing touch-none pr-2`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0 pointer-events-none">
        
        {/* Icon Container */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm shrink-0 shadow-inner`}>
          {block.type === "TRIGGER" && <Zap className="w-5 h-5 text-amber-200" />}
          {block.type === "RULE" && <ShieldCheck className="w-5 h-5 text-blue-200" />}
          {block.type === "THRESHOLD" && <AlertCircle className="w-5 h-5 text-emerald-200" />}
          {block.type === "AGENT" && <Gavel className="w-5 h-5 text-purple-200" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="text-[9px] font-bold uppercase opacity-50 tracking-wider mb-0.5">{block.type}</div>
            <div className="text-sm font-bold text-white/90 truncate">{block.label}</div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-1 pl-4 shrink-0">
          
          {/* Remove Button - Must be interactive */}
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={(e) => {
                e.stopPropagation();
                onRemove(block.id);
            }}
            className="p-2 rounded-lg hover:bg-black/20 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-auto"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Grip Indicator (Visual Only) */}
          <div className="p-1 text-white/10 group-hover:text-white/30 transition-colors pointer-events-none">
            <GripVertical className="w-5 h-5" />
          </div>
      </div>

    </Reorder.Item>
  );
}

// ------------------------------------------------------------
// Sub-Component: ToolboxGroup (Accordion)
// ------------------------------------------------------------
function ToolboxGroup({ type, blocks, onAdd }: { type: BlockType; blocks: LogicBlock[]; onAdd: (b: LogicBlock) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden border border-white/5 bg-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${blocks[0].color}`} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">{type}S</span>
            <span className="text-[10px] bg-white/10 px-1.5 rounded text-white/40">{blocks.length}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronRight className="w-4 h-4 text-white/30" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-2 pt-0 space-y-1">
                {blocks.map((block) => (
                <motion.button
                    key={block.id}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAdd(block)}
                    className="w-full p-2 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{block.label}</span>
                    </div>
                    <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
                </motion.button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Gavel(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m14 5 8 8" />
        <path d="m14 9 8 8" />
        <path d="m3 21 2 2" />
        <path d="m7 17 2 2" />
        <path d="m3 11 8-8 10 10-8 8Z" />
      </svg>
    )
  }
