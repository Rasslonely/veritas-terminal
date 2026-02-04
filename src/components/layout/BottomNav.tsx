"use client";

import { Home, Camera, ShieldAlert, User, Wallet, Scale } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useHaptics } from "@/hooks/useHaptics";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Feed", icon: Scale, href: "/dashboard/feed" }, // Hall of Justice
  { label: "DeFi", icon: Wallet, href: "/dashboard/defi" },
  { label: "Scan", icon: Camera, href: "/scan" }, // Central action
  { label: "Claims", icon: ShieldAlert, href: "/claims" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { triggerHaptic } = useHaptics();

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl h-16 flex justify-between items-center px-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isMain = item.label === "Scan";
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => triggerHaptic(isMain ? "impact" : "selection")}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all duration-200 z-10 w-12",
                isActive ? "text-emerald-400" : "text-white/40 hover:text-white"
              )}
            >
              {isMain ? (
                 <div className="relative -top-8 group">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative bg-black rounded-full p-4 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-active:scale-95 transition-transform">
                        <item.icon className="w-6 h-6 text-white" />
                    </div>
                 </div>
              ) : (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                  <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
