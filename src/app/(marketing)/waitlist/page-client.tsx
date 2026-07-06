"use client";

import { fadeUp } from "@/lib/motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Users } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";


export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <main className="pt-16">
        <section className="relative py-24 sm:py-32">
          <div className="animated-gradient absolute inset-0 opacity-10" />
          <div className="glow-orb -left-40 top-1/4 h-80 w-80 bg-primary" />
          <div className="glow-orb -right-40 bottom-1/4 h-64 w-64 bg-gold" />

          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
              >
                <Users className="h-3.5 w-3.5" />
                2,847 {t.waitlist.peopleWaiting}
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl font-bold tracking-tight sm:text-5xl"
              >
                {t.waitlist.title}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
              >
                {t.waitlist.subtitle}
              </motion.p>
            </motion.div>

            {!submitted ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="mt-12 space-y-5 rounded-2xl border border-border bg-card p-8"
              >
                <div>
                  <label className="text-sm font-medium">{t.waitlist.name}</label>
                  <input
                    type="text"
                    placeholder={t.waitlist.name}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t.common.email}</label>
                  <input
                    type="email"
                    placeholder={t.waitlist.email}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t.waitlist.organization}</label>
                  <input
                    type="text"
                    placeholder={t.waitlist.organization}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t.waitlist.useCase}
                  </label>
                  <select className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="">{t.waitlist.useCase}</option>
                    {t.waitlist.useCases.map((useCase, i) => (
                      <option key={i} value={["education", "business", "development", "research", "personal", "other"][i]}>
                        {useCase}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-emerald-dark"
                >
                  {t.waitlist.submit}
                  <Send className="h-4 w-4" />
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  No spam. Unsubscribe anytime. We&apos;ll notify you when
                  it&apos;s your turn.
                </p>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 rounded-2xl border border-primary/30 bg-card p-12 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  {t.waitlist.successTitle}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {t.waitlist.successText}
                  <br />
                  {t.waitlist.position}: #2,848
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
