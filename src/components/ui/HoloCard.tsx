"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export function HoloCard({ children, className, isActive = false }: HoloCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left); 
    mouseY.set(clientY - top);
  }

  // Effect: A spotlight that follows the mouse
  const maskImage = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-black group",
        isActive && "border-emerald-500/30 shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]",
        className
      )}
    >
      {/* 1. Base Gradient (Subtle) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />
      
      {/* 2. Holographic Shine (Mouse Follower) */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={style}
      />

      {/* 3. Border Beam (Mouse Follower) */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-500 group-hover:opacity-100"
        style={{
            ...style,
            background: isActive 
                ? "linear-gradient(to right, transparent, rgba(16, 185, 129, 0.4), transparent)" 
                : "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)"
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
      
      {/* Scanline Effect (Optional) */}
      {isActive && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20" />
      )}
    </div>
  );
}
