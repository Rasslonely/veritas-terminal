"use client";

import { EvidenceAnalysis } from "@/lib/schemas/ai";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultProps {
  analysis: EvidenceAnalysis | null;
  isLoading: boolean;
}

export function AnalysisResult({ analysis, isLoading }: AnalysisResultProps) {
  if (isLoading) {
    return (
      <Card className="bg-black/80 border-primary/20 backdrop-blur-md animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Search className="w-5 h-5 animate-bounce" />
            <span className="font-mono text-sm">NEURAL NETWORK PROCESSING...</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-primary/20 rounded w-3/4" />
            <div className="h-4 bg-primary/20 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "NONE": return "text-green-500 border-green-500/50";
      case "MINOR": return "text-yellow-500 border-yellow-500/50";
      case "MODERATE": return "text-orange-500 border-orange-500/50";
      case "SEVERE": return "text-red-500 border-red-500/50";
      case "TOTAL_LOSS": return "text-red-700 border-red-700/50";
      default: return "text-gray-500";
    }
  };

  return (
    <Card className="bg-black/80 border-white/10 backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-bold text-sm tracking-wider">AI ASSESSMENT</h3>
            <Badge variant="outline" className="font-mono text-xs bg-black">
                CONFIDENCE: {analysis.confidenceScore}%
            </Badge>
        </div>

        <CardContent className="p-6 space-y-6">
            {/* Object Detection */}
            <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-widest">Target Detected</label>
                <div className="text-xl font-bold text-white uppercase">{analysis.objectDetected}</div>
            </div>

            {/* Severity */}
            <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-widest">Damage Classification</label>
                <div className={cn("text-2xl font-black uppercase border px-3 py-1 inline-block rounded-md tracking-widest", getSeverityColor(analysis.damageLevel))}>
                    {analysis.damageLevel.replace("_", " ")}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-[10px] uppercase text-muted-foreground tracking-widest">Analysis Report</label>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-md border border-white/5">
                    {analysis.description}
                </p>
            </div>
        </CardContent>
    </Card>
  );
}
