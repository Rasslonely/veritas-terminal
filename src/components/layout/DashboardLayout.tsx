

import { AuthCheck } from "../auth/AuthCheck";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Background Layer 1: Intensified Deep Neon Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_120%,#065f46_0%,#000000_70%)] opacity-80" />

      {/* Background Layer 2: Enhanced Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* Background Layer 3: Dynamic Accent Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <AuthCheck />



      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className={cn(
        "relative z-10 px-6 pt-24 pb-32 max-w-7xl mx-auto w-full transition-all duration-500",
        "md:pl-32 md:pt-20"
      )}>
        {children}
      </main>


    </div>
  );
}
