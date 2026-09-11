import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GALLERY_IMAGES } from "@/data/travelData";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse highlights from REAORI trips across four continents.",
};

export default function GalleryPage() {
  return (
    <section className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Gallery"
          title="Photo gallery"
          description="Click any photo to open the full-screen viewer. All shots are captured on REAORI trips."
        />
        <div className="mt-12">
          <GalleryGrid
            images={GALLERY_IMAGES}
            className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>
    </section>
  );
}