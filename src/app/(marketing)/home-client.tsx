"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Languages,
  Bot,
  Shield,
  Eye,
  Code2,
  ChevronDown,
  Check,
  X,
  Send,
} from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";
import { EASE } from "@/lib/motion";

const featureIcons = [Languages, Zap, Bot, Shield, Eye, Code2];

// Hero entrance — staggered fade-up, each element ≤300ms per DESIGN.md.
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

export default function HomePage() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const useCaseTabs = [
    { label: t.useCases.education, title: t.useCases.educationTitle, desc: t.useCases.educationDesc, icon: "🎓" },
    { label: t.useCases.legal, title: t.useCases.legalTitle, desc: t.useCases.legalDesc, icon: "⚖️" },
    { label: t.useCases.business, title: t.useCases.businessTitle, desc: t.useCases.businessDesc, icon: "💼" },
    { label: t.useCases.government, title: t.useCases.governmentTitle, desc: t.useCases.governmentDesc, icon: "🏛️" },
    { label: t.useCases.healthcare, title: t.useCases.healthcareTitle, desc: t.useCases.healthcareDesc, icon: "🏥" },
  ];

  // Single source of truth with /pricing: names, descriptions, and features
  // all come from t.pricing. The landing shows the first 5 features per plan.
  const plans = [
    { name: t.pricing.free, price: "0", desc: t.pricing.freeDesc, features: t.pricing.freeFeatures.slice(0, 4), cta: t.pricing.getStarted, popular: false },
    { name: t.pricing.pro, price: "19", desc: t.pricing.proDesc, features: t.pricing.proFeatures.slice(0, 5), cta: t.pricing.startTrial, popular: true },
    { name: t.pricing.enterprise, price: null, desc: t.pricing.enterpriseDesc, features: t.pricing.enterpriseFeatures.slice(0, 5), cta: t.pricing.contactSales, popular: false },
  ];

  return (
    <>
      <main id="main">
        {/* ===== HERO ===== */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="hero-backdrop" aria-hidden="true" />
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="relative mx-auto max-w-3xl px-5 text-center sm:px-8"
          >
            <motion.div variants={heroItem} className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-[13px] font-medium text-primary-soft">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                {t.hero.eyebrow}
              </span>
            </motion.div>
            <motion.h1 variants={heroItem} className="text-display text-ink-strong">
              {t.hero.headline}
            </motion.h1>
            <motion.p variants={heroItem} className="mt-5 text-body-lg text-muted-foreground max-w-xl mx-auto">
              {t.hero.subheadline}
            </motion.p>
            <motion.div variants={heroItem} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={process.env.NODE_ENV === "development" ? "/app" : "https://chat.tomaris.ai"} className="btn-lift inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary shadow-[0_4px_16px_-4px_rgba(15,143,111,0.5)] hover:bg-primary-deep">
                {t.hero.cta1} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/waitlist" className="btn-lift inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-semibold text-ink hover:border-hairline-soft hover:bg-surface-2">
                {t.hero.cta2}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={heroItem}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden border border-border bg-border"
            >
              {[
                { value: "27B", label: t.hero.statParams },
                { value: "227M", label: t.hero.statWords },
                { value: "3", label: t.hero.statLanguages },
                { value: "<200ms", label: t.hero.statLatency },
              ].map((s) => (
                <div key={s.label} className="group bg-card px-4 py-5 text-center transition-colors duration-200 hover:bg-surface-2">
                  <div className="font-mono text-xl font-semibold text-ink-strong transition-colors group-hover:text-primary">{s.value}</div>
                  <div className="text-caption mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Chat mock */}
            <motion.div
              variants={heroItem}
              className="mt-12 rounded-xl border border-border bg-card text-left overflow-hidden shadow-[var(--shadow-lg)]"
            >
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-caption ml-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Tomaris AI
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="rounded-lg rounded-br-sm bg-primary/10 px-3 py-2 text-body-sm text-ink">Salom! Qanday yordam bera olasiz?</div>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-semibold text-on-primary">T</div>
                  <div className="rounded-lg rounded-bl-sm bg-surface-2 px-3 py-2 text-body-sm text-muted-foreground">
                    {t.chat.greeting}
                    <div className="mt-1.5 flex gap-0.5">
                      <span className="typing-dot inline-block h-1 w-1 rounded-full bg-primary" />
                      <span className="typing-dot inline-block h-1 w-1 rounded-full bg-primary" />
                      <span className="typing-dot inline-block h-1 w-1 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border px-4 py-2.5">
                <div className="flex items-center gap-2 rounded-md border border-border bg-canvas-soft px-3 py-2 text-body-sm text-mute">
                  <span className="flex-1">{t.chat.placeholder}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-on-primary">
                    <Send className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center mb-12">
              <p className="text-eyebrow mb-3">{t.features.eyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.features.title}</h2>
              <p className="mt-3 text-body text-muted-foreground max-w-lg mx-auto">{t.features.subtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.features.items.map((f, i) => {
                const Icon = featureIcons[i] || Zap;
                return (
                  <div key={f.title} className="card-lift group rounded-xl border border-border bg-card p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-heading-3">{f.title}</h3>
                    <p className="mt-1.5 text-body-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== WHY TOMARIS ===== */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <p className="text-eyebrow mb-3">{t.whyTomaris.eyebrow}</p>
                <h2 className="text-heading-1 text-ink-strong">{t.whyTomaris.title}</h2>
                <p className="mt-3 text-body text-muted-foreground">{t.whyTomaris.subtitle}</p>
                <ul className="mt-6 space-y-2.5">
                  {t.whyTomaris.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-body-sm text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Honest capability snapshot — factual, verifiable features of
                  the live product (no fabricated competitor benchmarks). */}
              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[var(--shadow-md)]">
                <div className="border-b border-border px-4 py-2.5">
                  <h3 className="text-body-sm font-semibold text-ink">{t.whyTomaris.snapshotTitle}</h3>
                </div>
                <div className="divide-y divide-border">
                  {t.whyTomaris.snapshot.map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-3.5">
                      <span className="text-body-sm text-muted-foreground">{row.label}</span>
                      <span className="text-body-sm font-medium text-ink">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== USE CASES ===== */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.useCases.eyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.useCases.title}</h2>
            </div>
            <div role="tablist" aria-label={t.useCases.title} className="flex flex-wrap justify-center gap-1.5 mb-8">
              {useCaseTabs.map((tab, i) => (
                <button
                  key={tab.label}
                  role="tab"
                  id={`use-case-tab-${i}`}
                  aria-selected={activeTab === i}
                  aria-controls="use-case-panel"
                  tabIndex={activeTab === i ? 0 : -1}
                  onClick={() => setActiveTab(i)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") setActiveTab((i + 1) % useCaseTabs.length);
                    if (e.key === "ArrowLeft") setActiveTab((i - 1 + useCaseTabs.length) % useCaseTabs.length);
                  }}
                  className={`rounded-md px-3.5 py-1.5 text-body-sm font-semibold transition-colors duration-150 ${activeTab === i ? "bg-ink text-canvas" : "text-muted-foreground hover:text-ink hover:bg-surface-2"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              id="use-case-panel"
              aria-labelledby={`use-case-tab-${activeTab}`}
              className="rounded-lg border border-border bg-card p-6 max-w-xl mx-auto"
            >
              <div className="text-2xl mb-3" aria-hidden="true">{useCaseTabs[activeTab].icon}</div>
              <h3 className="text-heading-3">{useCaseTabs[activeTab].title}</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">{useCaseTabs[activeTab].desc}</p>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON TABLE ===== */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.comparison.eyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.comparison.title}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="pb-3 text-left text-body-sm font-semibold text-muted-foreground">{t.comparison.feature}</th>
                    <th scope="col" className="pb-3 text-center text-body-sm font-semibold text-ink">Tomaris</th>
                    <th scope="col" className="pb-3 text-center text-body-sm font-semibold text-muted-foreground">ChatGPT</th>
                    <th scope="col" className="pb-3 text-center text-body-sm font-semibold text-muted-foreground">Gemini</th>
                    <th scope="col" className="pb-3 text-center text-body-sm font-semibold text-muted-foreground">Claude</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: t.comparison.uzbekQuality, t: t.comparison.excellent, g: t.comparison.good, ge: t.comparison.fair, c: t.comparison.fair, isText: true },
                    { f: t.comparison.culturalContext, t: true, g: false, ge: false, c: false, isText: false },
                    { f: t.comparison.dataSovereignty, t: true, g: false, ge: false, c: false, isText: false },
                    { f: t.comparison.agenticWorkflows, t: true, g: true, ge: true, c: true, isText: false },
                    { f: t.comparison.pricingLabel, t: t.comparison.freeTier, g: "$20/mo", ge: "$20/mo", c: "$20/mo", isText: true },
                  ].map((row) => (
                    <tr key={row.f} className="border-b border-border">
                      <td className="py-3 text-body-sm text-muted-foreground">{row.f}</td>
                      <td className="py-3 text-center">
                        {row.isText ? (
                          <span className="text-body-sm font-semibold text-primary">{row.t as string}</span>
                        ) : row.t ? (
                          <>
                            <Check className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="sr-only">{t.comparison.yes}</span>
                          </>
                        ) : (
                          <>
                            <X className="mx-auto h-4 w-4 text-hairline-soft" aria-hidden="true" />
                            <span className="sr-only">{t.comparison.no}</span>
                          </>
                        )}
                      </td>
                      {["g", "ge", "c"].map((k) => {
                        const val = row[k as keyof typeof row];
                        return (
                          <td key={k} className="py-3 text-center">
                            {typeof val === "string" ? (
                              <span className="text-body-sm text-muted-foreground">{val}</span>
                            ) : val ? (
                              <>
                                <Check className="mx-auto h-4 w-4 text-hairline-soft" aria-hidden="true" />
                                <span className="sr-only">{t.comparison.yes}</span>
                              </>
                            ) : (
                              <>
                                <X className="mx-auto h-4 w-4 text-hairline" aria-hidden="true" />
                                <span className="sr-only">{t.comparison.no}</span>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== PRINCIPLES ===== */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.principles.eyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.principles.title}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.principles.items.map((item, i) => {
                const Icon = [Languages, Shield, Eye][i] || Check;
                return (
                  <div key={item.title} className="card-lift rounded-xl border border-border bg-card p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-body-sm font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-body-sm text-muted-foreground leading-relaxed">{item.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.pricing.eyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.pricing.title}</h2>
              <p className="mt-3 text-body text-muted-foreground">{t.pricing.subtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.name} className={`card-lift relative rounded-xl border bg-card p-5 ${plan.popular ? "border-primary shadow-[0_0_0_1px_var(--primary),var(--shadow-lg)]" : "border-border"}`}>
                  {plan.popular && <div className="absolute -top-2.5 left-5 rounded-sm bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-on-primary uppercase tracking-wider">{t.pricing.mostPopular}</div>}
                  <h3 className="text-body-sm font-semibold text-ink">{plan.name}</h3>
                  <div className="mt-1.5 flex items-baseline gap-0.5">
                    <span className="text-heading-1 text-ink-strong">{plan.price === null ? t.pricing.custom : `$${plan.price}`}</span>
                    {plan.price !== null && <span className="text-caption">{t.pricing.perMonth}</span>}
                  </div>
                  <p className="mt-1.5 text-caption">{plan.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-body-sm text-muted-foreground"><Check className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />{f}</li>
                    ))}
                  </ul>
                  <Link href={plan.name === t.pricing.enterprise ? "/contact" : "/signup"} className={`btn-lift mt-5 flex h-10 items-center justify-center rounded-md text-body-sm font-semibold ${plan.popular ? "bg-primary text-on-primary hover:bg-primary-deep" : "border border-border text-ink hover:bg-surface-2"}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.faq.eyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.faq.title}</h2>
            </div>
            <div className="divide-y divide-border">
              {t.faq.items.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    className="flex w-full items-center justify-between py-4 text-left"
                  >
                    <span className="text-body-sm font-semibold text-ink pr-4">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ${openFaq === i ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {openFaq === i && (
                    <p id={`faq-answer-${i}`} className="pb-4 text-body-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative overflow-hidden rounded-2xl bg-ink px-8 py-14 text-center sm:px-16"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(50% 60% at 50% 0%, rgba(15,143,111,0.22), transparent 70%)" }}
                aria-hidden="true"
              />
              <div className="relative">
                <h2 className="text-heading-1 text-canvas">{t.cta.title}</h2>
                <p className="mt-3 text-body-sm text-mute max-w-md mx-auto">{t.cta.subtitle}</p>
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href={process.env.NODE_ENV === "development" ? "/app" : "https://chat.tomaris.ai"} className="btn-lift inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary shadow-[0_4px_16px_-4px_rgba(15,143,111,0.6)] hover:bg-primary-deep">
                    {t.cta.cta1} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link href="/waitlist" className="btn-lift inline-flex h-11 items-center gap-2 rounded-md border border-hairline-soft px-5 text-sm font-semibold text-canvas hover:bg-surface-3">
                    {t.cta.cta2}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
