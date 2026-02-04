"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/useHaptics";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  disableHaptics?: boolean;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, shimmerColor = "rgba(255, 255, 255, 0.2)", disableHaptics, onClick, ...props }, ref) => {
    const { triggerHaptic } = useHaptics();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disableHaptics) triggerHaptic("impact");
        onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/80 px-6 py-3 font-medium text-white transition-all hover:bg-white/10 active:scale-95",
          className
        )}
        {...props}
      >
        <span className="absolute inset-0 -translate-x-[120%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-none" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
