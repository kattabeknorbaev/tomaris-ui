"use client";

import { fadeUp } from "@/lib/motion";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<typeof form> = {};
    if (!form.name.trim()) next.name = t.common.required;
    if (!EMAIL_RE.test(form.email)) next.email = t.auth.emailInvalid;
    if (!form.subject.trim()) next.subject = t.common.required;
    if (!form.message.trim()) next.message = t.common.required;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Demo: no backend yet — show honest sending + confirmation states.
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <>
      <main className="pt-16">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.h1
                variants={fadeUp}
                custom={0}
                className="text-4xl font-bold tracking-tight sm:text-5xl"
              >
                {t.contact.title}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              >
                {t.contact.subtitle}
              </motion.p>
            </motion.div>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-6">{t.contact.formTitle}</h2>
                {status === "sent" ? (
                  <div className="rounded-2xl border border-primary/30 bg-card p-10 text-center" role="status">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{t.contact.successTitle}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.contact.successText}</p>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="text-sm font-medium">{t.common.name}</label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={set("name")}
                        placeholder={t.contact.name}
                        aria-invalid={!!errors.name}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-error"
                      />
                      {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="text-sm font-medium">{t.common.email}</label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder={t.contact.email}
                        aria-invalid={!!errors.email}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-error"
                      />
                      {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="text-sm font-medium">{t.common.subject}</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={form.subject}
                      onChange={set("subject")}
                      placeholder={t.contact.subject}
                      aria-invalid={!!errors.subject}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-error"
                    />
                    {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="text-sm font-medium">{t.common.message}</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder={t.contact.message}
                      aria-invalid={!!errors.message}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none aria-invalid:border-error"
                    />
                    {errors.message && <p className="mt-1 text-xs text-error">{errors.message}</p>}
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
                        {t.contact.send}
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
                )}
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.contact.emailLabel}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      hello@tomaris.ai
                    </p>
                    <p className="text-sm text-muted-foreground">
                      support@tomaris.ai
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.contact.officeLabel}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tashkent, Uzbekistan
                      <br />
                      IT Park, Amir Temur Avenue
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.contact.phoneLabel}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      +998 (71) 123-4567
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold">{t.contact.enterpriseTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t.contact.enterpriseText}
                  </p>
                  <a
                    href="mailto:enterprise@tomaris.ai"
                    className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    {t.contact.enterpriseCta} →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
