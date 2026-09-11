"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Users, CalendarDays, BedDouble, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ACCOMMODATION_TIERS, DESTINATIONS, type AccommodationTier } from "@/data/travelData";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

export function BudgetCalculator() {
  const [slug, setSlug] = useState(DESTINATIONS[0].slug);
  const [groupSize, setGroupSize] = useState(2);
  const [days, setDays] = useState(7);
  const [tier, setTier] = useState<AccommodationTier>("comfort");
  const { format } = useSettings();

  const destination = DESTINATIONS.find((d) => d.slug === slug)!;
  const tierMeta = ACCOMMODATION_TIERS[tier];
  const nights = Math.max(1, days - 1);

  const estimate = useMemo(() => {
    const packageBase = destination.price * tierMeta.multiplier;
    const stay = nights * tierMeta.dailyBase;
    const perPerson = packageBase + stay;
    const total = perPerson * groupSize;
    return { packageBase, stay, perPerson, total };
  }, [destination, tierMeta, nights, groupSize]);

  return (
    <section id="planner" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trip Planner"
          title="Estimate your journey budget"
          description="Pick a destination, group size, days and stay tier — get a live all-in estimate in seconds."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass space-y-7 rounded-3xl p-6 sm:p-8"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
              Destination
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-12 rounded-xl border border-hairline bg-muted px-4 text-sm font-medium text-foreground outline-none focus:border-primary/50"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} — from {format(d.price)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Travelers · {groupSize}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  aria-label="Group size"
                  className="h-11 w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <span>1</span>
                  <span>12</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Days · {days}
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={14}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  aria-label="Trip length in days"
                  className="h-11 w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <span>3d</span>
                  <span>14d</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <BedDouble className="h-4 w-4 text-primary" />
                Stay tier
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(ACCOMMODATION_TIERS) as AccommodationTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    aria-pressed={tier === t}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left transition-all duration-300",
                      tier === t
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-hairline bg-surface/50 hover:border-foreground/25"
                    )}
                  >
                    <p className="text-sm font-bold text-foreground">
                      {ACCOMMODATION_TIERS[t].label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {ACCOMMODATION_TIERS[t].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-transparent to-gold/10 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/20 text-primary">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">Live estimate</h3>
                <p className="text-xs text-muted-foreground">
                  {destination.name} · {days} days · {groupSize} traveler{groupSize > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${slug}-${tier}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3 rounded-2xl border border-hairline bg-background/60 p-5"
              >
                {[
                  { label: "Package + tours", value: format(estimate.packageBase * groupSize) },
                  { label: `${nights} nights · ${tierMeta.label} stays`, value: format(estimate.stay * groupSize) },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <span className="truncate pr-3">{row.label}</span>
                    <span className="shrink-0 font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
                <div className="h-px bg-hairline" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Per person
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {format(estimate.perPerson)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Total
                    </p>
                    <p className="text-3xl font-bold text-gradient">
                      {format(estimate.total)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              Request this itinerary
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Estimates exclude flights on some routes. Final quote confirmed by an advisor.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}