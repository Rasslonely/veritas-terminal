"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function ClaimsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Card 
          key={idx}
          className="p-4 bg-white/[0.02] border-white/5 relative overflow-hidden"
        >
          {/* Shimmer Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent z-0"
          />

          <div className="flex gap-4 items-start relative z-10">
            {/* Thumbnail Placeholder */}
            <div className="w-16 h-16 rounded-md bg-white/5 border border-white/10 shrink-0" />

            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                {/* Title Placeholder */}
                <div className="h-4 w-32 bg-white/10 rounded-full" />
                {/* Badge Placeholder */}
                <div className="h-4 w-16 bg-white/5 rounded-full" />
              </div>
              
              {/* Description Placeholder */}
              <div className="space-y-2">
                 <div className="h-2 w-full bg-white/5 rounded-full" />
                 <div className="h-2 w-2/3 bg-white/5 rounded-full" />
              </div>

              {/* Footer Placeholder */}
              <div className="h-2 w-20 bg-white/5 rounded-full pt-2" />
            </div>
            
            {/* Arrow Placeholder */}
            <div className="w-5 h-5 bg-white/5 rounded-md mt-6" />
          </div>
        </Card>
      ))}
    </div>
  );
}
