"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Check, ArrowRight, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/components/compare/compare-context";
import { CATEGORY_LABELS, type Destination } from "@/data/travelData";
import { formatPrice } from "@/lib/utils";

interface CompareSheetProps {
  open: boolean;
  onClose: () => void;
}

export function CompareSheet({ open, onClose }: CompareSheetProps) {
  const { pinned } = useCompare();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const best: Record<string, Destination | undefined> = {
    price: pinned.reduce<Destination | undefined>(
      (bestD, d) => (d.price < (bestD?.price ?? Infinity) ? d : bestD),
      undefined
    ),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Compare packages"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-hairline bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Compare packages</h2>
                <p className="text-sm text-muted-foreground">
                  {pinned.length} of 3 selected
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close comparison"
                className="grid h-10 w-10 place-items-center rounded-full border border-hairline text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="w-28 px-4 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Specs
                    </th>
                    {pinned.map((d) => (
                      <th key={d.slug} className="px-4 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <div className="relative h-16 w-full overflow-hidden rounded-xl">
                            <Image
                              src={d.image}
                              alt={d.name}
                              fill
                              sizes="160px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-base font-bold text-foreground">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{d.country}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Category",
                      render: (d: Destination) => (
                        <div className="flex flex-wrap gap-1">
                          {d.categories.map((c) => (
                            <Badge key={c} variant="outline">
                              {CATEGORY_LABELS[c]}
                            </Badge>
                          ))}
                        </div>
                      ),
                    },
                    {
                      label: "Price / person",
                      highlight: (d: Destination) => d.slug === best.price?.slug,
                      render: (d: Destination) => (
                        <span className="text-base font-bold text-primary">
                          {formatPrice(d.price)}
                          <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
                            {formatPrice(d.oldPrice)}
                          </span>
                        </span>
                      ),
                    },
                    {
                      label: "Duration",
                      render: (d: Destination) => `${d.durationDays} days`,
                    },
                    {
                      label: "Rating",
                      render: (d: Destination) => (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 fill-gold text-gold" />
                          {d.rating} ({d.reviewCount.toLocaleString("en-US")})
                        </span>
                      ),
                    },
                    {
                      label: "Spots left",
                      render: (d: Destination) =>
                        `${d.availableSpots} spots`,
                    },
                    {
                      label: "Highlights",
                      render: (d: Destination) => (
                        <ul className="space-y-1.5">
                          {d.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap"
                            >
                              <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      ),
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-hairline/50">
                      <td className="px-4 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {row.label}
                      </td>
                      {pinned.map((d) => (
                        <td
                          key={d.slug}
                          className={
                            row.highlight?.(d)
                              ? "bg-primary/[0.06] px-4 py-4"
                              : "px-4 py-4"
                          }
                        >
                          {row.render(d)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td />
                    {pinned.map((d) => (
                      <td
                        key={d.slug}
                        className="px-4 py-5"
                      >
                        <Link
                          href={`/packages/${d.slug}`}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
                        >
                          View package
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 border-t border-hairline px-6 py-3 text-xs text-muted-foreground">
              <Ban className="h-3.5 w-3.5 text-gold" />
              Best price highlighted automatically. Pin up to 3 packages from any tour card.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}