"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trash2, Scale } from "lucide-react";
import { useCompare } from "@/components/compare/compare-context";
import { CompareSheet } from "./CompareSheet";
import { formatPrice } from "@/lib/utils";

export function CompareBar() {
  const { pinned, clearPinned } = useCompare();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {pinned.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-background/90 shadow-[0_-18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="hidden shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground sm:flex">
                  <Scale className="h-4 w-4 text-primary" />
                  Compare
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                    {pinned.length}/3
                  </span>
                </div>

                <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto pb-1">
                  {pinned.map((d) => (
                    <div
                      key={d.slug}
                      className="flex min-w-0 shrink-0 items-center gap-3 rounded-xl border border-hairline bg-surface/70 px-3 py-2"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/packages/${d.slug}`}
                          className="block truncate text-sm font-bold text-foreground transition-colors hover:text-primary"
                        >
                          {d.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {d.durationDays}d · {formatPrice(d.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={clearPinned}
                  className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-hairline px-4 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
                <button
                  onClick={() => setSheetOpen(true)}
                  className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
                >
                  Compare now
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}