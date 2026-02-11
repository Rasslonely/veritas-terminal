"use client";

import React, { useMemo } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface EvidenceGraphProps {
  claimId: Id<"claims">;
}

const AgentNode = ({ data }: { data: any }) => {
  const isLawyer = data.role === "LAWYER";
  const isAuditor = data.role === "AUDITOR";
  const isVerdict = data.role === "VERDICT";
  const isSystem = data.role === "SYSTEM";

  return (
    <div className={`p-4 rounded-xl border shadow-2xl max-w-[280px] transition-all duration-500 hover:scale-105 backdrop-blur-xl ${
      isLawyer ? "bg-blue-950/40 border-blue-500/50 text-blue-100 ring-1 ring-blue-500/20" :
      isAuditor ? "bg-red-950/40 border-red-500/50 text-red-100 ring-1 ring-red-500/20" :
      isVerdict ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-100 ring-1 ring-emerald-500/20" :
      "bg-zinc-900/60 border-zinc-700/50 text-zinc-300 ring-1 ring-zinc-500/10"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse ${
             isLawyer ? "bg-blue-400" : isAuditor ? "bg-red-400" : isVerdict ? "bg-emerald-400" : "bg-gray-400"
           }`} />
           <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-mono">
             {data.role}
           </span>
        </div>
        {data.branchType && (
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/50">
            {data.branchType}
          </span>
        )}
      </div>
      <div className="font-bold text-sm mb-2 text-white/90 leading-tight">{data.name}</div>
      <p className="text-[11px] leading-relaxed italic opacity-80 border-l-2 border-white/10 pl-3 py-1">
        {data.content}
      </p>
    </div>
  );
};

const nodeTypes = {
  agent: AgentNode,
};

export function EvidenceGraph({ claimId }: EvidenceGraphProps) {
  const messages = useQuery(api.claims.getDebateMessages, { claimId });

  const { nodes, edges } = useMemo(() => {
    if (!messages || messages.length === 0) return { nodes: [], edges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Layout configuration
    const HORIZONTAL_SPACING = 400;
    const VERTICAL_SPACING = 250;
    const levelCounts: Record<number, number> = {};

    messages.forEach((msg) => {
      const level = msg.round || 0;
      levelCounts[level] = (levelCounts[level] || 0) + 1;

      newNodes.push({
        id: msg._id,
        type: "agent",
        data: { 
          role: msg.agentRole, 
          name: msg.agentName, 
          content: msg.content,
          branchType: msg.branchType
        },
        position: { 
          x: level * HORIZONTAL_SPACING, 
          y: (levelCounts[level] - 1) * VERTICAL_SPACING 
        },
      });

      if (msg.parentId) {
        newEdges.push({
          id: `e-${msg.parentId}-${msg._id}`,
          source: msg.parentId,
          target: msg._id,
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2, opacity: 0.6 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6366f1",
          },
        });
      }
    });

    return { nodes: newNodes, edges: newEdges };
  }, [messages]);

  return (
    <div className="h-[700px] w-full rounded-3xl border border-white/5 bg-black/20 backdrop-blur-2xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] relative">
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
           <span className="text-xs font-mono font-bold text-white/70 tracking-tighter">FRACTAL_DEBATE_ENGINE_ACTIVE</span>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="selection:bg-indigo-500/30"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#1a1a1a" gap={30} size={1} />
        <Controls className="!bg-black/60 !border-white/10 !fill-white/70" />
      </ReactFlow>
    </div>
  );
}
