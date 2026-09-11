"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronUp, Globe } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { CURRENCIES, LANGUAGES, type CurrencyCode } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface Pos {
  x: number;
  y: number;
}

const BAR_STORAGE_KEY = "reaori.currencyBarPos";
const DEFAULT_Y = 80;
const MARGIN = 8;
const DRAG_THRESHOLD = 4;
const PANEL_EST_H = 200;
const PANEL_W = 224;

let snapshot: Pos | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function parseStored(value: string | null): Pos | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<Pos>;
    if (typeof parsed.x === "number" && typeof parsed.y === "number") {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    /* ignore malformed payload */
  }
  return null;
}

function loadOnSubscribe() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const stored = parseStored(window.localStorage.getItem(BAR_STORAGE_KEY));
  if (stored) {
    setTimeout(() => {
      snapshot = stored;
      listeners.forEach((l) => l());
    }, 0);
  }
}

function subscribe(cb: () => void) {
  loadOnSubscribe();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Pos | null {
  return snapshot;
}

function getServerSnapshot(): Pos | null {
  return null;
}

function save(pos: Pos) {
  snapshot = pos;
  try {
    window.localStorage.setItem(BAR_STORAGE_KEY, JSON.stringify(pos));
  } catch {
    /* storage may be unavailable */
  }
  listeners.forEach((l) => l());
}

/* Hydration-safe "isMounted" flag: false on server and during the first client
   render, flips to true one tick after mount so browser-only `window` reads in
   render never run before hydration completes. */
let isMountedCache = false;
const mountedListeners = new Set<() => void>();

function subscribeMounted(cb: () => void) {
  mountedListeners.add(cb);
  if (!isMountedCache) {
    setTimeout(() => {
      isMountedCache = true;
      mountedListeners.forEach((l) => l());
    }, 0);
  }
  return () => {
    mountedListeners.delete(cb);
  };
}

function getMounted(): boolean {
  return isMountedCache;
}

function getServerMounted(): boolean {
  return false;
}

export function CurrencyLanguageBar() {
  const { currency, setCurrency, language, setLanguage } = useSettings();
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isMounted = useSyncExternalStore(subscribeMounted, getMounted, getServerMounted);
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState<{ w: number; h: number } | null>(null);
  const [dragPos, setDragPos] = useState<Pos | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const suppressClick = useRef(false);

  const pos = dragPos ?? persisted;

  const clamp = (p: Pos): Pos => {
    const width = barRef.current?.offsetWidth ?? 56;
    const height = barRef.current?.offsetHeight ?? 44;
    return {
      x: Math.min(Math.max(MARGIN, p.x), Math.max(MARGIN, window.innerWidth - width - MARGIN)),
      y: Math.min(Math.max(MARGIN, p.y), Math.max(MARGIN, window.innerHeight - height - MARGIN)),
    };
  };
  const barW = metrics?.w ?? 96;
  const barH = metrics?.h ?? 44;
  const barRight = pos ? pos.x + barW : isMounted ? window.innerWidth - MARGIN : barW;
  const barTop = pos ? pos.y : isMounted ? DEFAULT_Y : 0;
  const alignRight = isMounted ? barRight > window.innerWidth - (PANEL_W - barW) : false;
  const flipUp = isMounted ? barTop + barH + 8 + PANEL_EST_H > window.innerHeight : false;

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: PointerEvent) => {
      if (barRef.current && e.target instanceof Node && !barRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onClickOutside);
    return () => document.removeEventListener("pointerdown", onClickOutside);
  }, [open]);

  const toggle = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const next = !open;
    setOpen(next);
    if (next && barRef.current) {
      setMetrics({ w: barRef.current.offsetWidth, h: barRef.current.offsetHeight });
    }
    const p = dragPos ?? persisted;
    if (p) setDragPos(clamp(p));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("select")) return;
    suppressClick.current = false;
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos?.x ?? (typeof window !== "undefined" ? window.innerWidth - 64 - MARGIN : 0),
      originY: pos?.y ?? DEFAULT_Y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      suppressClick.current = true;
    }
    if (!suppressClick.current) return;
    setDragPos(clamp({ x: d.originX + dx, y: d.originY + dy }));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    if (suppressClick.current) {
      const next = clamp({ x: d.originX + (e.clientX - d.startX), y: d.originY + (e.clientY - d.startY) });
      setDragPos(next);
      save(next);
    }
  };

  const style: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { right: MARGIN, top: DEFAULT_Y };

  return (
    <div
      ref={barRef}
      role="group"
      aria-label="Currency and language"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={style}
      className={cn(
        "fixed z-[60] w-fit cursor-grab touch-none select-none text-slate-900 dark:text-white",
        "active:cursor-grabbing"
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? "Hide settings" : "Show settings"}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full border-2 px-4 font-medium shadow-lg shadow-indigo-500/10 backdrop-blur-xl transition-colors",
          "dark:shadow-indigo-500/20",
          open
            ? "border-indigo-500/80 bg-background/90 dark:border-indigo-400"
            : "border-hairline bg-background/80 hover:border-indigo-500/40"
        )}
      >
        <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>{currency}</span>
        <ChevronUp className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 w-56 rounded-2xl border border-hairline bg-background/95 p-3 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl dark:shadow-indigo-500/20",
            "animate-panel-in",
            alignRight ? "right-0" : "left-0",
            flipUp ? "bottom-full mb-2" : "top-full mt-2",
            alignRight ? (flipUp ? "origin-bottom-right" : "origin-top-right") : flipUp ? "origin-bottom-left" : "origin-top-left"
          )}
        >
          <div className="space-y-2">
            <div>
              <label htmlFor="reaori-currency" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Currency
              </label>
              <select
                id="reaori-currency"
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-hairline bg-surface px-3 text-sm font-medium text-slate-900 outline-none transition-colors hover:border-indigo-500/40 focus:border-indigo-500/60 dark:text-white"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reaori-language" className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Language
              </label>
              <select
                id="reaori-language"
                aria-label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-hairline bg-surface px-3 text-sm font-medium text-slate-900 outline-none transition-colors hover:border-indigo-500/40 focus:border-indigo-500/60 dark:text-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.code.toUpperCase()} — {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}