"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Globe, 
  Archive, 
  Cpu, 
  User, 
  LayoutDashboard,
  Zap,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Operations", href: "/", color: "text-emerald-500" },
  { icon: Globe, label: "Live Nexus", href: "/dashboard/feed", color: "text-blue-500" },
  { icon: Archive, label: "Archives", href: "/claims", color: "text-zinc-400" },
  { icon: Cpu, label: "Policy Forge", href: "/admin/forge", color: "text-purple-500" },
  { icon: User, label: "Neural Link", href: "/profile", color: "text-zinc-300" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-20 flex flex-col items-center py-8 bg-black/40 backdrop-blur-3xl border-r border-white/5 shadow-2xl">
      {/* System Logo Slot */}
      <div className="mb-12">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group hover:border-emerald-500 transition-all duration-500 cursor-pointer">
           <ShieldCheck className="w-6 h-6 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="relative group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-3 rounded-xl transition-all duration-300 relative z-10",
                  isActive 
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && item.color)} />
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                  />
                )}
              </motion.div>

              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="mt-auto">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </div>
    </aside>
  );
}
