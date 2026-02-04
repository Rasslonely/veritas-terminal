"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HallOfJustice } from "@/components/debate/HallOfJustice";

export default function FeedPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <HallOfJustice />
      </div>
    </DashboardLayout>
  );
}
