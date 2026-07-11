"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";
import type { Locale } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Inline SVG flags — render identically on every OS (unlike emoji flags, which
// degrade to letter-pairs on Windows).
function FlagUK() {
  return (
    <svg viewBox="0 0 60 30" className="h-full w-full">
      <clipPath id="fl-uk"><rect width="60" height="30" /></clipPath>
      <g clipPath="url(#fl-uk)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
function FlagUZ() {
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full">
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.2" fill="#0099B5" />
      <rect y="13.8" width="30" height="6.2" fill="#1EB53A" />
      <rect y="6.0" width="30" height="0.5" fill="#CE1126" />
      <rect y="13.5" width="30" height="0.5" fill="#CE1126" />
      <circle cx="5" cy="3.1" r="2.1" fill="#fff" />
      <circle cx="5.9" cy="3.1" r="2.0" fill="#0099B5" />
    </svg>
  );
}
function FlagRU() {
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full">
      <rect width="30" height="20" fill="#fff" />
      <rect y="6.67" width="30" height="6.66" fill="#0039A6" />
      <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
    </svg>
  );
}

const languages: { code: Locale; label: string; Flag: () => React.ReactNode }[] = [
  { code: "en", label: "English", Flag: FlagUK },
  { code: "uz", label: "O'zbek", Flag: FlagUZ },
  { code: "ru", label: "Русский", Flag: FlagRU },
];

function FlagBadge({ Flag }: { Flag: () => React.ReactNode }) {
  return (
    <span className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10">
      <Flag />
    </span>
  );
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const current = languages.find((l) => l.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${t.common.language}: ${current.label}`}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-ink data-popup-open:bg-muted",
          className
        )}
      >
        <FlagBadge Flag={current.Flag} />
        <span className="text-[12px] font-medium uppercase">{current.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={cn(
              "gap-2.5 px-3 py-2",
              locale === lang.code && "text-primary"
            )}
          >
            <FlagBadge Flag={lang.Flag} />
            <span className="flex-1">{lang.label}</span>
            {locale === lang.code && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
