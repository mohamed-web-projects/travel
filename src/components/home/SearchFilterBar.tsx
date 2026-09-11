"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  PRICE_RANGES,
  type Destination,
  type DestinationCategory,
} from "@/data/travelData";
import { cn } from "@/lib/utils";

export interface Filters {
  query: string;
  category: DestinationCategory | "all";
  priceId: string;
  maxDuration: number;
}

export const initialFilters: Filters = {
  query: "",
  category: "all",
  priceId: "all",
  maxDuration: 12,
};

export function applyFilters(destinations: Destination[], filters: Filters) {
  const range = PRICE_RANGES.find((r) => r.id === filters.priceId) ?? PRICE_RANGES[0];
  const q = filters.query.trim().toLowerCase();

  return destinations.filter((d) => {
    if (filters.category !== "all" && !d.categories.includes(filters.category))
      return false;
    if (d.price < range.min || d.price > range.max) return false;
    if (d.durationDays > filters.maxDuration) return false;
    if (q) {
      const haystack = `${d.name} ${d.country} ${d.tagline}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

interface SearchFilterBarProps {
  filters?: Filters;
  onChange?: (next: Filters) => void;
  resultCount?: number;
  className?: string;
}

export function SearchFilterBar({ filters, onChange, resultCount, className }: SearchFilterBarProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<Filters>(filters ?? initialFilters);

  const current = filters ?? internal;
  const commit = (next: Filters) => {
    if (onChange) onChange(next);
    else setInternal(next);
  };

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    commit({ ...current, [key]: value });

  const activeCount = useMemo(
    () =>
      (current.category !== "all" ? 1 : 0) +
      (current.priceId !== "all" ? 1 : 0) +
      (current.maxDuration < 12 ? 1 : 0) +
      (current.query ? 1 : 0),
    [current]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
      className={cn("glass mt-12 w-full max-w-4xl rounded-3xl p-2 shadow-card", className)}
    >
      <div className="flex items-center gap-2 p-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={current.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Where to next? Try “Japan” or “beach”"
            aria-label="Search destinations"
            className="h-12 w-full rounded-xl border border-transparent bg-surface/80 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-surface-strong"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-hairline bg-surface/80 text-foreground transition-colors hover:bg-white/[0.1]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 border-t border-hairline p-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                Category
                <select
                  value={current.category}
                  onChange={(e) => set("category", e.target.value as Filters["category"])}
                  className="h-11 rounded-lg border border-hairline bg-muted px-3 text-sm text-foreground outline-none focus:border-primary/50"
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                Price range
                <select
                  value={current.priceId}
                  onChange={(e) => set("priceId", e.target.value)}
                  className="h-11 rounded-lg border border-hairline bg-muted px-3 text-sm text-foreground outline-none focus:border-primary/50"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
                Max duration · {current.maxDuration}d
                <input
                  type="range"
                  min={3}
                  max={12}
                  value={current.maxDuration}
                  onChange={(e) => set("maxDuration", Number(e.target.value))}
                  className="h-11 accent-primary"
                />
              </label>

              <button
                onClick={() => commit({ ...initialFilters })}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface/70 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:col-span-2 lg:col-span-3"
              >
                <X className="h-4 w-4" />
                Reset all filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.slice(0, 6).map((c) => {
            const active = current.category === c;
            return (
              <button
                key={c}
                onClick={() => set("category", active ? "all" : c)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : "border-hairline bg-surface/50 text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                )}
              >
                {CATEGORY_LABELS[c]}
              </button>
            );
          })}
        </div>
        {typeof resultCount === "number" && (
          <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
            {resultCount} {resultCount === 1 ? "match" : "matches"}
          </span>
        )}
      </div>
    </motion.div>
  );
}