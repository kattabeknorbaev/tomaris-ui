"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Scale,
  Briefcase,
  Building,
  Code2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { agents } from "@/lib/mock-data";
import { useI18n } from "@/components/shared/i18n-provider";

const iconMap: Record<string, typeof GraduationCap> = {
  "graduation-cap": GraduationCap,
  scale: Scale,
  briefcase: Briefcase,
  "building-columns": Building,
  code: Code2,
};


export default function AgentsPage() {
  const { t } = useI18n();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.agentsPage.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.agentsPage.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => {
            const Icon = iconMap[agent.icon] || Briefcase;
            return (
              <motion.div
                key={agent.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
              >
                <Link
                  href="/app"
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-3 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground w-fit">
                    {agent.category}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{agent.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    {t.agentsPage.launch}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
