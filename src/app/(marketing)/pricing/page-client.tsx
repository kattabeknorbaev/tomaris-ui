"use client";

import { fadeUp } from "@/lib/motion";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";
import { useState } from "react";


export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { t } = useI18n();

  // Which features are included per plan — text comes from i18n.
  const FREE_INCLUDED = [true, true, true, true, false, false];

  const plans = [
    {
      name: t.pricing.free,
      monthlyPrice: 0,
      yearlyPrice: 0,
      desc: t.pricing.freeDesc,
      features: t.pricing.freeFeatures.map((text, i) => ({
        text,
        included: FREE_INCLUDED[i],
      })),
      cta: t.pricing.getStarted,
      popular: false,
    },
    {
      name: t.pricing.pro,
      monthlyPrice: 19,
      yearlyPrice: 190,
      desc: t.pricing.proDesc,
      features: t.pricing.proFeatures.map((text) => ({ text, included: true })),
      cta: t.pricing.startTrial,
      popular: true,
    },
    {
      name: t.pricing.enterprise,
      monthlyPrice: null,
      yearlyPrice: null,
      desc: t.pricing.enterpriseDesc,
      features: t.pricing.enterpriseFeatures.map((text) => ({
        text,
        included: true,
      })),
      cta: t.pricing.contactSales,
      popular: false,
    },
  ];

  return (
    <>
      <main id="main" className="pt-14">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                className="text-eyebrow mb-4"
              >
                {t.pricing.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-display"
              >
                {t.pricing.title}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mx-auto mt-4 max-w-md text-body text-muted-foreground"
              >
                {t.pricing.subtitle}
              </motion.p>
            </motion.div>

            {/* Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <span
                className={`text-body-sm ${
                  !annual ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {t.pricing.monthly}
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  annual ? "bg-foreground" : "bg-muted-foreground/20"
                }`}
                role="switch"
                aria-checked={annual}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform shadow-sm ${
                    annual ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span
                className={`text-body-sm ${
                  annual ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {t.pricing.annual} <span className="text-primary text-caption normal-case">({t.pricing.savePercent})</span>
              </span>
            </motion.div>

            {/* Plans */}
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`relative rounded-xl border bg-card p-6 ${
                    plan.popular
                      ? "border-foreground shadow-lg"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-6 rounded-md bg-foreground px-3 py-0.5 text-caption text-background normal-case">
                      {t.pricing.mostPopular}
                    </div>
                  )}
                  <h3 className="text-heading-3">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    {plan.monthlyPrice !== null ? (
                      <>
                        <span className="text-display">
                          ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-body-sm text-muted-foreground">
                          {annual ? t.pricing.perYear : t.pricing.perMonth}
                        </span>
                      </>
                    ) : (
                      <span className="text-display">{t.pricing.custom}</span>
                    )}
                  </div>
                  <p className="mt-2 text-body-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f.text}
                        className="flex items-center gap-2.5 text-body-sm"
                      >
                        {f.included ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        ) : (
                          <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/20" aria-hidden="true" />
                        )}
                        <span
                          className={
                            f.included ? "" : "text-muted-foreground/50"
                          }
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={
                      plan.name === t.pricing.enterprise ? "/contact" : "/signup"
                    }
                    className={`mt-6 flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all active:scale-[0.98] ${
                      plan.popular
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
