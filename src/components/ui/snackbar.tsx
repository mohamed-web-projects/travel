"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "success" | "warn";

interface SnackbarProps {
  notice: { id: number; message: string; variant: Variant } | null;
  onDismiss?: () => void;
  autoHideMs?: number;
}

const variantStyles: Record<Variant, string> = {
  info: "border-primary/40 bg-[#14162b]",
  success: "border-emerald-500/40 bg-[#0e241c]",
  warn: "border-gold/40 bg-[#241d0e]",
};

const icons: Record<Variant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warn: AlertTriangle,
};

export function Snackbar({ notice, onDismiss, autoHideMs = 2400 }: SnackbarProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!notice) return;
    timer.current = setTimeout(() => onDismissRef.current?.(), autoHideMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [notice, autoHideMs]);

  const Icon = notice ? icons[notice.variant] : Info;

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          key={notice.id}
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className={cn(
            "fixed bottom-20 left-1/2 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl",
            variantStyles[notice.variant]
          )}
        >
          <Icon className="h-4 w-4 shrink-0 text-gold" />
          <p className="text-sm font-semibold whitespace-nowrap text-foreground">
            {notice.message}
          </p>
          <button
            onClick={() => onDismissRef.current?.()}
            aria-label="Dismiss"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}