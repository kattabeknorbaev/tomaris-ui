"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "./i18n-provider";
import type { Locale } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const languages: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "uz", label: "O'zbek" },
  { code: "ru", label: "Русский" },
];

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
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="text-[12px] font-medium uppercase">{current.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={cn(
              "justify-between px-3 py-2",
              locale === lang.code && "text-primary"
            )}
          >
            <span>{lang.label}</span>
            {locale === lang.code && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
