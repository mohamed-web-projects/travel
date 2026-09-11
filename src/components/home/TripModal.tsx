"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  MapPin,
  CalendarDays,
  Users,
  Check,
  ArrowRight,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/components/compare/compare-context";
import { CATEGORY_LABELS, type Destination } from "@/data/travelData";
import { formatPrice } from "@/lib/utils";

interface TripModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export function TripModal({ destination, onClose }: TripModalProps) {
  const { isPinned, togglePin } = useCompare();
  const pinnedItems = destination ? isPinned(destination.slug) : false;

  useEffect(() => {
    if (!destination) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [destination, onClose]);

  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${destination.name} quick view`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-hairline bg-background shadow-2xl"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r" />
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-foreground/25 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {destination.categories.map((c) => (
                    <Badge key={c} variant="glass">
                      {CATEGORY_LABELS[c]}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground">{destination.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {destination.country}
                    </p>
                  </div>
                  <Badge>
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {destination.rating}
                    <span className="text-muted-foreground">
                      ({destination.reviewCount.toLocaleString("en-US")})
                    </span>
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {destination.description}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {destination.durationDays} days
                  </span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Users className="h-4 w-4 text-primary" />
                    {destination.availableSpots} spots
                  </span>
                </div>

                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {destination.includes.slice(0, 4).map((inc) => (
                    <li key={inc} className="flex items-center gap-1.5 text-muted-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                      <span className="truncate">{inc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3 pt-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(destination.price)}{" "}
                        <span className="text-sm font-normal text-muted-foreground">/ person</span>
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-through">
                      {formatPrice(destination.oldPrice)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePin(destination)}
                      aria-pressed={pinnedItems}
                      className={`inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold transition-all duration-300 ${
                        pinnedItems
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-hairline bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <Scale className="h-4 w-4" />
                      {pinnedItems ? "Pinned" : "Compare"}
                    </button>
                    <Link
                      href={`/packages/${destination.slug}`}
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
                    >
                      Full itinerary
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}