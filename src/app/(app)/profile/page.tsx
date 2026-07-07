"use client";

import { motion } from "framer-motion";
import {
  Crown,
  MessageSquare,
  Zap,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/shared/i18n-provider";

const usageData = [
  { date: "Mon", messages: 45 },
  { date: "Tue", messages: 62 },
  { date: "Wed", messages: 38 },
  { date: "Thu", messages: 71 },
  { date: "Fri", messages: 55 },
  { date: "Sat", messages: 23 },
  { date: "Sun", messages: 18 },
];

export default function ProfilePage() {
  const maxMessages = Math.max(...usageData.map((d) => d.messages));
  const { t } = useI18n();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.profilePage.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.profilePage.subtitle}
          </p>
        </div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              U
            </div>
            <div>
              <h2 className="text-lg font-semibold">User</h2>
              <p className="text-sm text-muted-foreground">user@example.com</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-medium text-gold">{t.profilePage.freePlan}</span>
              </div>
            </div>
            <Link
              href="/pricing"
              className="btn-lift ml-auto flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-deep"
            >
              {t.profilePage.upgrade}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Usage Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            {
              icon: MessageSquare,
              label: t.profilePage.messagesToday,
              value: "34",
              limit: "/ 50",
            },
            {
              icon: Zap,
              label: t.profilePage.tokensUsed,
              value: "12.4K",
              limit: "/ 50K",
            },
            {
              icon: CreditCard,
              label: t.profilePage.plan,
              value: "Free",
              limit: "",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <div className="mt-2 text-lg font-bold">
                {stat.value}
                {stat.limit && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    {stat.limit}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 font-semibold">{t.profilePage.weeklyUsage}</h3>
          <div className="flex items-end gap-2 h-32">
            {usageData.map((day) => (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="w-full rounded-t-md bg-primary/20 relative overflow-hidden" style={{ height: `${(day.messages / maxMessages) * 100}%` }}>
                  <div className="absolute inset-0 bg-primary opacity-60" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 font-semibold">{t.profilePage.billingHistory}</h3>
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t.profilePage.noBilling}
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              {t.profilePage.viewPlans} →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
