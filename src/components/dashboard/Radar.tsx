"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Radar() {
  const [blips, setBlips] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  // Generate random ghost blips
  useEffect(() => {
    const interval = setInterval(() => {
      const newBlip = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // 10-90%
        y: Math.random() * 80 + 10,
        delay: Math.random() * 2,
      };
      setBlips((prev) => [...prev.slice(-4), newBlip]); // Keep last 5
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden group hover:border-[#00ff9d]/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* 1. Grid Geometry */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[80%] h-[80%] border border-[#00ff9d] rounded-full absolute opacity-20" />
        <div className="w-[55%] h-[55%] border border-[#00ff9d] rounded-full absolute opacity-20" />
        <div className="w-[30%] h-[30%] border border-[#00ff9d] rounded-full absolute opacity-40 ml-[1px]" />
        
        {/* Crosshairs */}
        <div className="w-full h-[1px] bg-[#00ff9d]/20 absolute" />
        <div className="h-full w-[1px] bg-[#00ff9d]/20 absolute" />
        
        {/* Diagonal Lines */}
        <div className="w-full h-[1px] bg-[#00ff9d]/10 absolute rotate-45" />
        <div className="w-full h-[1px] bg-[#00ff9d]/10 absolute -rotate-45" />
      </div>

      {/* 2. The Sweep (Rotational Scan) */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      >
        <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,255,157,0.15)_60deg,transparent_60deg)] rounded-full scale-[1.5]" />
      </motion.div>

      {/* 3. Ghost Blips */}
      {blips.map((blip) => (
        <motion.div
          key={blip.id}
          className="absolute w-2 h-2 bg-[#00ff9d] rounded-full shadow-[0_0_8px_#00ff9d]"
          style={{ top: `${blip.y}%`, left: `${blip.x}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 0], 
            opacity: [0, 1, 0] 
          }}
          transition={{ duration: 2, delay: blip.delay }}
        />
      ))}

      {/* 4. Active Targets (Static for Demo) */}
      <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-[#00ff9d] rounded-full animate-ping delay-700" />

      {/* 5. HUD Overlay */}
      <div className="absolute bottom-4 left-6 text-xs font-mono text-[#00ff9d] drop-shadow-[0_0_5px_rgba(0,255,157,0.8)] z-10">
        <p className="tracking-widest animate-pulse">SCANNING_SECTOR_07...</p>
        <p className="text-white/50 mt-1">TARGETS_ACQUIRED: {blips.length + 2}</p>
      </div>

      {/* 6. Tactical Corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00ff9d]/50 rounded-tl-lg" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00ff9d]/50 rounded-br-lg" />
    </div>
  );
}
