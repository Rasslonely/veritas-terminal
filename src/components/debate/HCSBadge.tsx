import { ShieldCheck } from "lucide-react";

export function HCSBadge({ txHash }: { txHash: string }) {
  // Mock explorer URL for demo, or real HashScan if we had network info
  // Sequence number is usually passed as txHash for HCS topics
  const explorerUrl = `https://hashscan.io/testnet/topic/${process.env.NEXT_PUBLIC_HEDERA_TOPIC_ID}?p=${txHash}`;

  return (
    <a 
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 hover:bg-emerald-500/20 transition-colors"
    >
      <ShieldCheck className="w-3 h-3" />
      <span>HCS LOG: #{txHash}</span>
    </a>
  );
}
