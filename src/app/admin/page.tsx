"use client";

import { useEffect, useState } from "react";
import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  MessagesSquare,
  MessageSquarePlus,
  Radio,
  Activity,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

// Everything on this page is real: counts come from the database, model
// status from a live ping. No mock numbers.

interface FeedbackRow {
  email: string | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  message: string;
  page: string | null;
  created_at: string;
}

interface Stats {
  totals: { users: number; chats: number; messages: number; feedback: number; active_sessions: number };
  daily: { day: string; new_users: number; messages: number }[];
  recentUsers: { email: string; created_at: string; chats: number; messages: number }[];
  recentFeedback: FeedbackRow[];
  model: { ok: boolean; latencyMs: number | null };
}

const sentimentIcon = { positive: Smile, neutral: Meh, negative: Frown } as const;

export default function AdminPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  const cards = stats
    ? [
        { label: t.adminPage.registeredUsers, value: stats.totals.users, icon: Users },
        { label: t.adminPage.totalChats, value: stats.totals.chats, icon: MessageSquare },
        { label: t.adminPage.totalMessages, value: stats.totals.messages, icon: MessagesSquare },
        { label: t.adminPage.totalFeedback, value: stats.totals.feedback, icon: MessageSquarePlus },
        { label: t.adminPage.activeSessions, value: stats.totals.active_sessions, icon: Radio },
      ]
    : [];

  const maxUsers = stats ? Math.max(1, ...stats.daily.map((d) => d.new_users)) : 1;
  const maxMsgs = stats ? Math.max(1, ...stats.daily.map((d) => d.messages)) : 1;

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              T
            </span>
            <span className="text-sm font-semibold">Tomaris Admin</span>
          </div>
          {stats && (
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                stats.model.ok ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
              }`}
            >
              {stats.model.ok ? t.adminPage.live : t.adminPage.offline}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.adminPage.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.adminPage.subtitle}</p>
        </div>

        {error && (
          <p className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
            {t.adminPage.loadFailed}
          </p>
        )}
        {!stats && !error && (
          <p className="text-sm text-muted-foreground">{t.adminPage.loading}</p>
        )}

        {stats && (
          <>
            {/* Stat cards — live DB counts */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-2xl font-bold font-mono">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* 7-day activity — real per-day counts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-2 rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">{t.adminPage.weeklyActivity}</h2>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {t.adminPage.newUsers}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gold" />
                      {t.adminPage.messages}
                    </span>
                  </div>
                </div>
                <div className="flex h-48 items-end gap-3">
                  {stats.daily.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-full w-full items-end gap-1">
                        <div
                          className="flex-1 rounded-t-sm bg-primary/70"
                          style={{ height: `${(d.new_users / maxUsers) * 100}%` }}
                          title={`${d.new_users}`}
                        />
                        <div
                          className="flex-1 rounded-t-sm bg-gold/70"
                          style={{ height: `${(d.messages / maxMsgs) * 100}%` }}
                          title={`${d.messages}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(d.day).toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Model health — live ping, measured latency */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold">{t.adminPage.modelHealth}</h2>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tomaris 27B</span>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        stats.model.ok ? "text-primary" : "text-error"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          stats.model.ok ? "bg-primary" : "bg-error"
                        }`}
                      />
                      {stats.model.ok ? t.adminPage.online : t.adminPage.offline}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {t.adminPage.latency}:{" "}
                    <span className="font-mono text-ink">
                      {stats.model.latencyMs !== null ? `${stats.model.latencyMs}ms` : "—"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent users — real accounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 rounded-2xl border border-border bg-card"
            >
              <div className="border-b border-border p-4">
                <h2 className="font-semibold">{t.adminPage.recentUsers}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th scope="col" className="px-4 py-3 text-left font-medium">{t.common.email}</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium">{t.adminPage.chats}</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium">{t.adminPage.messages}</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium">{t.adminPage.joined}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((u) => (
                      <tr key={u.email} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-sm font-mono">{u.email}</td>
                        <td className="px-4 py-3 text-sm">{u.chats}</td>
                        <td className="px-4 py-3 text-sm">{u.messages}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent feedback — real submissions from the feedback form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-semibold">{t.adminPage.recentFeedback}</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {stats.totals.feedback.toLocaleString()}
                </span>
              </div>
              {stats.recentFeedback.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">{t.adminPage.noFeedback}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {stats.recentFeedback.map((f, i) => {
                    const Icon = f.sentiment ? sentimentIcon[f.sentiment] : null;
                    return (
                      <li key={i} className="flex gap-3 p-4">
                        {Icon && (
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="whitespace-pre-wrap break-words text-sm text-ink">{f.message}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                            <span className="font-mono">{f.email ?? t.adminPage.anonymous}</span>
                            <span aria-hidden="true">·</span>
                            <span>{new Date(f.created_at).toLocaleString()}</span>
                            {f.page && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono">{f.page}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
