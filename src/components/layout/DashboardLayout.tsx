import { BottomNav } from "./BottomNav";
import { AuthCheck } from "../auth/AuthCheck";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white pb-24">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <AuthCheck />

      <main className="relative z-10 px-4 pt-6 max-w-md mx-auto">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
