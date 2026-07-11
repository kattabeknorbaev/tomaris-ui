"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useI18n } from "./i18n-provider";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const navLinks = [
    { href: "/home#features", label: t.nav.features },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/about", label: t.nav.about },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-body-sm focus:font-semibold focus:text-on-primary"
      >
        Skip to content
      </a>
      <div className="border-b border-border bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/home" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Tomaris" width={24} height={24} className="rounded-sm" />
            <span className="text-sm font-semibold text-ink tracking-tight">Tomaris</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-1.5 text-body-sm text-muted-foreground transition-colors duration-150 hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="h-5 w-px bg-border mx-1" />
            <Link href="/login" className="rounded-md px-3 py-1.5 text-body-sm text-muted-foreground transition-colors duration-150 hover:text-ink">
              {t.nav.login}
            </Link>
            <Link href="/app" className="btn-lift rounded-md bg-primary px-3.5 py-1.5 text-body-sm font-semibold text-on-primary shadow-[0_4px_14px_-4px_rgba(15,143,111,0.5)] hover:bg-primary-deep">
              {t.nav.tryTomaris}
            </Link>
          </div>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }} className="border-b border-border bg-canvas/95 backdrop-blur-xl md:hidden overflow-hidden">
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2.5 text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <div className="flex gap-2 pt-3">
                <Link href="/login" className="flex-1 rounded-md border border-border px-4 py-2 text-center text-body-sm text-ink" onClick={() => setMobileOpen(false)}>{t.nav.login}</Link>
                <Link href="/app" className="flex-1 rounded-md bg-primary px-4 py-2 text-center text-body-sm font-semibold text-on-primary" onClick={() => setMobileOpen(false)}>{t.nav.tryTomaris}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
