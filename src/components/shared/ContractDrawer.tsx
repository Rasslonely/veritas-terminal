"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Copy, Check, ShieldCheck, FileCode, Users, Lock, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

const CONTRACTS = [
    { 
        name: "Veritas Vault", 
        address: "0x7d614118529243DDc5C7ad19F4b89220634d1Ba0", 
        icon: Lock,
        description: "Secure Asset Tresury"
    },
    { 
        name: "Policy Registry", 
        address: "0x3dAC8B24ee19c807eB9B1932AD789E3D03C1091D", 
        icon: FileCode,
        description: "Claims Logic & Rules"
    },
    { 
        name: "Veritas Governor", 
        address: "0x8fA50988f36af835de40153E871689148aE54E49", 
        icon: Users,
        description: "DAO Governance"
    },
    { 
        name: "Timelock Controller", 
        address: "0xb38c87D42AA5fbF778e1093c61D5e4a010996EB0", 
        icon: ShieldCheck,
        description: "Delay & Security"
    },
    { 
        name: "Veritas Token", 
        address: "0x4080ACE95cf319c40F952D2dCCE21b070270f14d", 
        icon: ShieldCheck,
        description: "Governance Token"
    }
];

const EXPLORER_URL = "https://shadownet.explorer.etherlink.com/address";

export function ContractDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (addr: string) => {
        navigator.clipboard.writeText(addr);
        setCopied(addr);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
                    />
                    
                    {/* Drawer */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[1000] bg-black/90 border-t border-white/10 rounded-t-3xl max-w-2xl mx-auto max-h-[85vh] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.8)]"
                    >
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    Verified Contracts
                                </h3>
                                <p className="text-xs text-white/40 font-mono uppercase tracking-wider">
                                    Etherlink Shadownet Testnet
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {CONTRACTS.map((contract) => (
                                <GlassCard key={contract.address} className="p-4 border-white/5 bg-white/[0.02]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <contract.icon className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{contract.name}</h4>
                                                <p className="text-[10px] text-white/40 uppercase tracking-wider">{contract.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => handleCopy(contract.address)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                title="Copy Address"
                                            >
                                                {copied === contract.address ? (
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-white/40 group-hover:text-white" />
                                                )}
                                            </button>
                                            <a 
                                                href={`${EXPLORER_URL}/${contract.address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                                                title="View on Explorer"
                                            >
                                                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-400" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="mt-3 pl-[3.25rem]">
                                        <code className="text-[10px] font-mono text-white/30 break-all bg-black/40 px-2 py-1 rounded border border-white/5 block">
                                            {contract.address}
                                        </code>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                            <a 
                                href="https://shadownet.explorer.etherlink.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white group"
                            >
                                <ExternalLink className="w-3 h-3 group-hover:text-emerald-400 transition-colors" />
                                Open Block Explorer
                            </a>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
