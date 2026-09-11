"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX, X } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SearchFilterBar, applyFilters, initialFilters, type Filters } from "./SearchFilterBar";
import { DestinationCard } from "./DestinationCard";
import { TripModal } from "./TripModal";
import { CompareProvider } from "@/components/compare/compare-context";
import { CompareBar } from "./CompareBar";
import { DESTINATIONS, type Destination } from "@/data/travelData";

export function ToursSection() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [quickView, setQuickView] = useState<Destination | null>(null);

  const results = useMemo(() => applyFilters(DESTINATIONS, filters), [filters]);

  return (
    <CompareProvider>
      <section id="tours" className="relative scroll-mt-20 py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Tours"
            title="Hand-picked destinations"
            description="Real-time filter by destination, price, duration and category — then pin up to 3 packages to compare side by side."
          />

          <SearchFilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
            className="max-w-none"
          />

          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.ul
                key={`${filters.query}-${filters.category}-${filters.priceId}-${filters.maxDuration}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {results.map((destination, index) => (
                  <DestinationCard
                    key={destination.slug}
                    destination={destination}
                    index={index}
                    onQuickView={setQuickView}
                  />
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-16 flex flex-col items-center gap-4 text-center text-muted-foreground"
              >
                <div className="grid h-20 w-20 place-items-center rounded-2xl border border-hairline bg-surface/50">
                  <SearchX className="h-9 w-9 text-primary/70" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No tours match</h3>
                <p className="max-w-sm text-sm">
                  Try a different destination, widen your price range, or relax the maximum
                  duration.
                </p>
                <button
                  onClick={() => setFilters(initialFilters)}
                  className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-hairline px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <X className="h-4 w-4" />
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TripModal destination={quickView} onClose={() => setQuickView(null)} />
        <CompareBar />
      </section>
    </CompareProvider>
  );
}