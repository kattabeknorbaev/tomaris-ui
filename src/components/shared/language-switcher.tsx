"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";
import type { Locale } from "@/lib/i18n";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Русский" },
];

/** EN / UZ / RU segmented pill — the same control as the tomaris.ai nav. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div role="group" aria-label={t.common.language} className={cn("t-segmented", className)}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLocale(lang.code)}
          aria-pressed={locale === lang.code}
          aria-label={lang.label}
          title={lang.label}
          className="t-segment"
        >
          {lang.code}
        </button>
      ))}
    </div>
  );
}
