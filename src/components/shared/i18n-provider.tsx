"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Locale, Translations } from "@/lib/i18n";
import { translations, COOKIE_NAME } from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) =>
      c.trim().startsWith(`${COOKIE_NAME}=`)
    );
    if (cookie) {
      const val = cookie.split("=")[1].trim() as Locale;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time cookie read after mount; SSR must render the default locale to avoid a hydration mismatch
      if (val in translations) setLocaleState(val);
    }
  }, []);

  // Keep <html lang> in sync for screen readers and search engines.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000`;
    setLocaleState(newLocale);
  };

  return (
    <I18nContext.Provider
      value={{ locale, t: translations[locale], setLocale }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
