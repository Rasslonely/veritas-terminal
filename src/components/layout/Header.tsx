"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-6 pt-6 flex justify-between items-center max-w-7xl mx-auto pointer-events-none">
      {/* Brand / Logo */}
      <div className="pointer-events-auto flex items-center gap-2">
         <Avatar className="h-8 w-8 border border-white/20">
            <AvatarImage src="/icon.png" className="object-cover" />
            <AvatarFallback className="bg-emerald-900 text-emerald-400 font-bold">V</AvatarFallback>
         </Avatar>
         <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            VERITAS
         </span>
      </div>

      {/* Network Selector Removed as per user request */}
    </div>
  );
}
