"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GALLERY_IMAGES } from "@/data/travelData";

export function HomeGallery() {
  const teaser = GALLERY_IMAGES.slice(0, 6);

  return (
    <section id="gallery" className="cvi relative scroll-mt-20 py-24">
      <div className="pointer-events-none absolute left-0 bottom-0 hidden h-72 w-[30rem] rounded-full bg-primary/10 blur-[120px] md:block" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our Gallery"
            title="Moments from the road"
            description="A glimpse of the light, colour and culture that await."
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="shrink-0"
          >
            <Link
              href="/gallery"
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-hairline px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              View full gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-10">
          <GalleryGrid images={teaser} className="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}