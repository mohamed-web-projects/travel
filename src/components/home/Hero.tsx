"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MapPin, Calendar, Users, ArrowRight, PlayCircle, Compass } from "lucide-react";
import { SearchFilterBar } from "./SearchFilterBar";

let mounted = false;
const listeners = new Set<() => void>();
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => void listeners.delete(callback);
}
function notify() {
  listeners.forEach((l) => l());
}
function getSnapshot() {
  return mounted;
}
function getServerSnapshot() {
  return false;
}
if (typeof window !== "undefined") {
  setTimeout(() => {
    mounted = true;
    notify();
  }, 0);
}

function useIsMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function Hero() {
  const isMounted = useIsMounted();
  const prefersReduced = useReducedMotion();
  const isDesktop =
    isMounted &&
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches;
  const enableParallax = isDesktop && !prefersReduced;

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const content = (delay: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReduced ? 0 : 0.7, delay, ease: "easeOut" as const },
  });

  const bgImage = (
    <>
      <Image
        src="/images/landing.jpg"
        alt="Tropical paradise at golden hour"
        fill
        priority
        sizes="100vw"
        quality={75}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background dark:from-background/70 dark:via-background/45 dark:to-background" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent dark:from-primary/20" />
    </>
  );

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen scroll-mt-20 items-center justify-center overflow-hidden"
    >
      {enableParallax ? (
        <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
          {bgImage}
        </motion.div>
      ) : (
        <div className="absolute inset-0 -z-10">{bgImage}</div>
      )}

      <motion.div
        style={enableParallax ? { opacity: fade } : undefined}
        className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-24 pb-16 text-center sm:px-6 lg:px-8"
      >
        <motion.span
          {...content(0.1)}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-accent"
        >
          <Compass className="h-4 w-4" />
          Discover the world in a new way
        </motion.span>

        <motion.div
          {...content(0.2)}
          className="relative mt-6 rounded-3xl px-6 py-8 sm:px-12 sm:py-10"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-3xl bg-white/80 backdrop-blur-md ring-1 ring-inset ring-black/5 dark:bg-slate-950/80 dark:ring-white/10"
          />
          <h1 className="max-w-4xl text-5xl font-bold uppercase leading-[1.05] tracking-tight text-balance text-slate-950 sm:text-7xl lg:text-8xl dark:text-white">
            Travel <span className="text-gradient">time</span> starts here
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-700 dark:text-white/80">
            Hand-crafted tours from the Great Wall to the dunes of Qatar — flights,
            stays and guided journeys, one seamless booking.
          </p>
        </motion.div>

        <motion.div {...content(0.46)} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#tours"
            className="group inline-flex h-13 items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:bg-primary/90"
          >
            Explore packages
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/gallery"
            className="group inline-flex h-13 items-center gap-2 whitespace-nowrap rounded-xl border border-foreground/20 bg-surface/70 px-8 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1]"
          >
            <PlayCircle className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            Watch the film
          </Link>
        </motion.div>

        <motion.div {...content(0.58)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: MapPin, label: "18 Countries", sub: "4 continents" },
            { icon: Calendar, label: "9 Days max", sub: "fast itineraries" },
            { icon: Users, label: "12K+ travelers", sub: "98% recommend" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="glass flex items-center gap-3 rounded-2xl px-5 py-3 text-left"
            >
              <Icon className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-bold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <SearchFilterBar />
      </motion.div>
    </section>
  );
}