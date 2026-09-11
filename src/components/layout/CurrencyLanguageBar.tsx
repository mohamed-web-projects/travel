"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { CURRENCIES, LANGUAGES, type CurrencyCode } from "@/data/mockData";
import { cn } from "@/lib/utils";

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: PointerEvent) => {
      const el = ref.current;
      if (!el || el.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("pointerdown", listener);
    return () => document.removeEventListener("pointerdown", listener);
  }, [ref, handler]);
}

export function CurrencyLanguageBar() {
  const { currency, setCurrency, language, setLanguage } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Currency and language"
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          "border-slate-200/60 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700",
          isOpen && "border-indigo-500/60 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300"
        )}
      >
        <Globe size={14} className="shrink-0" />
        <span className="tabular-nums">{currency}</span>
        <span aria-hidden className="opacity-40">
          |
        </span>
        <span>{language.toUpperCase()}</span>
        <ChevronDown
          size={12}
          className={cn("shrink-0 opacity-60 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-popover-in rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="space-y-3">
            <div>
              <label
                htmlFor="reaori-currency"
                className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Currency
              </label>
              <select
                id="reaori-currency"
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition-colors hover:border-indigo-500/40 focus:border-indigo-500/60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="reaori-language"
                className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
              >
                Language
              </label>
              <select
                id="reaori-language"
                aria-label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "ar")}
                className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition-colors hover:border-indigo-500/40 focus:border-indigo-500/60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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