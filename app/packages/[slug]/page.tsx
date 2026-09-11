import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, ChevronRight, MapPin, CalendarDays, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PackageGallery } from "@/components/packages/PackageGallery";
import { BookingSidebar } from "@/components/packages/BookingSidebar";
import { CATEGORY_LABELS, DESTINATIONS } from "@/data/travelData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = DESTINATIONS.find((d) => d.slug === slug);
  return {
    title: destination ? `${destination.name} Tour` : "Package",
    description: destination?.description,
  };
}

export default async function PackagePage({ params }: PageProps) {
  const { slug } = await params;
  const destination = DESTINATIONS.find((d) => d.slug === slug);
  if (!destination) notFound();

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#tours" className="transition-colors hover:text-primary">
            Tours
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{destination.name}</span>
        </nav>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {destination.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {destination.country}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {destination.categories.map((c) => (
              <Badge key={c} variant="outline">
                {CATEGORY_LABELS[c]}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="flex flex-col gap-10">
            <PackageGallery destination={destination} />

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">About this tour</h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                {destination.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="glass" className="px-4 py-2 text-sm">
                  <CalendarDays className="h-4 w-4" />
                  {destination.durationDays} days
                </Badge>
                <Badge variant="glass" className="px-4 py-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  {destination.availableSpots} spots available
                </Badge>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Trip highlights</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-xl border border-hairline bg-card px-4 py-3"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">What&apos;s included</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {destination.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    {inc}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-foreground">Day-by-day itinerary</h2>
              <ol className="relative space-y-6 border-l-2 border-primary/25 pl-8">
                {destination.itinerary.map((day) => (
                  <li key={day.day} className="relative">
                    <span className="absolute -left-[41px] top-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-4 ring-background">
                      {day.day}
                    </span>
                    <h3 className="text-base font-bold text-foreground">Day {day.day} — {day.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {day.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <BookingSidebar destination={destination} />
        </div>
      </div>

      <section className="border-t border-hairline bg-black/60 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">Keep exploring</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {DESTINATIONS.slice(0, 3).map((d) => (
              <Link
                key={d.slug}
                href={`/packages/${d.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-hairline"
              >
                <Image
                  src={d.image}
                  alt={`${d.name} tour`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="text-lg font-bold text-white">{d.name}</p>
                  <p className="text-xs text-white/70">{d.durationDays} days</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}