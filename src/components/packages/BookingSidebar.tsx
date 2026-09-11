"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Users, Sparkles, ShieldCheck, Clock3 } from "lucide-react";
import { ACCOMMODATION_TIERS, type AccommodationTier, type Destination } from "@/data/travelData";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

const dates = [
  "Mar 14, 2026",
  "Apr 02, 2026",
  "May 09, 2026",
  "May 23, 2026",
  "Jun 13, 2026",
];

export function BookingSidebar({ destination }: { destination: Destination }) {
  const [travelers, setTravelers] = useState(2);
  const [date, setDate] = useState(dates[0]);
  const [tier, setTier] = useState<AccommodationTier>("comfort");
  const [booked, setBooked] = useState(false);
  const { format } = useSettings();

  const perPerson = useMemo(
    () =>
      Math.round(destination.price * ACCOMMODATION_TIERS[tier].multiplier),
    [destination, tier]
  );

  return (
    <aside className="h-fit self-start sticky top-24 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-background to-gold/10 p-6 shadow-card">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            From
          </p>
          <p className="text-3xl font-bold text-primary">
            {format(destination.price)}
            <span className="text-sm font-normal text-muted-foreground"> / person</span>
          </p>
        </div>
        <p className="text-sm text-muted-foreground line-through">
          {format(destination.oldPrice)}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
          Departure
          <span className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-hairline bg-muted pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary/50"
            >
              {dates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
          Travelers
          <span className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="h-11 w-full appearance-none rounded-xl border border-hairline bg-muted pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary/50"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "traveler" : "travelers"}
                </option>
              ))}
            </select>
          </span>
        </label>

        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold text-muted-foreground">
            Stay tier
          </legend>
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(ACCOMMODATION_TIERS) as AccommodationTier[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                aria-pressed={tier === t}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs font-bold transition-all duration-300",
                  tier === t
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : "border-hairline bg-surface/50 text-muted-foreground hover:border-foreground/25"
                )}
              >
                {ACCOMMODATION_TIERS[t].label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-5 space-y-2 rounded-2xl border border-hairline bg-background/70 p-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{destination.durationDays} days · {tier} tier</span>
          <span className="font-semibold text-foreground">
            {format(perPerson * travelers)}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Taxes & fees</span>
          <span className="font-semibold text-success">Included</span>
        </div>
        <div className="h-px bg-hairline" />
        <div className="flex items-end justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-gradient">
            {format(perPerson * travelers)}
          </span>
        </div>
      </div>

      <button
        onClick={() => setBooked(true)}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:bg-primary/90"
      >
        {booked ? (
          <>
            <Check className="h-4 w-4" />
            Request received
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Book this package
          </>
        )}
      </button>

      <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
          Free cancellation within 48h
        </li>
        <li className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 shrink-0 text-gold" />
          Personal advisor responds in a few hours
        </li>
      </ul>
    </aside>
  );
}