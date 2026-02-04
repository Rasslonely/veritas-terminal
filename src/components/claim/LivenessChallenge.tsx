"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, AlertTriangle, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

interface LivenessChallengeProps {
    challenge: string;
    onCapture: () => void;
    onCancel: () => void;
}

export function LivenessChallenge({ challenge, onCapture, onCancel }: LivenessChallengeProps) {
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onCancel(); // Timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onCancel]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
            <GlassCard className="max-w-md w-full p-6 border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                        <span className="font-mono text-sm uppercase tracking-wider font-bold">Liveness Check</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 hover:bg-white/10">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0.9, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Prove You Are Human
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            To prevent fraud, please perform this specific action:
                        </p>
                    </motion.div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <p className="text-lg font-mono font-bold text-emerald-400 leading-relaxed">
                            "{challenge}"
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
                        <Timer className="w-4 h-4" />
                        <span>Timeout in {timeLeft}s</span>
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 text-md shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                        onClick={onCapture}
                    >
                        <Camera className="w-5 h-5 mr-2" />
                        Capture Verification
                    </Button>
                </div>
            </GlassCard>
        </motion.div>
    );
}
