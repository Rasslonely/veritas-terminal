"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  GripVertical
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
  { id: "t1", type: "TRIGGER", label: "On Physical Damage", value: "physical_damage", color: "bg-amber-500" },
  { id: "t2", type: "TRIGGER", label: "On Internal Failure", value: "internal_sensor", color: "bg-amber-500" },
  { id: "r1", type: "RULE", label: "Exclude Water", value: "exclude_water", color: "bg-blue-500" },
  { id: "r2", type: "RULE", label: "Exclude Cosmetic", value: "exclude_cosmetic", color: "bg-blue-500" },
  { id: "h1", type: "THRESHOLD", label: "Max Payout $100", value: "limit_100", color: "bg-emerald-500" },
  { id: "h2", type: "THRESHOLD", label: "Max Payout $500", value: "limit_500", color: "bg-emerald-500" },
  { id: "a1", type: "AGENT", label: "Aggressive Auditor", value: "aggressive", color: "bg-purple-500" },
  { id: "a2", type: "AGENT", label: "Leniant Judge", value: "leniant", color: "bg-purple-500" },
];

export function PolicyForge() {
  const { address } = useAccount();
  const user = useQuery(api.users.getUser, address ? { walletAddress: address } : "skip");
  
  const [activeBlocks, setActiveBlocks] = useState<LogicBlock[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState<string | null>(null);

  const compileAction = useAction(api.agent.policy_compiler.compilePolicyBlueprint);

  const addBlock = (block: LogicBlock) => {
    setActiveBlocks([...activeBlocks, { ...block, id: Math.random().toString() }]);
  };

  const removeBlock = (id: string) => {
    setActiveBlocks(activeBlocks.filter(b => b.id !== id));
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-7xl mx-auto min-h-[800px]">
      
      {/* Toolbox */}
      <div className="lg:col-span-3 space-y-6">
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Logic Toolbox
          </h2>
          <div className="space-y-3">
            {AVAILABLE_BLOCKS.map((block) => (
              <motion.button
                key={block.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addBlock(block)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${block.color}`} />
                  <span className="text-sm font-medium text-white/80">{block.label}</span>
                </div>
                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl">
           <p className="text-xs text-indigo-300 leading-relaxed italic">
             "Drag blocks into the workspace to architect the truth. Gemini 3 will weave them into an ERC-8004 Service Definition."
           </p>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="lg:col-span-6 space-y-4">
        <div className="relative h-[600px] w-full rounded-[40px] border-2 border-dashed border-white/10 bg-black/40 p-8 flex flex-col items-center justify-start gap-4 overflow-y-auto custom-scrollbar">
          
          <AnimatePresence>
            {activeBlocks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-4"
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
              <Reorder.Item
                key={block.id}
                value={block}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, x: -50 }}
                className={`w-full p-5 rounded-2xl border flex items-center justify-between shadow-xl ${block.color} bg-opacity-10 border-opacity-30 cursor-grab active:cursor-grabbing hover:border-opacity-60 transition-all`}
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-white/20" />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm`}>
                    {block.type === "TRIGGER" && <Zap className="w-5 h-5" />}
                    {block.type === "RULE" && <ShieldCheck className="w-5 h-5" />}
                    {block.type === "THRESHOLD" && <AlertCircle className="w-5 h-5" />}
                    {block.type === "AGENT" && <Gavel className="w-5 h-5" />}
                  </div>
                  <div>
                     <div className="text-[10px] font-bold uppercase opacity-50">{block.type}</div>
                     <div className="text-sm font-bold text-white/90">{block.label}</div>
                  </div>
                </div>
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="p-2 rounded-lg hover:bg-black/20 text-white/40 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Reorder.Item>
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
            className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest gap-2 shadow-[0_10px_20px_rgba(79,70,229,0.3)]"
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

      {/* Compiler Output */}
      <div className="lg:col-span-3">
        <div className="p-6 rounded-3xl bg-black/60 border border-white/5 backdrop-blur-xl h-full">
           <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Code className="w-4 h-4" /> Agent System Prompt
          </h2>
          
          <div className="font-mono text-[10px] leading-relaxed text-zinc-400 h-[600px] overflow-y-auto custom-scrollbar">
            {compiledResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-indigo-400">// PROMPT_GENERATED_BY_GEMINI_3</div>
                <p className="whitespace-pre-wrap">{compiledResult}</p>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="font-bold">✓</span> Successfully mapped to ERC-8004.
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                <Code className="w-12 h-12 mb-4" />
                <p>Waiting for compilation...</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
