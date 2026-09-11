import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Users, CalendarDays } from "lucide-react";
import { DESTINATIONS } from "@/data/travelData";
import { DESTINATION_EXTRA } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { DestinationPageClient } from "@/components/destinations/DestinationPageClient";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const d = DESTINATIONS.find((dest) => dest.slug === id);
  return { title: d ? d.name : "Destination", description: d?.tagline };
}

export default async function DestinationPage({ params }: Props) {
  const { id } = await params;
  const destination = DESTINATIONS.find((d) => d.slug === id);
  const extra = DESTINATION_EXTRA[id];
  if (!destination || !extra) notFound();

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/map" className="transition-colors hover:text-primary">Destinations</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{destination.name}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{destination.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {destination.country}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                priority
                sizes="(max-width:1024px)100vw,60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{destination.name}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-white/80">
                    <CalendarDays className="h-4 w-4" />
                    {destination.durationDays} days
                    <Users className="ml-2 h-4 w-4" />
                    {destination.availableSpots} spots left
                  </p>
                </div>
                <Badge variant="glass" className="gap-1 px-3 py-1.5 text-sm text-white">
                  {formatPrice(destination.price)}
                  <span className="text-white/60">/person</span>
                </Badge>
              </div>
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{destination.description}</p>

            <DestinationPageClient id={id} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-5 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-background to-gold/10 p-6 shadow-card">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(destination.price)}
                    <span className="text-sm font-normal text-muted-foreground"> / person</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-through">{formatPrice(destination.oldPrice)}</p>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                {destination.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    {inc}
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout?d=${destination.slug}`}
                className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
              >
                Book this tour
              </Link>

              <p className="text-center text-[11px] text-muted-foreground">
                Free cancellation within 48h · advisor confirms in hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}