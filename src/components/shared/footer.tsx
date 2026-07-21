"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "./i18n-provider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Tomaris" width={22} height={22} className="rounded-sm" />
              <span className="text-sm font-semibold text-ink">Tomaris</span>
            </Link>
            <p className="mt-4 text-body-sm text-muted-foreground leading-relaxed max-w-xs">{t.footer.description}</p>
          </div>
          <div>
            <h4 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t.footer.product}</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.features}</Link></li>
              <li><Link href="/pricing" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.pricing}</Link></li>
              <li><Link href="/waitlist" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.hero.cta2}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t.footer.company}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.about}</Link></li>
              <li><Link href="/blog" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.blog}</Link></li>
              <li><Link href="/help" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.helpCenter}</Link></li>
              <li><Link href="/changelog" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.changelog}</Link></li>
              <li><Link href="/contact" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t.footer.legal}</h4>
            <ul className="space-y-2">
              <li><Link href="/security" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.security}</Link></li>
              <li><Link href="/security#privacy" className="text-body-sm text-muted-foreground hover:text-ink transition-colors duration-150">{t.footer.privacy}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-caption">{t.footer.rights.replace("{year}", new Date().getFullYear().toString())}</p>
          <p className="text-caption">{t.footer.builtIn}</p>
        </div>
      </div>
    </footer>
  );
}
