"use client";

import { fadeUp } from "@/lib/motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USE_CASE_VALUES = ["education", "business", "development", "research", "personal", "other"];

export default function WaitlistPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = t.common.required;
    if (!EMAIL_RE.test(email)) next.email = t.auth.emailInvalid;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Demo: no backend yet — show honest sending + confirmation states.
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <>
      <main className="pt-16">
        <section className="relative py-24 sm:py-32">
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
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t.waitlist.badge}
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

            {status !== "sent" ? (
              <motion.form
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                onSubmit={handleSubmit}
                noValidate
                className="mt-12 space-y-5 rounded-2xl border border-border bg-card p-8"
              >
                <div>
                  <label htmlFor="waitlist-name" className="text-sm font-medium">
                    {t.waitlist.name}
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.waitlist.name}
                    aria-invalid={!!errors.name}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-error"
                  />
                  {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="waitlist-email" className="text-sm font-medium">
                    {t.common.email}
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.waitlist.email}
                    aria-invalid={!!errors.email}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-error"
                  />
                  {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="waitlist-organization" className="text-sm font-medium">
                    {t.waitlist.organization}
                  </label>
                  <input
                    id="waitlist-organization"
                    type="text"
                    autoComplete="organization"
                    placeholder={t.waitlist.organization}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="waitlist-usecase" className="text-sm font-medium">
                    {t.waitlist.useCase}
                  </label>
                  <select
                    id="waitlist-usecase"
                    defaultValue=""
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>
                      {t.waitlist.useCase}
                    </option>
                    {t.waitlist.useCases.map((useCase, i) => (
                      <option key={USE_CASE_VALUES[i]} value={USE_CASE_VALUES[i]}>
                        {useCase}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-on-primary transition-all hover:bg-primary-deep active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {status === "sending" ? (
                    <>
                      {t.common.sending}
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      {t.waitlist.submit}
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  {t.waitlist.finePrint}
                </p>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="mt-12 rounded-2xl border border-primary/30 bg-card p-12 text-center"
                role="status"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  {t.waitlist.successTitle}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {t.waitlist.successText}
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
