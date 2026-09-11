import type { Metadata } from "next";
import { PlannerWizard } from "@/components/planner/PlannerWizard";

export const metadata: Metadata = {
  title: "AI Trip Planner · REAORI Travel",
  description: "Answer three questions — destination, style, budget — and get a day-by-day itinerary in seconds.",
};

export default function PlannerPage() {
  return (
    <div className="relative mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
          <SparklesIcon />
          AI trip planner
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Plan a trip in <span className="text-gradient">under a minute</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tell us the destination, your travel style and budget. REAORI crafts a
          day-by-day itinerary with live pricing — then book it in one click.
        </p>
      </div>
      <PlannerWizard />
    </div>
  );
}

import { Sparkles } from "lucide-react";
function SparklesIcon() {
  return <Sparkles className="h-3.5 w-3.5" />;
}