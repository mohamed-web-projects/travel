"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NAV_OFFSET_PX = 80;
const INITIAL_DELAY_MS = 100;
const MAX_ATTEMPTS = 30;
const RETRY_MS = 60;
const CORRECT_AT_MS = [600, 1400];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    const id = hash.replace("#", "");
    let stopped = false;
    let attempts = 0;
    const timers: number[] = [];

    const scrollToTarget = (): boolean => {
      const el = document.getElementById(id);
      if (!el) return false;
      const top =
        el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return true;
    };

    const run = () => {
      if (stopped) return;
      if (scrollToTarget()) {
        return;
      }
      if (attempts < MAX_ATTEMPTS) {
        attempts += 1;
        timers.push(window.setTimeout(run, RETRY_MS));
      }
    };

    const realign = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const target =
        el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;
      if (Math.abs(window.scrollY - target) > 4) {
        window.scrollTo({
          top: target,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    };

    timers.push(window.setTimeout(run, INITIAL_DELAY_MS));
    CORRECT_AT_MS.forEach((ms) => timers.push(window.setTimeout(realign, ms)));

    return () => {
      stopped = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pathname]);

  return null;
}