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
      <main className="pt-16">
        <section className="relative py-24 sm:py-32">
          <div className="glow-orb -left-40 top-0 h-80 w-80 bg-primary" />
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
                  className="rounded-2xl border border-border bg-card p-6"
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h2 className="text-xl font-bold">{t.security.dataHandling}</h2>
                <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Collection:</strong> We
                    only collect data necessary to provide our services. Chat
                    history is stored locally on your device by default.
                  </p>
                  <p>
                    <strong className="text-foreground">Processing:</strong>{" "}
                    All AI inference runs on our secure infrastructure in
                    Uzbekistan. No data is sent to third-party AI providers.
                  </p>
                  <p>
                    <strong className="text-foreground">Retention:</strong> You
                    have full control over your data. Delete your account and
                    all associated data at any time.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h2 className="text-xl font-bold">{t.security.responsibleAi}</h2>
                <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <p>
                    Tomaris is committed to responsible AI development. Our
                    models undergo rigorous testing for bias, safety, and
                    accuracy before deployment.
                  </p>
                  <p>
                    We maintain transparency about our model&apos;s
                    capabilities and limitations, and we actively work to
                    improve fairness across all Uzbek dialects and communities.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
