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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl pb-safe pt-2 px-6">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto">
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
                <div className="relative -top-5 bg-primary rounded-full p-4 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-4 border-black">
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
