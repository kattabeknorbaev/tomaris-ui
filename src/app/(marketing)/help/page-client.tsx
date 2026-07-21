"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { HelpCircle, Rocket, MessageSquare, FileText, Shield, Keyboard, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/shared/i18n-provider";

const categoryIcons = [Rocket, MessageSquare, FileText, Shield];

export default function HelpPage() {
  const { t } = useI18n();

  const shortcutRows = [
    { label: t.shortcuts.newChat, keys: ["Ctrl", "Shift", "O"] },
    { label: t.shortcuts.toggleSidebar, keys: ["Ctrl", "B"] },
    { label: t.shortcuts.searchChats, keys: ["Ctrl", "K"] },
    { label: t.shortcuts.showShortcuts, keys: ["Ctrl", "/"] },
  ];

  return (
    <main id="main" className="pt-16">
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div initial="hidden" animate="visible" className="text-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
            >
              <HelpCircle className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t.helpPage.title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t.helpPage.subtitle}
            </motion.p>
          </motion.div>

          {/* Topic categories */}
          <h2 className="mt-20 mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.helpPage.categoriesTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {t.helpPage.categories.map((cat, i) => {
              const Icon = categoryIcons[i] ?? HelpCircle;
              return (
                <motion.div
                  key={cat.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="card-lift rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{cat.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Keyboard shortcuts reference */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-2xl border border-border bg-card p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">{t.shortcuts.title}</h2>
            </div>
            <div className="divide-y divide-border">
              {shortcutRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3">
                  <span className="text-sm">{row.label}</span>
                  <span className="flex items-center gap-1">
                    {row.keys.map((k) => (
                      <kbd
                        key={k}
                        className="min-w-[1.6rem] rounded-md border border-border bg-muted px-1.5 py-0.5 text-center text-[11px] font-medium text-muted-foreground"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t.shortcuts.subtitle} <span aria-hidden="true">·</span> ⌘ on macOS.
            </p>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="mb-4 text-xl font-bold">{t.helpPage.faqTitle}</h2>
            <div className="space-y-3">
              {t.faq.items.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-border bg-card p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                    {item.q}
                    <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </motion.div>

          {/* Contact + what's new CTAs */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <Mail className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{t.helpPage.contactTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.helpPage.contactDesc}</p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                {t.helpPage.contactCta} →
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{t.changelogPage.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.changelogPage.subtitle}</p>
              <Link
                href="/changelog"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                {t.help.releaseNotes} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
