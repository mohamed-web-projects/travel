"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const WISHLIST_KEY = "reaori.wishlist";

interface WishlistValue {
  ids: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        if (raw) setIds(JSON.parse(raw) as string[]);
      } catch {
        /* ignore corrupted storage */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  }, [ids]);

  const value = useMemo<WishlistValue>(
    () => ({
      ids,
      toggle: (slug) =>
        setIds((prev) =>
          prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        ),
      has: (slug) => ids.includes(slug),
      clear: () => setIds([]),
    }),
    [ids]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}