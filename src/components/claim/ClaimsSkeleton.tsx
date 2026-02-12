"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function ClaimsSkeleton({ 
    count = 3, 
    variant = "dossier" 
}: { 
    count?: number, 
    variant?: "dossier" | "ledger" 
}) {
  return (
    <div className="space-y-4">
      {variant === "ledger" ? (
        /* LEDGER SKELETON (High-Density) */
        <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="col-span-3 h-2 w-16 bg-white/10 rounded-full" />
                <div className="col-span-4 h-2 w-24 bg-white/10 rounded-full" />
                <div className="col-span-2 h-2 w-12 bg-white/10 rounded-full mx-auto" />
                <div className="col-span-3 h-2 w-16 bg-white/10 rounded-full ml-auto" />
            </div>
            {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 relative overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent z-0"
                    />
                    <div className="col-span-3 h-3 w-20 bg-white/5 rounded" />
                    <div className="col-span-4 flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/5 rounded shrink-0" />
                        <div className="h-3 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="col-span-2 h-3 w-12 bg-white/5 rounded mx-auto" />
                    <div className="col-span-3 h-3 w-16 bg-white/5 rounded ml-auto" />
                </div>
            ))}
        </div>
      ) : (
        /* DOSSIER SKELETON (Personal Cards) */
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, idx) => (
                <Card 
                key={idx}
                className="p-4 bg-white/[0.02] border-white/5 relative overflow-hidden rounded-2xl"
                >
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent z-0"
                />

                <div className="flex gap-6 items-center relative z-10">
                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-white/10 rounded-full" />
                                <div className="h-2 w-24 bg-white/5 rounded-full" />
                            </div>
                            <div className="h-4 w-16 bg-white/5 rounded-full" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-2 w-20 bg-white/5 rounded-full" />
                        </div>
                    </div>
                    <div className="w-5 h-5 bg-white/5 rounded-md" />
                </div>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
