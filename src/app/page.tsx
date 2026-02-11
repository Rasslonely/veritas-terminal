"use client";

import { FieldView } from "@/components/mobile/FieldView";
import { CommandDeck } from "@/components/desktop/CommandDeck";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
        {/* Mobile View: Visible only on small screens */}
        <div className="block md:hidden">
            <FieldView />
        </div>

        {/* Desktop View: Visible only on medium screens and up */}
        <div className="hidden md:block">
            <CommandDeck />
        </div>
    </DashboardLayout>
  );
}
