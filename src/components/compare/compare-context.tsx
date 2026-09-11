"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Destination } from "@/data/travelData";

export const MAX_COMPARE = 3;

export type PinResult =
  | { status: "pinned" }
  | { status: "removed" }
  | { status: "full"; max: number };

interface CompareContextValue {
  pinned: Destination[];
  isPinned: (slug: string) => boolean;
  togglePin: (destination: Destination) => PinResult;
  clearPinned: () => void;
  canPinMore: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = useState<Destination[]>([]);

  const togglePin = useCallback(
    (destination: Destination): PinResult => {
      const exists = pinned.some((d) => d.slug === destination.slug);
      if (exists) {
        setPinned((prev) => prev.filter((d) => d.slug !== destination.slug));
        return { status: "removed" };
      }
      if (pinned.length >= MAX_COMPARE) {
        return { status: "full", max: MAX_COMPARE };
      }
      setPinned((prev) => [...prev, destination]);
      return { status: "pinned" };
    },
    [pinned]
  );

  const clearPinned = useCallback(() => setPinned([]), []);

  const isPinned = useCallback(
    (slug: string) => pinned.some((d) => d.slug === slug),
    [pinned]
  );

  const value = useMemo(
    () => ({
      pinned,
      isPinned,
      togglePin,
      clearPinned,
      canPinMore: pinned.length < MAX_COMPARE,
    }),
    [pinned, isPinned, togglePin, clearPinned]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}