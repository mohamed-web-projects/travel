"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Destination } from "@/data/travelData";
import { cn } from "@/lib/utils";

export function PackageGallery({ destination }: { destination: Destination }) {
  const [active, setActive] = useState(0);
  const images = destination.gallery;
  const allImages = [destination.image, ...images.filter((i) => i !== destination.image)];

  const step = (dir: number) =>
    setActive((prev) => (prev + dir + allImages.length) % allImages.length);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative aspect-[4/3] lg:aspect-[16/10]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={allImages[active]}
              alt={`${destination.name} photo ${active + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={active === 0}
              className="rounded-2xl border border-hairline object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => step(-1)}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-foreground/25 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => step(1)}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-foreground/25 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {active + 1} / {allImages.length}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 lg:grid-rows-2">
        {allImages.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setActive(i)}
            aria-label={`Select photo ${i + 1}`}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl border transition-all duration-300",
              active === i
                ? "border-primary shadow-glow"
                : "border-hairline opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="180px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
        {destination.categories.map((c) => (
          <Badge key={c} variant="glass">
            {c}
          </Badge>
        ))}
        <Badge>
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          {destination.rating}
          <span className="text-muted-foreground">({destination.reviewCount.toLocaleString("en-US")} reviews)</span>
        </Badge>
        <Badge variant="outline" className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {destination.country}
        </Badge>
      </div>
    </div>
  );
}