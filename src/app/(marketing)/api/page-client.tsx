"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { Code2, Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/shared/i18n-provider";

const CURL_EXAMPLE = `curl https://api.tomaris.ai/v1/chat/completions \\
  -H "Authorization: Bearer $TOMARIS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "tomaris-27b",
    "messages": [
      {"role": "user", "content": "Salom! O'zbekiston haqida ayting."}
    ]
  }'`;

export default function ApiPage() {
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
              <Code2 className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-xs font-semibold uppercase tracking-widest text-primary">
              {t.apiPage.eyebrow}
            </motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {t.apiPage.title}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t.apiPage.subtitle}
            </motion.p>
          </motion.div>

          {/* Pricing tiers */}
          <div className="mt-20 mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t.apiPage.tiersTitle}</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              {t.apiPage.earlyBadge}
            </span>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {t.apiPage.tiers.map((tier, i) => {
              const featured = i === 1;
              return (
                <motion.div
                  key={tier.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className={`flex flex-col rounded-2xl border bg-card p-7 ${
                    featured ? "border-primary shadow-[0_8px_30px_-12px_rgba(15,143,111,0.35)]" : "border-border"
                  }`}
                >
                  <h3 className="font-semibold">{tier.name}</h3>
                  <div className="mt-3 font-mono text-2xl font-bold">{tier.price}</div>
                  <div className="text-xs text-muted-foreground">{tier.unit}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                      featured
                        ? "btn-lift bg-primary text-on-primary hover:bg-primary-deep"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Code example */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="mb-2 text-xl font-bold">{t.apiPage.exampleTitle}</h2>
            <p className="mb-5 text-sm text-muted-foreground">{t.apiPage.exampleNote}</p>
            <div className="overflow-x-auto rounded-2xl border border-border bg-[#09090B] p-6">
              <pre className="font-mono text-[13px] leading-relaxed text-[#E4E4E7]">
                <code>{CURL_EXAMPLE}</code>
              </pre>
            </div>
          </motion.div>

          {/* Why Tomaris API */}
          <h2 className="mt-20 mb-6 text-xl font-bold">{t.apiPage.whyTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {t.apiPage.why.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="mb-4 text-xl font-bold">{t.apiPage.faqTitle}</h2>
            <div className="space-y-3">
              {t.apiPage.faq.map((item) => (
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 rounded-2xl border border-border bg-card p-8 text-center sm:p-12"
          >
            <h2 className="text-2xl font-bold">{t.apiPage.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t.apiPage.ctaDesc}</p>
            <Link
              href="/contact"
              className="btn-lift mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-deep"
            >
              {t.apiPage.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
