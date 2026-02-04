import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
  gradient?: "none" | "emerald" | "subtle";
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, intensity = "medium", gradient = "none", hoverEffect = false, ...props }, ref) => {
    
    const intensityStyles = {
      low: "bg-black/20 backdrop-blur-md border-white/5",
      medium: "bg-black/40 backdrop-blur-xl border-white/10",
      high: "bg-black/60 backdrop-blur-2xl border-white/20",
    };

    const gradientStyles = {
      none: "",
      emerald: "bg-gradient-to-br from-emerald-900/10 to-black/0",
      subtle: "bg-gradient-to-b from-white/5 to-transparent",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border shadow-xl relative overflow-hidden transition-all duration-300",
          intensityStyles[intensity],
          gradientStyles[gradient],
          hoverEffect && "hover:bg-white/5 hover:scale-[1.01] hover:shadow-emerald-500/10 hover:border-emerald-500/30",
          className
        )}
        {...props}
      >
        {/* Noise Texture Overlay (Optional, for texture) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Content */}
        <div className="relative z-10">
            {children}
        </div>
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
