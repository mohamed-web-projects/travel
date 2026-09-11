"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Info,
  ShieldCheck,
  Star,
  Upload,
  X,
} from "lucide-react";
import {
  DESTINATION_EXTRA,
  REVIEWS,
  getBreakdown,
  type DestinationExtra,
  type Review,
} from "@/data/mockData";
import { DESTINATIONS } from "@/data/travelData";
import { StarRating } from "@/components/ui/StarRating";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Weather widget                                                       */
/* ------------------------------------------------------------------ */

function WeatherIcon({
  condition,
  className,
}: {
  condition: DestinationExtra["weather"]["condition"];
  className?: string;
}) {
  const Icon =
    condition === "rain"
      ? CloudRain
      : condition === "storm"
        ? CloudLightning
        : condition === "cloud"
          ? Cloud
          : Sun;
  return <Icon className={className} />;
}

function WeatherWidget({ data }: { data: DestinationExtra["weather"] }) {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const c = (temp: number) =>
    unit === "C" ? `${temp}°` : `${Math.round(temp * 1.8 + 32)}°`;

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <WeatherIcon condition={data.condition} className="h-7 w-7" />
          </span>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {c(data.tempC)}
              <button
                onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                className="ml-2 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle temperature unit"
              >
                °{unit === "C" ? "F" : "C"}
              </button>
            </p>
            <p className="text-xs text-muted-foreground">Currently</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Thermometer className="h-3.5 w-3.5 text-primary" />
            {c(data.hi)} / {c(data.lo)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5 text-primary" />
            {data.humidity}%
          </span>
          <span className="inline-flex items-center gap-1">
            <Wind className="h-3.5 w-3.5 text-primary" />
            {data.wind} km/h
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {data.forecast.map((d) => (
          <div
            key={d.day}
            className="flex flex-col items-center gap-1 rounded-xl border border-hairline bg-surface/50 py-3"
          >
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">
              {d.day}
            </span>
            <WeatherIcon condition={d.condition} className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-foreground">{c(d.tempC)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews section                                                      */
/* ------------------------------------------------------------------ */

function ReviewsSection({ slug }: { slug: string }) {
  const reviews = REVIEWS[slug] ?? [];
  const { buckets, total, average } = getBreakdown(slug);
  const [filter, setFilter] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const filtered = filter === null ? reviews : reviews.filter((r) => r.rating === filter);

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="shrink-0 text-center">
          <p className="text-5xl font-bold text-foreground">{average.toFixed(1)}</p>
          <StarRating rating={average} size={18} showValue={false} />
          <p className="mt-2 text-xs text-muted-foreground">
            {total} verified review{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 space-y-2">
          {buckets.map(({ star, count }) => (
            <button
              key={star}
              onClick={() => setFilter(filter === star ? null : star)}
              aria-pressed={filter === star}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className="w-6 text-right text-xs font-bold text-muted-foreground">
                {star}★
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right text-[11px] text-muted-foreground">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[null, 5, 4, 3].map((star) => (
          <button
            key={String(star)}
            onClick={() => setFilter(star)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              filter === star
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline text-muted-foreground hover:border-foreground/25"
            )}
          >
            {star === null ? "All" : `${star}★`}
          </button>
        ))}
        <label className="ml-auto inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
          <Upload className="h-3.5 w-3.5" />
          Add photo
          <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
        </label>
      </div>

      {preview && (
        <div className="relative mt-4 inline-block">
          <Image
            src={preview}
            alt="Your upload"
            width={120}
            height={80}
            className="h-20 rounded-xl object-cover"
          />
          <button
            onClick={() => { URL.revokeObjectURL(preview); setPreview(null); }}
            className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-black text-[10px] text-white"
            aria-label="Remove preview"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {filtered.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No reviews match this filter.</p>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-hairline bg-card p-5">
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
          style={{ background: review.avatarBg }}
        >
          {review.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-foreground">{review.name}</span>
            {review.verified && (
              <Badge variant="gold" className="shrink-0 gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {review.country} · {review.date}
          </p>
        </div>
        <StarRating rating={review.rating} size={12} showValue={false} />
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{review.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main destination client view                                        */
/* ------------------------------------------------------------------ */

interface DestinationPageClientProps {
  id: string;
}

export function DestinationPageClient({ id }: DestinationPageClientProps) {
  const destination = DESTINATIONS.find((d) => d.slug === id)!;
  const extra = DESTINATION_EXTRA[id];

  if (!destination || !extra) return null;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-2">
        {destination.categories.map((c) => (
          <Badge key={c} variant="outline">{c}</Badge>
        ))}
        <WishlistButton slug={destination.slug} size="sm" className="ml-auto" />
      </div>

      <WeatherWidget data={extra.weather} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 rounded-3xl border border-hairline bg-card p-6 sm:grid-cols-3"
      >
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Climate</h4>
          <p className="mt-1 text-sm text-foreground">{extra.climate}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Best time</h4>
          <p className="mt-1 text-sm text-foreground">
            {extra.bestTime.from} – {extra.bestTime.to}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{extra.bestTime.note}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visa</h4>
          <p className="mt-1 text-sm text-foreground">{extra.visa.type}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{extra.visa.note}</p>
        </div>
      </motion.div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Local guidelines</h3>
        <ul className="space-y-2">
          {extra.guidelines.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {g}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Top attractions nearby</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {extra.attractions.map((attr) => (
            <div
              key={attr.name}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-card"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={attr.image}
                  alt={attr.name}
                  fill
                  sizes="(max-width:640px)100vw,33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-sm font-bold text-white">{attr.name}</p>
                  <p className="text-[11px] text-white/70">
                    {attr.kind} · {attr.distance}
                  </p>
                </div>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                  <Star className="h-3 w-3 fill-gold text-gold" />
                  {attr.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-hairline bg-card p-6">
        <h3 className="mb-4 text-lg font-bold text-foreground">Reviews & ratings</h3>
        <ReviewsSection slug={destination.slug} />
      </div>
    </div>
  );
}