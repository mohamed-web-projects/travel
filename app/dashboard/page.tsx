import type { Metadata } from "next";
import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard · REAORI Travel",
  description: "Manage your REAORI profile, wishlist, bookings and itineraries in one place.",
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  return (
    <div className="relative mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <Suspense>
        <Dashboard initialTab={tab} />
      </Suspense>
    </div>
  );
}