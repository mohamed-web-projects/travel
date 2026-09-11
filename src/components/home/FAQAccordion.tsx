"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { FAQS } from "@/data/travelData";
import { cn } from "@/lib/utils";

const SCROLL_CLOSE_THRESHOLD = 150;

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const openScrollYRef = useRef<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) {
      openScrollYRef.current = null;
      return;
    }

    openScrollYRef.current ??= window.scrollY;

    let frame = 0;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const anchor = openScrollYRef.current;
        if (anchor !== null && Math.abs(window.scrollY - anchor) > SCROLL_CLOSE_THRESHOLD) {
          setOpenIndex(null);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openIndex]);

  return (
    <section className="cvi relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Good to know"
          title="Frequently asked questions"
        />

        <div ref={wrapperRef} className="mt-12 space-y-3">
          {FAQS.map((faq, index) => {
            const open = openIndex === index;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors duration-300",
                  open
                    ? "border-primary/40 bg-primary/[0.05]"
                    : "border-hairline bg-card hover:border-foreground/20"
                )}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${faq.id}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-foreground">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
                      open
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-hairline text-muted-foreground"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}