"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Car,
  Camera,
  Wifi,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  ShieldCheck,
  Ticket,
  CheckCheck,
  CreditCard,
  Wallet,
  Landmark,
  Loader2,
} from "lucide-react";
import {
  DESTINATIONS,
  ACCOMMODATION_TIERS,
  type AccommodationTier,
} from "@/data/travelData";
import { ADDONS, INSURANCE_PLANS, PAYMENT_METHODS } from "@/data/mockData";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

const DATES = ["Mar 14, 2026", "Apr 02, 2026", "May 09, 2026", "May 23, 2026", "Jun 13, 2026"];

const ADDON_ICONS: Record<string, typeof Car> = { transfer: Car, tour: Star, photo: Camera, sim: Wifi };
const PAY_ICONS: Record<string, typeof CreditCard> = { card: CreditCard, wallet: Wallet, bank: Landmark };

const ADDON_PER: Record<string, string> = {
  transfer: "per group",
  tour: "per person",
  photo: "per group",
  sim: "per person",
};

const STEPS = ["Trip details", "Add-ons & cover", "Payment", "Confirmed"];

const cardDigits = (e: string) => e.replace(/\D/g, "").slice(0, 16);

export function CheckoutWizard({ slug }: { slug?: string }) {
  const destination = DESTINATIONS.find((d) => d.slug === slug) ?? DESTINATIONS[0];
  const { format } = useSettings();

  const [step, setStep] = useState(0);
  const [date, setDate] = useState(DATES[0]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tier, setTier] = useState<AccommodationTier>("comfort");
  const [addonIds, setAddonIds] = useState<string[]>(["transfer"]);
  const [insurance, setInsurance] = useState("basic");
  const [payMethod, setPayMethod] = useState("card");
  const [paying, setPaying] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

  const travelers = adults + children;
  const tierMeta = ACCOMMODATION_TIERS[tier];
  const perPerson = Math.round(destination.price * tierMeta.multiplier);

  const totals = useMemo(() => {
    const pkg = perPerson * travelers;
    const addons = ADDONS.filter((a) => addonIds.includes(a.id)).reduce(
      (s, a) => s + a.price * (a.per === "person" ? travelers : 1),
      0
    );
    const ins =
      INSURANCE_PLANS.find((p) => p.id === insurance)?.price ?? 0;
    const fees = Math.round((pkg + addons + ins) * 0.05);
    return { pkg, addons, ins, fees, total: pkg + addons + ins + fees };
  }, [perPerson, travelers, addonIds, insurance]);

  const toggleAddon = (id: string) =>
    setAddonIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const next = () => {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const confirm = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setBookingCode(
        `REA-${destination.slug.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      );
      next();
    }, 1400);
  };

  const accepted = step >= 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
      {/* Steps column */}
      <div>
        <ol className="mb-8 flex flex-wrap items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i >= step}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                  i === step
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : i < step
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-hairline text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : <span>{i + 1}</span>}
                {label}
              </button>
              {i < STEPS.length - 1 && (
                <span className={cn("h-px w-4", i < step ? "bg-primary/50" : "bg-hairline")} />
              )}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section
              key="s0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="glass space-y-6 rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-28 overflow-hidden rounded-2xl">
                  <Image src={destination.image} alt={destination.name} fill sizes="112px" className="object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{destination.name}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {destination.durationDays} days · {destination.country}
                  </p>
                  <p className="text-sm font-bold text-primary">{format(destination.price)} / person</p>
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Departure</span>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 rounded-xl border border-hairline bg-muted px-4 text-sm font-medium text-foreground outline-none focus:border-primary/50"
                >
                  {DATES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <GalleryIcon /> Adults · {adults}
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="h-11 w-full accent-primary"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Children · {children}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={6}
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="h-11 w-full accent-primary"
                  />
                </label>
              </div>

              <fieldset>
                <legend className="mb-2 text-xs font-semibold text-muted-foreground">Stay tier</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(Object.keys(ACCOMMODATION_TIERS) as AccommodationTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      aria-pressed={tier === t}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-all duration-300",
                        tier === t
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-hairline bg-surface/50 hover:border-foreground/25"
                      )}
                    >
                      <p className="text-sm font-bold text-foreground">{ACCOMMODATION_TIERS[t].label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{ACCOMMODATION_TIERS[t].description}</p>
                    </button>
                  ))}
                </div>
              </fieldset>

              <StepNav step={0} onBack={back} onNext={next} nextLabel="Continue to add-ons" />
            </motion.section>
          )}

          {step === 1 && (
            <motion.section
              key="s1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="glass space-y-8 rounded-3xl p-6 sm:p-8"
            >
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Add-ons
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">Make the trip yours. Everything optional.</p>
                <div className="mt-4 space-y-3">
                  {ADDONS.map((a) => {
                    const Icon = ADDON_ICONS[a.icon];
                    const active = addonIds.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddon(a.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                          active ? "border-primary bg-primary/10 shadow-glow" : "border-hairline bg-surface/50 hover:border-foreground/25"
                        )}
                      >
                        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground")}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-foreground">{a.label}</span>
                          <span className="block text-xs text-muted-foreground">{a.description}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-sm font-bold text-foreground">{format(a.price)}</span>
                          <span className="block text-[10px] uppercase text-muted-foreground">{ADDON_PER[a.id]}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <ShieldCheck className="h-5 w-5 text-success" />
                  Travel protection
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {INSURANCE_PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setInsurance(p.id)}
                      aria-pressed={insurance === p.id}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-all duration-300",
                        insurance === p.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-hairline bg-surface/50 hover:border-foreground/25"
                      )}
                    >
                      <p className="text-sm font-bold text-foreground">{p.label}</p>
                      <p className="mt-0.5 text-xs font-semibold text-primary">{format(p.price)} / person</p>
                      <ul className="mt-2 space-y-1">
                        {p.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Check className="h-3 w-3 shrink-0 text-success" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>

              <StepNav step={1} onBack={back} onNext={next} nextLabel="Proceed to payment" />
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="s2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="glass space-y-6 rounded-3xl p-6 sm:p-8"
            >
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment method
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = PAY_ICONS[m.icon];
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayMethod(m.id)}
                        aria-pressed={payMethod === m.id}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 text-xs font-bold transition-all duration-300",
                          payMethod === m.id
                            ? "border-primary bg-primary/10 text-foreground shadow-glow"
                            : "border-hairline bg-surface/50 text-muted-foreground hover:border-foreground/25"
                        )}
                      >
                        <Icon className="h-6 w-6 text-primary" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {payMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 rounded-2xl border border-hairline bg-background/50 p-5"
                >
                  <CardNumberInput />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CardInput label="Cardholder name" placeholder="M. Wahib" />
                    <CardInput label="Card number" placeholder="4242 4242 4242 4242" numeric />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CardInput label="Expiry (MM/YY)" placeholder="12/28" numeric max={4} />
                    <CardInput label="CVC" placeholder="123" numeric max={3} />
                  </div>
                </motion.div>
              )}

              {payMethod === "wallet" && (
                <p className="rounded-2xl border border-hairline bg-background/50 p-5 text-sm text-muted-foreground">
                  You’ll be redirected to your wallet provider to approve the payment securely.
                </p>
              )}

              {payMethod === "bank" && (
                <div className="space-y-2 rounded-2xl border border-hairline bg-background/50 p-5 text-sm text-muted-foreground">
                  <p>REAORI Travel · NBE —</p>
                  <p className="font-mono font-bold text-foreground">EG 2000 0000 0000 0000 0000</p>
                  <p>Use booking reference <span className="font-semibold text-primary">REAORI-{destination.slug.toUpperCase()}</span> in the transfer note.</p>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" className="accent-primary" />
                I agree to the <span className="font-semibold text-primary">booking terms</span> and confirm the details above are correct.
              </label>

              <StepNav
                step={2}
                onBack={back}
                onNext={confirm}
                nextLabel="Pay now"
                loading={paying}
                nodiscount
              />
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="s3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center rounded-3xl border border-success/30 bg-success/[0.06] p-10 text-center"
            >
              <span className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
                <CheckCheck className="h-10 w-10" />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-foreground">Booking confirmed!</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your trip to {destination.name} on {date} is locked in. A PDF itinerary and receipt
                are on their way to your inbox.
              </p>
              <div className="mt-6 w-full max-w-sm space-y-2 rounded-2xl border border-hairline bg-background/60 p-5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Booking reference</span>
                  <span className="font-mono font-bold text-primary">{bookingCode}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Travelers</span>
                  <span className="font-semibold text-foreground">{adults} adult{adults > 1 ? "s" : ""}{children ? ` + ${children} child${children > 1 ? "ren" : ""}` : ""}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total paid</span>
                  <span className="text-lg font-bold text-foreground">{format(totals.total)}</span>
                </div>
              </div>
              <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
                >
                  <Ticket className="h-4 w-4" />
                  View my trips
                </Link>
                <Link
                  href={`/packages/${destination.slug}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-hairline px-6 text-sm font-semibold text-foreground transition-colors hover:border-foreground/25"
                >
                  Back to package
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Summary column */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-background to-gold/10 p-6 shadow-card">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Ticket className="h-5 w-5 text-primary" />
            Order summary
          </h3>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-hairline bg-background/60 p-3">
            <div className="relative h-14 w-20 overflow-hidden rounded-xl">
              <Image src={destination.image} alt={destination.name} fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{destination.name}</p>
              <p className="text-[11px] text-muted-foreground">{destination.durationDays} days · {tier} tier</p>
              <p className="text-[11px] text-muted-foreground">{date} · {travelers} traveler{travelers > 1 ? "s" : ""}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <dt>Package · {perPerson} × {travelers}</dt>
              <dd className="font-semibold text-foreground">{format(totals.pkg)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Add-ons</dt>
              <dd className="font-semibold text-foreground">{format(totals.addons)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Insurance · {INSURANCE_PLANS.find((p) => p.id === insurance)?.label}</dt>
              <dd className="font-semibold text-foreground">{format(totals.ins)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Taxes & fees (5%)</dt>
              <dd className="font-semibold text-foreground">{format(totals.fees)}</dd>
            </div>
          </dl>

          <div className="mt-4 space-y-2 border-t border-hairline pt-4">
            <div className="flex items-end justify-between">
              <span className="text-sm font-bold text-foreground">Total due</span>
              <span className="text-2xl font-bold text-gradient">{format(totals.total)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Free cancellation within 48h · secure checkout</p>
          </div>

          {accepted && step < 3 && (
            <button
              type="button"
              onClick={confirm}
              disabled={paying || step !== 2}
              className="mt-4 hidden w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:opacity-60 lg:inline-flex"
            >
              {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {paying ? "Processing…" : `Pay ${format(totals.total)}`}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function StepNav({
  step,
  onBack,
  onNext,
  nextLabel,
  loading,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  loading?: boolean;
  nodiscount?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-hairline px-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ChevronRight className="h-4 w-4" />{nextLabel}</>}
      </button>
    </div>
  );
}

function CardInput({
  label,
  placeholder,
  numeric,
  max,
}: {
  label: string;
  placeholder: string;
  numeric?: boolean;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        inputMode={numeric ? "numeric" : "text"}
        maxLength={max}
        onChange={(e) => numeric && (e.target.value = cardDigits(e.target.value))}
        className="h-12 rounded-xl border border-hairline bg-muted px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/50"
      />
    </label>
  );
}

function CardNumberInput() {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">Card number</span>
      <input
        placeholder="4242 4242 4242 4242"
        inputMode="numeric"
        maxLength={19}
        onChange={(e) => {
          const digits = cardDigits(e.target.value);
          e.target.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        }}
        className="h-12 rounded-xl border border-hairline bg-muted px-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/50"
      />
    </label>
  );
}

function GalleryIcon({ className }: { className?: string }) {
  return <CalendarDays className={cn("h-4 w-4 text-primary", className)} />;
}