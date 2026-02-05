

import { AuthCheck } from "../auth/AuthCheck";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Background Layer 1: Deep Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_120%,#064e3b_0%,#000000_60%)]" />

      {/* Background Layer 2: Noise Texture for 'Film Grain' feel */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* Background Layer 3: Accent Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <AuthCheck />



      <main className="relative z-10 px-4 pt-20 pb-32 max-w-md mx-auto w-full">
        {children}
      </main>


    </div>
  );
}
