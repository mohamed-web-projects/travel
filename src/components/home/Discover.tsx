"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, PlayCircle, Ship, Plane, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";

const cards = [
  {
    title: "Cruises",
    description: "Symphony of the seas — island-hopping itineraries with all-inclusive dining.",
    rating: 5,
    image: "/images/section2-1.jpg",
    href: "/#tours",
    icon: Ship,
  },
  {
    title: "Flights",
    description: "Priority lounge access and seamless connections on every package route.",
    rating: 4,
    image: "/images/section2-2.jpg",
    href: "/#tours",
    icon: Plane,
  },
];

export function Discover() {
  return (
    <section id="info" className="cvi relative scroll-mt-20 overflow-hidden py-24">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/section2.jpg"
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-5"
          >
            <SectionHeading
              align="left"
              eyebrow="Why REAORI"
              title="Discover the world in a new way"
              description="From private cruises along the palm-fringed coastlines to business-class flights that arrive refreshed — every mile is a curated moment."
            />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#tours"
                className="group inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-foreground/20 bg-surface/70 px-7 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1]"
              >
                <PlayCircle className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                Watch the video
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-hairline shadow-card"
              >
                <Image
                  src={card.image}
                  alt={`${card.title} experience`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-6 text-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <card.icon className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold uppercase text-foreground">{card.title}</h3>
                  <p className="max-w-[16rem] text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < card.rating
                            ? "h-4 w-4 fill-primary text-primary"
                            : "h-4 w-4 fill-white/20 text-white/20"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-4 left-5 flex items-center gap-2 text-foreground">
                  <card.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold uppercase tracking-wide">{card.title}</h3>
                  <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}