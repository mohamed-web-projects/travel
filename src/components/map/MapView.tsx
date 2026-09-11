"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plane, X, ArrowUpRight, Filter } from "lucide-react";
import { DESTINATIONS } from "@/data/travelData";
import { MAP_PINS } from "@/data/mockData";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MapView() {
  const { format } = useSettings();
  const { theme } = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  const gridDot =
    theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(24,27,54,0.10)";

  const filtered = useMemo(() => {
    if (category === "all") return MAP_PINS;
    return MAP_PINS.filter((pin) => {
      const d = DESTINATIONS.find((x) => x.slug === pin.slug);
      return d?.categories.includes(category as never);
    });
  }, [category]);

  const activePin = MAP_PINS.find((p) => p.slug === active);
  const activeDest = DESTINATIONS.find((d) => d.slug === active);

  const minX = Math.min(...filtered.map((p) => p.x));
  const maxX = Math.max(...filtered.map((p) => p.x));
  const minY = Math.min(...filtered.map((p) => p.y));
  const maxY = Math.max(...filtered.map((p) => p.y));

  const sorted = useMemo(
    () => [...MAP_PINS].sort((a, b) => a.price - b.price),
    []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
      {/* Map canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-background/40 p-4 lg:sticky lg:top-24 lg:h-fit lg:self-start">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-hairline bg-[radial-gradient(ellipse_at_top,#eef0fb_0%,#dde2f3_60%)] sm:aspect-[16/9] dark:bg-[radial-gradient(ellipse_at_top,#151d33_0%,#0b1020_60%)]">
          {/* Dotted grid */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill={gridDot} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Abstract continents */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
            <g stroke="rgba(125,125,254,0.18)" strokeWidth="0.35" fill="rgba(125,125,254,0.07)">
              <path d="M12 12 Q18 8 25 11 Q30 15 27 20 Q22 24 16 21 Q10 18 12 12 Z" />
              <path d="M35 10 Q44 6 52 9 Q58 14 54 19 Q47 24 40 21 Q33 17 35 10 Z" />
              <path d="M27 28 Q34 24 42 27 Q48 32 44 37 Q36 42 29 38 Q23 34 27 28 Z" />
              <path d="M55 30 Q66 26 78 30 Q84 36 80 42 Q70 48 60 43 Q52 38 55 30 Z" />
              <path d="M8 40 Q15 36 22 40 Q25 45 20 49 Q12 52 8 47 Z" />
            </g>
          </svg>

          {/* Category filter chips */}
          <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
            {["all", "beach", "culture", "family", "adventure", "luxury"].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors backdrop-blur-md",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-hairline bg-white/70 text-foreground/75 hover:border-foreground/30 dark:bg-black/40 dark:text-white/70"
                )}
              >
                {c === "all" ? <Filter className="h-3 w-3" /> : <span className="h-1 w-1 rounded-full bg-current" />}
                {c}
              </button>
            ))}
          </div>

          {/* Mini legend */}
          <div className="absolute bottom-3 left-3 z-10 hidden items-center gap-3 rounded-full border border-hairline bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-foreground/80 backdrop-blur-md sm:flex dark:bg-black/40 dark:text-white/70">
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              {active ? activePin?.name : "Economy"}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              Premium
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-primary bg-background" />
              Selected
            </span>
          </div>

          {/* Level indicator */}
          <div className="absolute right-3 top-3 z-10 hidden rounded-xl border border-hairline bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-foreground/80 backdrop-blur-md sm:block dark:bg-black/40 dark:text-white/70">
            Estimated from {format(minX * 60)} – {format(maxX * 60)} per person
          </div>

          {/* Pins */}
          {filtered.map((pin) => {
            const isActive = active === pin.slug;
            const priceLevel = pin.price > 5 ? "premium" : "economy";
            return (
              <button
                key={pin.slug}
                onClick={() => setActive(isActive ? null : pin.slug)}
                aria-label={`Show ${pin.name}`}
                style={{ left: `${((pin.x - minX) / (maxX - minX || 1)) * 78 + 8}%`, top: `${((pin.y - minY) / (maxY - minY || 1)) * 70 + 12}%` }}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="relative grid h-8 w-8 place-items-center">
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-125",
                      priceLevel === "premium" ? "bg-gold/90" : "bg-primary/90",
                      isActive && "ring-4 ring-primary/30"
                    )}
                  />
                  <span className="absolute inset-1.5 rounded-full bg-background/90" style={{ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.6)" }} />
                  <MapPin className="relative h-3.5 w-3.5 text-foreground" />
                </span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-hairline bg-foreground/90 px-3 py-1 text-[11px] font-bold text-background backdrop-blur-md dark:bg-black/70 dark:text-white"
                    >
                      {format(pin.price)} · {pin.name}
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground/90 dark:border-t-black/70" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}

          <p className="pointer-events-none absolute inset-0 grid place-items-center text-[10px] uppercase tracking-[0.3em] text-foreground/10 dark:text-white/10">
            Reaori world
          </p>

          {/* Active card */}
          <AnimatePresence>
            {activePin && activeDest && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="absolute bottom-3 right-3 z-20 w-64 overflow-hidden rounded-2xl border border-hairline bg-card/95 shadow-card backdrop-blur-xl"
              >
                <div className="relative h-24">
                  <Image src={activeDest.image} alt={activeDest.name} fill sizes="256px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <button
                    onClick={() => setActive(null)}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
                    aria-label="Close"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-3 text-lg font-bold text-white">{format(activePin.price)}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">{activeDest.name}</p>
                    <StarRating rating={activeDest.rating} size={11} showValue={false} />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{activeDest.tagline}</p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/destinations/${activePin.slug}`}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-primary/15 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
                    >
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={`/packages/${activePin.slug}`}
                      className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-hairline text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                    >
                      Package
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* List */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Destinations</h3>
          <Badge variant="outline">{filtered.length} shown</Badge>
        </div>
        <ul className="mt-4 space-y-2">
          {sorted.map((pin) => {
            const d = DESTINATIONS.find((x) => x.slug === pin.slug);
            if (!d) return null;
            const isActive = active === pin.slug;
            return (
              <li key={pin.slug}>
                <Link
                  href={`/destinations/${pin.slug}`}
                  onMouseEnter={() => setActive(pin.slug)}
                  onMouseLeave={() => setActive((a) => (a === pin.slug ? null : a))}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300",
                    isActive ? "border-primary bg-primary/10 shadow-glow" : "border-transparent hover:border-hairline hover:bg-surface/70"
                  )}
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image src={d.image} alt={d.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{d.name}</p>
                    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Plane className="h-3 w-3" />
                      {d.durationDays} days · {d.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{format(pin.price)}</p>
                    <StarRating rating={d.rating} size={10} showValue={false} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}