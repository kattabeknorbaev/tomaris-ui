"use client";

import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  Clock,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const dailyData = [
  { day: "Mon", users: 2100, chats: 14200 },
  { day: "Tue", users: 2350, chats: 15800 },
  { day: "Wed", users: 2200, chats: 14900 },
  { day: "Thu", users: 2600, chats: 17200 },
  { day: "Fri", users: 2847, chats: 18432 },
  { day: "Sat", users: 1900, chats: 12300 },
  { day: "Sun", users: 1650, chats: 10800 },
];

const recentActivity = [
  { user: "user_2847", tokens: 1240, latency: "182ms", time: "2 min ago" },
  { user: "user_1923", tokens: 890, latency: "156ms", time: "5 min ago" },
  { user: "user_4521", tokens: 2100, latency: "203ms", time: "8 min ago" },
  { user: "user_3847", tokens: 560, latency: "145ms", time: "12 min ago" },
  { user: "user_5102", tokens: 1890, latency: "198ms", time: "15 min ago" },
];

const modelHealth = [
  { model: "Tomaris 27B", uptime: "99.97%", latency: "187ms", errors: "0.03%" },
  { model: "Tomaris Fast", uptime: "99.99%", latency: "89ms", errors: "0.01%" },
  { model: "Tomaris Code", uptime: "99.95%", latency: "210ms", errors: "0.05%" },
];

export default function AdminPage() {
  const { t } = useI18n();

  const stats = [
    {
      label: t.adminPage.dailyActiveUsers,
      value: "2,847",
      change: "+12.5%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: t.adminPage.totalChats,
      value: "18,432",
      change: "+8.2%",
      trend: "up" as const,
      icon: MessageSquare,
    },
    {
      label: t.adminPage.avgLatency,
      value: "187ms",
      change: "-5.3%",
      trend: "down" as const,
      icon: Clock,
    },
    {
      label: t.adminPage.tokensGenerated,
      value: "4.2M",
      change: "+15.1%",
      trend: "up" as const,
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              T
            </span>
            <span className="text-sm font-semibold">Tomaris Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {t.adminPage.live}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t.adminPage.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.adminPage.subtitle}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-primary" : "text-red-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2 rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">{t.adminPage.weeklyActivity}</h2>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {t.adminPage.users}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  {t.adminPage.chats}
                </span>
              </div>
            </div>
            <div className="flex items-end gap-3 h-48">
              {dailyData.map((day) => (
                <div
                  key={day.day}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="flex gap-1 items-end w-full h-full">
                    <div
                      className="flex-1 rounded-t-sm bg-primary/30"
                      style={{
                        height: `${(day.users / 3000) * 100}%`,
                      }}
                    >
                      <div className="h-full w-full bg-primary opacity-70 rounded-t-sm" />
                    </div>
                    <div
                      className="flex-1 rounded-t-sm bg-gold/30"
                      style={{
                        height: `${(day.chats / 20000) * 100}%`,
                      }}
                    >
                      <div className="h-full w-full bg-gold opacity-70 rounded-t-sm" />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Model Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">{t.adminPage.modelHealth}</h2>
            </div>
            <div className="space-y-4">
              {modelHealth.map((model) => (
                <div
                  key={model.model}
                  className="rounded-xl border border-border p-3"
                >
                  <div className="text-sm font-medium">{model.model}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">{t.adminPage.uptime}</div>
                      <div className="font-medium text-primary">
                        {model.uptime}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t.adminPage.latency}</div>
                      <div className="font-medium">{model.latency}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t.adminPage.errors}</div>
                      <div className="font-medium">{model.errors}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 rounded-2xl border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold">{t.adminPage.recentActivity}</h2>
            <button className="text-sm text-primary hover:underline">
              {t.adminPage.viewAll}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">{t.adminPage.users}</th>
                  <th className="px-4 py-3 text-left font-medium">Tokens</th>
                  <th className="px-4 py-3 text-left font-medium">{t.adminPage.latency}</th>
                  <th className="px-4 py-3 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr
                    key={activity.user}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 text-sm font-mono">
                      {activity.user}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {activity.tokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{activity.latency}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
