"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import {
  Landmark,
  CloudOff,
  Gavel,
  Languages,
  Server,
  Database,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/shared/i18n-provider";

const problemIcons = [CloudOff, Gavel, Languages];

export default function EnterprisePage() {
  const { t } = useI18n();

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
              <Landmark className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t.enterprise.eyebrow}
            </motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {t.enterprise.title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t.enterprise.subtitle}
            </motion.p>
          </motion.div>

          {/* The problem with foreign APIs */}
          <h2 className="mt-20 mb-6 text-xl font-bold">{t.enterprise.problemTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {t.enterprise.problems.map((p, i) => {
              const Icon = problemIcons[i] ?? CloudOff;
              return (
                <motion.div
                  key={p.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Two doors */}
          <h2 className="mt-20 mb-6 text-xl font-bold">{t.enterprise.doorsTitle}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { icon: Server, title: t.enterprise.door1Title, desc: t.enterprise.door1Desc, items: t.enterprise.door1Items },
              { icon: Database, title: t.enterprise.door2Title, desc: t.enterprise.door2Desc, items: t.enterprise.door2Items },
            ].map((door, i) => (
              <motion.div
                key={door.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-lift rounded-2xl border border-border bg-card p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <door.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{door.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{door.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {door.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Support-desk worked example */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="border-b border-border p-6 sm:p-8 pb-5">
              <h2 className="text-xl font-bold">{t.enterprise.mathTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.enterprise.mathSubtitle}</p>
            </div>
            <div className="divide-y divide-border">
              {t.enterprise.mathRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-wrap items-center justify-between gap-2 px-6 py-3.5 sm:px-8 ${
                    i === t.enterprise.mathRows.length - 1 ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className={`font-mono text-sm font-semibold ${i === t.enterprise.mathRows.length - 1 ? "text-primary" : ""}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <p className="border-t border-border px-6 py-4 text-sm text-muted-foreground sm:px-8">
              {t.enterprise.mathNote}
            </p>
          </motion.div>

          {/* Real assets */}
          <h2 className="mt-20 mb-6 text-xl font-bold">{t.enterprise.assetsTitle}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {t.enterprise.assets.map((a, i) => (
              <motion.div
                key={a.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="font-mono text-2xl font-bold text-primary">{a.value}</div>
                <div className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{a.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Roadmap */}
          <h2 className="mt-20 mb-6 text-xl font-bold">{t.enterprise.roadmapTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.enterprise.roadmap.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">{step.phase}</span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12"
          >
            <h2 className="text-2xl font-bold">{t.enterprise.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t.enterprise.ctaDesc}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="btn-lift inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-deep"
              >
                {t.enterprise.ctaButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/api"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                {t.enterprise.ctaApi}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
