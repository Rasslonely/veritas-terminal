"use client";

import { Home, Camera, ShieldAlert, User, Gavel } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Scan", icon: Camera, href: "/scan" }, // Central action
  { label: "Claims", icon: ShieldAlert, href: "/claims" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

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
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200",
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-white"
              )}
            >
              {isMain ? (
                <div className="relative -top-8 bg-emerald-500 rounded-full p-4 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-4 border-black/90 group hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
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
