"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TESTIMONIALS } from "@/data/travelData";

export function Testimonials() {
  return (
    <section className="relative scroll-mt-20 py-24">
      <div className="pointer-events-none absolute right-0 top-12 h-72 w-[30rem] rounded-full bg-gold/[0.07] blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Traveler Stories"
          title="Loved by 12,000+ explorers"
          description="Real reviews from travelers who trusted REAORI with their once-in-a-lifetime trips."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((review, index) => (
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col gap-4 rounded-2xl border border-hairline bg-card p-6 shadow-card"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "h-4 w-4 fill-gold text-gold"
                        : "h-4 w-4 fill-white/15 text-white/15"
                    }
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-muted-foreground">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-hairline pt-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-1 ring-primary/30">
                  {review.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{review.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {review.location} · {review.trip}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}