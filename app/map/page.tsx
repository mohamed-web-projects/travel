import type { Metadata } from "next";
import { MapView } from "@/components/map/MapView";

export const metadata: Metadata = {
  title: "Destination map · REAORI Travel",
  description: "Explore all REAORI destinations on an interactive map with live prices and trip highlights.",
};

export default function MapPage() {
  return (
    <div className="relative mx-auto min-h-[calc(100vh-8rem)] max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find your next view on the <span className="text-gradient">map</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every pin is a REAORI destination with live per-person pricing. Hover the list to
          spotlight a pin, or tap a pin for a quick preview.
        </p>
      </div>
      <MapView />
    </div>
  );
}