"use client";

import { motion } from "framer-motion";
import {
  Crown,
  MessageSquare,
  MessagesSquare,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/shared/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { useChatStore } from "@/stores/chat-store";

// Everything shown here is real: identity from the session, counts from the
// user's actual synced chats. No fabricated usage numbers.
export default function ProfilePage() {
  const { t } = useI18n();
  const { data: session } = authClient.useSession();
  const chats = useChatStore((s) => s.chats);

  const email = session?.user?.email ?? "";
  const name = session?.user?.name || email.split("@")[0] || "—";
  const initial = (name || email || "U").charAt(0).toUpperCase();
  const memberSince = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString()
    : "—";
  const totalMessages = chats.reduce((n, c) => n + c.messages.length, 0);

  const stats = [
    { icon: MessageSquare, label: t.profilePage.totalChats, value: String(chats.length) },
    { icon: MessagesSquare, label: t.profilePage.totalMessages, value: String(totalMessages) },
    { icon: CalendarDays, label: t.profilePage.memberSince, value: memberSince },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.profilePage.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.profilePage.subtitle}</p>
        </div>

        {/* User info — real session data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {initial}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">{name}</h2>
              <p className="truncate text-sm text-muted-foreground">{email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-medium text-gold">{t.profilePage.freePlan}</span>
              </div>
            </div>
            <Link
              href="/pricing"
              className="btn-lift ml-auto flex shrink-0 items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-deep"
            >
              {t.profilePage.upgrade}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Real usage stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <div className="mt-2 text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Billing — honestly empty on the free plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 font-semibold">{t.profilePage.billingHistory}</h3>
          <div className="py-8 text-center">
            <CreditCard className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">{t.profilePage.noBilling}</p>
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
