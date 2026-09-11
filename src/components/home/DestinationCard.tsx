"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, CalendarDays, ArrowRight, Eye, Scale, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Snackbar } from "@/components/ui/snackbar";
import { CATEGORY_LABELS, type Destination } from "@/data/travelData";
import { useCompare } from "@/components/compare/compare-context";
import { useSettings } from "@/context/SettingsContext";

interface DestinationCardProps {
  destination: Destination;
  index: number;
  onQuickView: (destination: Destination) => void;
}

interface Notice {
  id: number;
  message: string;
  variant: "info" | "success" | "warn";
}

export function DestinationCard({ destination, index, onQuickView }: DestinationCardProps) {
  const { isPinned, togglePin } = useCompare();
  const pinnedItems = isPinned(destination.slug);
  const [notice, setNotice] = useState<Notice | null>(null);
  const { format } = useSettings();

  const handlePin = () => {
    const name = destination.name;
    if (pinnedItems) {
      togglePin(destination);
      setNotice({ id: Date.now(), message: `${name} removed from compare`, variant: "info" });
      return;
    }
    const result = togglePin(destination);
    if (result.status === "full") {
      setNotice({
        id: Date.now(),
        message: `Only ${result.max} packages can be compared — remove one to pin ${name}`,
        variant: "warn",
      });
    } else {
      setNotice({ id: Date.now(), message: `${name} pinned for comparison`, variant: "success" });
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-card transition-colors duration-300 hover:border-primary/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.name} tour`}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/10" />

        <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] gap-1.5 overflow-hidden">
          {destination.categories.slice(0, 2).map((c) => (
            <Badge key={c} variant="glass">
              {CATEGORY_LABELS[c]}
            </Badge>
          ))}
        </div>

        <span className="absolute right-3 top-3 z-[1] inline-flex items-center gap-1.5 self-center rounded-full border border-slate-200/50 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:text-white">
          <Star size={14} className="shrink-0 fill-amber-400 text-amber-400" aria-hidden />
          {destination.rating.toFixed(1)}
        </span>

        <WishlistButton
          slug={destination.slug}
          size="sm"
          className="absolute right-3 top-14"
        />

        <button
          onClick={handlePin}
          aria-label={
            pinnedItems
              ? `Remove ${destination.name} from comparison`
              : `Add ${destination.name} to comparison`
          }
          aria-pressed={pinnedItems}
          title={pinnedItems ? "Remove from compare" : "Pin to compare"}
          className={`absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 ${
            pinnedItems
              ? "border-primary bg-primary text-primary-foreground shadow-glow"
              : "border-foreground/25 bg-black/40 text-white hover:border-primary hover:text-primary"
          }`}
        >
          <Scale className="h-4 w-4" />
        </button>

        {destination.availableSpots <= 10 && (
          <Badge variant="gold" className="absolute bottom-3 right-3">
            Only {destination.availableSpots} spots left
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-foreground">
              {destination.name}
            </h3>
            <p className="truncate text-sm text-muted-foreground">{destination.country}</p>
          </div>
          <p className="flex shrink-0 flex-col items-end">
            <span className="text-xs text-muted-foreground line-through">
              {format(destination.oldPrice)}
            </span>
            <span className="text-lg font-bold text-primary">
              {format(destination.price)}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <CalendarDays className="h-3.5 w-3.5" />
            {destination.durationDays} days
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Users className="h-3.5 w-3.5" />
            {destination.reviewCount.toLocaleString("en-US")} reviews
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {destination.tagline}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => onQuickView(destination)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-hairline bg-surface/70 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary"
          >
            <Eye className="h-4 w-4" />
            Quick view
          </button>
          <Link
            href={`/packages/${destination.slug}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:bg-primary/90"
          >
            Explore Package
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Snackbar notice={notice} onDismiss={() => setNotice(null)} />
    </motion.article>
  );
}