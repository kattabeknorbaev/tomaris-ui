"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { useI18n } from "@/components/shared/i18n-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
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
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">{t.common.name}</label>
                      <input
                        type="text"
                        placeholder={t.contact.name}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t.common.email}</label>
                      <input
                        type="email"
                        placeholder={t.contact.email}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t.common.subject}</label>
                    <input
                      type="text"
                      placeholder={t.contact.subject}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{t.common.message}</label>
                    <textarea
                      rows={5}
                      placeholder={t.contact.message}
                      className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-emerald-dark"
                  >
                    {t.contact.send}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
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
      <Footer />
    </>
  );
}
