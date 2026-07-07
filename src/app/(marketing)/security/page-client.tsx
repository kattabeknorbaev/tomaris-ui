"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, FileCheck, Globe } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";


export default function SecurityPage() {
  const { t } = useI18n();

  const features = [
    {
      icon: Lock,
      title: t.security.encryption,
      desc: t.security.encryptionDesc,
    },
    {
      icon: Server,
      title: t.security.sovereignty,
      desc: t.security.sovereigntyDesc,
    },
    {
      icon: Eye,
      title: t.security.noSelling,
      desc: t.security.noSellingDesc,
    },
    {
      icon: FileCheck,
      title: t.security.compliance,
      desc: t.security.complianceDesc,
    },
    {
      icon: Shield,
      title: t.security.soc,
      desc: t.security.socDesc,
    },
    {
      icon: Globe,
      title: t.security.uptime,
      desc: t.security.uptimeDesc,
    },
  ];

  return (
    <>
      <main id="main" className="pt-16">
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
              >
                <Shield className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl font-bold tracking-tight sm:text-5xl"
              >
                {t.security.title}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              >
                {t.security.subtitle}
              </motion.p>
            </motion.div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="card-lift rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Additional sections */}
            <div className="mt-24 space-y-16">
              <motion.div
                id="privacy"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-8"
              >
                <h2 className="text-xl font-bold">{t.security.dataHandling}</h2>
                <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">{t.security.collectionLabel}:</strong>{" "}
                    {t.security.collection}
                  </p>
                  <p>
                    <strong className="text-foreground">{t.security.processingLabel}:</strong>{" "}
                    {t.security.processing}
                  </p>
                  <p>
                    <strong className="text-foreground">{t.security.retentionLabel}:</strong>{" "}
                    {t.security.retention}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h2 className="text-xl font-bold">{t.security.responsibleAi}</h2>
                <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <p>{t.security.responsible1}</p>
                  <p>{t.security.responsible2}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
