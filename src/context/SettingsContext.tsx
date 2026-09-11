"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CURRENCIES, UI_STRINGS, type CurrencyCode } from "@/data/mockData";

export type LanguageCode = "en" | "ar";

interface SettingsValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  convert: (usd: number) => number;
  format: (usd: number) => string;
  t: (key: keyof typeof UI_STRINGS.en) => string;
}

const CURRENCY_KEY = "reaori.currency";
const LANGUAGE_KEY = "reaori.language";

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const savedCurrency = localStorage.getItem(CURRENCY_KEY);
      if (savedCurrency && savedCurrency in CURRENCIES) {
        setCurrency(savedCurrency as CurrencyCode);
      }
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage === "en" || savedLanguage === "ar") {
        setLanguage(savedLanguage);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const value = useMemo<SettingsValue>(() => {
    const rate = CURRENCIES[currency].rate;
    const convert = (usd: number) => Math.round(usd * rate);
    return {
      currency,
      setCurrency,
      language,
      setLanguage,
      convert,
      format: (usd: number) =>
        new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(convert(usd)),
      t: (key) => UI_STRINGS[language][key],
    };
  }, [currency, language]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}