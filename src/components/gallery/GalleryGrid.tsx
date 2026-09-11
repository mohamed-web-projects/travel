"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { GalleryImage } from "@/data/travelData";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: GalleryImage[];
  className?: string;
}

export function GalleryGrid({ images, className }: GalleryGridProps) {
  const [active, setActive] = useState<number | null>(null);

  const step = (dir: number) =>
    setActive((prev) =>
      prev === null ? prev : (prev + dir + images.length) % images.length
    );

  return (
    <>
      <div className={cn("grid gap-4", className)}>
        {images.map((image, index) => (
          <motion.button
            key={image.src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
            onClick={() => setActive(index)}
            aria-label={`View ${image.title}`}
            className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-hairline bg-card"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="truncate text-sm font-bold text-white">{image.title}</p>
                <Expand className="h-4 w-4 shrink-0 text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && images[active] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`${images[active].title} enlarged`}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-foreground/25 bg-black/50 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
              className="absolute left-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-foreground/25 bg-black/50 text-white transition-colors hover:bg-black/80 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="my-auto flex w-full max-w-4xl flex-col items-center"
            >
              <Image
                src={images[active].src}
                alt={images[active].title}
                width={images[active].width}
                height={images[active].height}
                quality={90}
                priority
                className="h-auto max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <p className="mt-4 text-center text-sm font-semibold text-white">
                {images[active].title}{" "}
                <span className="text-muted-foreground">
                  · {active + 1}/{images.length}
                </span>
              </p>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
              className="absolute right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-foreground/25 bg-black/50 text-white transition-colors hover:bg-black/80 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}