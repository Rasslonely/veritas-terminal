"use client";

import React, { useMemo } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node,
  MarkerType,
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Database, Fingerprint, Activity, Clock, Cpu, Zap, ShieldCheck, Scale, ListTree } from "lucide-react";

interface EvidenceGraphProps {
  claimId: Id<"claims">;
}

/**
 * TACTICAL NEURAL EDGE
 * High-fidelity connecting lines with moving signal pulses.
 */
function NeuralSignalEdge({ 
    id, 
    sourceX, 
    sourceY, 
    targetX, 
    targetY, 
    sourcePosition, 
    targetPosition, 
    style = {}, 
    markerEnd 
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: "#10b981", strokeWidth: 1.5, opacity: 0.3 }} />
      <circle r="3" fill="#10b981" className="shadow-[0_0_10px_#10b981]">
        <animateMotion dur="3s" repeatCount="Indefinite" path={edgePath} />
        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="Indefinite" />
      </circle>
    </>
  );
}

/**
 * TACTICAL AGENT NODE
 * Frosted glass card with reactive glow and tactical corner accents.
 */
const AgentNode = ({ data }: { data: any }) => {
  const isLawyer = data.role === "LAWYER";
  const isAuditor = data.role === "AUDITOR";
  const isVerdict = data.role === "VERDICT";
  const isSystem = data.role === "SYSTEM";

  const colorClass = isLawyer 
    ? "from-blue-500/10 to-blue-900/30 border-blue-500/50 text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.1)]" 
    : isAuditor 
    ? "from-red-500/10 to-red-900/30 border-red-500/50 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.1)]" 
    : isVerdict 
    ? "from-emerald-500/20 to-emerald-900/40 border-emerald-400/60 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.2)]" 
    : "from-zinc-500/10 to-zinc-900/30 border-white/20 text-zinc-100";

  const Icon = isLawyer ? ShieldCheck : isAuditor ? ListTree : isVerdict ? Scale : Cpu;

  return (
    <div className={`relative p-6 rounded-3xl border bg-gradient-to-br backdrop-blur-3xl min-w-[340px] max-w-[450px] overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${colorClass}`}>
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* Pulsing Core Glow */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-current opacity-[0.05] rounded-full blur-[60px] animate-pulse" />

      {/* Tactical Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-inherit opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-inherit opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-inherit opacity-40 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-inherit opacity-40 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-inner">
                <Icon className="w-full h-full opacity-70" />
             </div>
             <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 font-mono block">
                  NEURAL_NODE_{data.round || 0}
                </span>
                <span className="text-xs font-bold text-white tracking-widest font-mono">
                   {data.name.toUpperCase()}
                </span>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {data.branchType && (
                <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-mono text-white/40 uppercase tracking-[0.2em] backdrop-blur-md">
                {data.branchType}
                </div>
            )}
            <div className="text-[7px] font-mono opacity-20 tracking-tighter">TIMESTAMP_LATEST</div>
          </div>
        </div>

        <div className="space-y-4">
           <div className="relative">
              <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-current opacity-20 rounded-full" />
              <p className="text-[12px] leading-relaxed text-white/80 font-inter italic px-1 whitespace-pre-wrap break-words">
                "{data.content}"
              </p>
           </div>

           <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-all duration-300">
                 <Fingerprint className="w-3 h-3 text-current" />
                 <span className="text-[9px] font-mono tracking-[0.2em] font-black">HCS_ID_VERIFIED</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5">
                  <Activity className="w-2.5 h-2.5 text-current opacity-40" />
                  <span className="text-[9px] font-mono text-white/40">LVL_{data.round}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  agent: AgentNode,
};

const edgeTypes = {
  neural: NeuralSignalEdge,
};

export function EvidenceGraph({ claimId }: EvidenceGraphProps) {
  const messages = useQuery(api.claims.getDebateMessages, { claimId });

  const { nodes, edges } = useMemo(() => {
    if (!messages || messages.length === 0) return { nodes: [], edges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // --- DYNAMIC FRACTAL LAYOUT ENGINE ---
    const sortedRounds = Array.from(new Set(messages.map(m => m.round || 0))).sort((a, b) => a - b);
    const roundToLevel = Object.fromEntries(sortedRounds.map((r, i) => [r, i]));

    const HORIZONTAL_SPACING = 550; // Balanced for wider cards
    const VERTICAL_SPACING = 350; 
    const levelCounts: Record<number, number> = {};
    
    // Predetermine counts per level for centering logic
    const levelTotals: Record<number, number> = {};
    messages.forEach(m => {
        const lvl = roundToLevel[m.round || 0];
        levelTotals[lvl] = (levelTotals[lvl] || 0) + 1;
    });

    messages.forEach((msg) => {
      const level = roundToLevel[msg.round || 0];
      levelCounts[level] = (levelCounts[level] || 0) + 1;
      
      const totalInLevel = levelTotals[level];
      // Vertical Centering Calculation:
      // Offset Y so that the column is centered around the horizontal axis (y=0)
      const yOffset = ((totalInLevel - 1) * VERTICAL_SPACING) / 2;

      newNodes.push({
        id: msg._id,
        type: "agent",
        data: { 
          role: msg.agentRole, 
          name: msg.agentName, 
          content: msg.content,
          branchType: msg.branchType,
          round: msg.round
        },
        position: { 
          x: level * HORIZONTAL_SPACING, 
          y: (levelCounts[level] - 1) * VERTICAL_SPACING - yOffset 
        },
      });

      if (msg.parentId) {
        newEdges.push({
          id: `e-${msg.parentId}-${msg._id}`,
          source: msg.parentId,
          target: msg._id,
          type: "neural",
          style: { stroke: "#10b981", strokeWidth: 1.5, opacity: 0.3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#10b981",
          },
        });
      }
    });

    return { nodes: newNodes, edges: newEdges };
  }, [messages]);


  return (
    <div className="h-full w-full rounded-[2.5rem] border border-white/10 bg-[#050505] overflow-hidden relative group shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
      
      {/* BACKGROUND: Tactical Grid & Scanlines */}
      <div className="absolute inset-0 z-0 h-full w-full">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
         <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(16,185,129,0.2) 2px, transparent 2px)", backgroundSize: "15px 15px" }} />
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20" />
      </div>

      {/* TOP-LEFT HUD */}
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-4">
        <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/60 border border-emerald-500/20 backdrop-blur-2xl shadow-2xl"
        >
           <div className="relative">
             <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
             <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-40" />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black font-mono text-emerald-400 tracking-[0.3em] uppercase leading-none mb-1">Tactical_Neural_Link</span>
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest leading-none">Status: Active_Sync</span>
           </div>
        </motion.div>
        
        <div className="flex items-center gap-5 text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] pl-2 drop-shadow-md">
           <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5"><Database className="w-3 h-3 text-emerald-500/50" /> Nodes: {nodes.length}</span>
           <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5"><Activity className="w-3 h-3 text-emerald-500/50" /> Signals: {edges.length}</span>
        </div>
      </div>

      {/* BOTTOM-RIGHT HUD */}
      <div className="absolute bottom-10 right-10 z-10 flex flex-col items-end gap-3 pointer-events-none select-none">
         <div className="bg-black/60 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4">
            <div className="flex flex-col items-end">
                <p className="text-[10px] font-black font-mono text-white/50 tracking-[0.3em] uppercase mb-1 underline decoration-emerald-500/50">Grid_Geometry_V4</p>
                <p className="text-[9px] font-mono text-white/20">COORD_SYNC: VALID_STATE</p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-500/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                 <Cpu className="w-5 h-5 text-emerald-500/20" />
            </div>
         </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        className="selection:bg-emerald-500/30"
        minZoom={0.05}
        maxZoom={1.5}
        // // Investigative Mode: Disable node dragging/selecting to allow global panning
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={true}
        // Disable attribution for a cleaner look
        proOptions={{ hideAttribution: true }}
      >
        <Background color="transparent" />
        <Controls 
          showInteractive={false} 
          className="!bg-black/40 !border-white/10 !shadow-2xl backdrop-blur-md !rounded-xl !p-1 [&_button]:!bg-transparent [&_button]:!border-white/5 [&_svg]:!fill-white/50" 
        />
      </ReactFlow>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] z-10" />
    </div>
  );
}
