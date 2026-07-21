"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

export default function ChangelogPage() {
  const { t } = useI18n();

  return (
    <main id="main" className="pt-16">
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div initial="hidden" animate="visible" className="text-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t.changelogPage.title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              {t.changelogPage.subtitle}
            </motion.p>
          </motion.div>

          {/* Timeline of releases */}
          <div className="mt-16 space-y-10">
            {t.changelogPage.entries.map((entry, i) => (
              <motion.div
                key={entry.date}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {entry.tag}
                  </span>
                  <time className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {entry.date}
                  </time>
                </div>
                <h2 className="mt-3 text-xl font-bold">{entry.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {entry.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
