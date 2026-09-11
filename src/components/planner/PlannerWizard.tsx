"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Users,
  Sparkles,
  RefreshCw,
  Clock3,
  Check,
  Coffee,
  Sunrise,
  Moon,
  Wallet,
} from "lucide-react";
import {
  DESTINATIONS,
  type Destination,
} from "@/data/travelData";
import {
  DESTINATION_EXTRA,
  PLANNER_BUDGETS,
  PLANNER_STYLES,
  generateItinerary,
  type PlannerBudget,
  type PlannerStyle,
} from "@/data/mockData";
import { useSettings } from "@/context/SettingsContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Step = "destination" | "style" | "budget" | "result";

const STEPS: { id: Step; label: string }[] = [
  { id: "destination", label: "Destination" },
  { id: "style", label: "Travel style" },
  { id: "budget", label: "Budget & days" },
  { id: "result", label: "Your plan" },
];

const DAY_ICONS = [Sunrise, Coffee, Moon];

export function PlannerWizard() {
  const { format } = useSettings();
  const [step, setStep] = useState<Step>("destination");
  const [slug, setSlug] = useState(DESTINATIONS[0].slug);
  const [style, setStyle] = useState<PlannerStyle>("adventure");
  const [budget, setBudget] = useState<PlannerBudget>("balanced");
  const [tripDays, setTripDays] = useState(6);
  const [travelers, setTravelers] = useState(2);
  const [think, setThink] = useState(false);
  const [resultSeed, setResultSeed] = useState(0);

  const destination = DESTINATIONS.find((d) => d.slug === slug)!;
  const extra = DESTINATION_EXTRA[slug];

  if (!extra) return null;

  const generateOnce = () => {
    setThink(true);
    setTimeout(() => {
      setThink(false);
      setResultSeed(Date.now());
      setStep("result");
    }, 1100);
  };

  return (
    <div className="space-y-10">
      {/* Stepper */}
      <ol className="flex flex-wrap items-center gap-2">
        {STEPS.map(({ id, label }, i) => {
          const order = ["destination", "style", "budget", "result"].indexOf(id);
          const currentOrder = ["destination", "style", "budget", "result"].indexOf(step);
          const done = order < currentOrder;
          return (
            <li key={id} className="flex items-center gap-2">
              <button
                onClick={() => done && setStep(id)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                  id === step
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : done
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-hairline text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <span>{i + 1}</span>}
                {label}
              </button>
              {i < STEPS.length - 1 && (
                <span className={cn("h-px w-4", done ? "bg-primary/50" : "bg-hairline")} />
              )}
            </li>
          );
        })}
      </ol>

      {step === "destination" && (
        <motion.div
          key="destination"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 sm:p-8"
        >
            <h2 className="text-xl font-bold text-foreground">Where is this journey taking you?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick a destination — we handle the rest.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.slug}
                  onClick={() => { setSlug(d.slug); setStep("style"); }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border text-left transition-all duration-300",
                    slug === d.slug ? "border-primary shadow-glow" : "border-hairline hover:border-foreground/25"
                  )}
                >
                  <div className="relative aspect-[16/10]">
                    <Image src={d.image} alt={d.name} fill sizes="(max-width:640px)100vw,33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-bold text-white">{d.name}</p>
                      <p className="text-[11px] text-white/70">{d.country}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "style" && (
          <motion.div
            key="style"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">What kind of traveler are you?</h2>
                <p className="mt-1 text-sm text-muted-foreground">{destination.name} · designed around your rhythm.</p>
              </div>
              <button
                onClick={() => setStep("destination")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Change
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PLANNER_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  aria-pressed={style === s.id}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300",
                    style === s.id
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-hairline bg-surface/50 hover:border-foreground/25"
                  )}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span>
                    <span className="block text-sm font-bold text-foreground">{s.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{s.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep("budget")}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
            >
              Continue
              <CalendarDays className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {step === "budget" && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass space-y-8 rounded-3xl p-6 sm:p-8"
          >
            <div>
              <h2 className="text-xl font-bold text-foreground">Budget & days</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We’ll produce a day-by-day plan with live estimates.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-background/50 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Length · {tripDays} days
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={14}
                  value={tripDays}
                  onChange={(e) => setTripDays(Number(e.target.value))}
                  className="h-11 w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <span>3d</span>
                  <span>14d</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-background/50 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Travelers · {travelers}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="h-11 w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <Wallet className="h-4 w-4 text-primary" />
                Budget per person
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {PLANNER_BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    aria-pressed={budget === b.id}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-all duration-300",
                      budget === b.id
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-hairline bg-surface/50 hover:border-foreground/25"
                    )}
                  >
                    <p className="text-sm font-bold text-foreground">{b.label}</p>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {format(b.min)} – {format(b.max)}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{b.blurb}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateOnce}
              disabled={think}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:opacity-70 sm:w-auto"
            >
              {think ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Crafting your plan…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate my itinerary
                </>
              )}
            </button>
          </motion.div>
        )}

        {step === "result" && (
          <ResultView
            key={resultSeed}
            destination={destination}
            style={style}
            budget={budget}
            tripDays={tripDays}
            travelers={travelers}
            onRegenerate={generateOnce}
            onBack={() => setStep("budget")}
            format={format}
          />
        )}
    </div>
  );
}

interface ResultProps {
  destination: Destination;
  style: PlannerStyle;
  budget: PlannerBudget;
  tripDays: number;
  travelers: number;
  onRegenerate: () => void;
  onBack: () => void;
  format: (n: number) => string;
}

function ResultView({ destination, style, budget, tripDays, travelers, onRegenerate, onBack, format }: ResultProps) {
  const plan = generateItinerary(style, tripDays, budget);
  const extra = DESTINATION_EXTRA[destination.slug];
  const total = plan.estPerPerson * travelers;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-background to-gold/10 p-6 sm:p-8">
        <div>
          <Badge variant="gold" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI-crafted
          </Badge>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            {destination.name} · <span className="text-gradient">{plan.title}</span>
          </h2>
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              {destination.country}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-4 w-4 text-primary" />
              {tripDays} days
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              {travelers} traveler{travelers > 1 ? "s" : ""}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">All-in estimate</p>
          <p className="text-3xl font-bold text-gradient">{format(total)}</p>
          <p className="text-[11px] text-muted-foreground">{format(plan.estPerPerson)} per person</p>
        </div>
      </div>

      <div className="space-y-4">
        {plan.days.map((day) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: day.day * 0.05 }}
            className="rounded-3xl border border-hairline bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Day {day.day}</p>
              <Badge variant="outline">{day.title}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-[24px_1fr] gap-2">
              <div className="flex flex-col items-center">
                {DAY_ICONS.map((Icon, i) => (
                  <span key={i} className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                    {i < 2 && day.day < tripDays && <span className="sr-only">·</span>}
                  </span>
                ))}
              </div>
              <div className="space-y-4">
                <PlanRow label="Morning" time="8:00 – 12:00" text={day.morning} />
                <PlanRow label="Afternoon" time="12:00 – 17:00" text={day.afternoon} />
                <PlanRow label="Evening" time="17:00 – 22:00" text={day.evening} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Coffee className="h-3.5 w-3.5" />
              {day.meals} meals included
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onBack}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairline px-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          Adjust inputs
        </button>
        <button
          onClick={onRegenerate}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairline px-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          New suggestions
        </button>
        <Link
          href={`/checkout?d=${destination.slug}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" />
          Book this trip
        </Link>
        {extra && extra.attractions.length > 0 && (
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore {destination.name} →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function PlanRow({ label, time, text }: { label: string; time: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-foreground">
        {label}
        <span className="ml-2 font-medium text-muted-foreground">{time}</span>
      </p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}