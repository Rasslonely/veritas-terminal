import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function HCSBadge({ txHash, size = "md" }: { txHash: string; size?: "sm" | "md" }) {
  // Mock explorer URL for demo, or real HashScan if we had network info
  const explorerUrl = `https://hashscan.io/testnet/topic/${process.env.NEXT_PUBLIC_HEDERA_TOPIC_ID}?p=${txHash}`;

  return (
    <a 
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors shrink-0",
        size === "sm" ? "px-1 py-0 text-[8px]" : "px-2 py-0.5 text-[9px] mt-2"
      )}
    >
      <ShieldCheck className={cn(size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3")} />
      <span>HCS: #{txHash.substring(0, 6)}</span>
    </a>
  );
}
