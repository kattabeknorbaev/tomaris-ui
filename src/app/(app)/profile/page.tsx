"use client";

import { motion } from "framer-motion";
import {
  Crown,
  MessageSquare,
  MessagesSquare,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/shared/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { useChatStore } from "@/stores/chat-store";

// Everything shown here is real: identity from the session, counts from the
// user's actual synced chats. No fabricated usage numbers.
export default function ProfilePage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const chats = useChatStore((s) => s.chats);
  const clearAllChats = useChatStore((s) => s.clearAllChats);
  const [signingOut, setSigningOut] = useState(false);

  // Sign out lives here now (removed from the sidebar): end the session, drop
  // this account's chats from the browser, and return to login.
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      clearAllChats();
      router.push("/login");
    } finally {
      setSigningOut(false);
    }
  };

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

  const enter = (i: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.56, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] as const },
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 pb-12 pt-16 sm:px-6 md:pt-14">
        <div className="mb-8">
          <h1 className="text-[clamp(28px,3vw,36px)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">{t.profilePage.title}</h1>
          <p className="mt-2 text-[15px] text-mute">{t.profilePage.subtitle}</p>
        </div>

        {/* User info — real session data */}
        <motion.div {...enter(0)} className="t-card mb-4 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="t-avatar t-avatar-you h-14 w-14 text-[18px]">{initial}</span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[18px] font-semibold tracking-[-0.022em] text-ink">{name}</h2>
              <p className="truncate text-[14px] text-mute">{email}</p>
              <span className="t-chip mt-2">
                <Crown className="h-3 w-3" />
                {t.profilePage.freePlan}
              </span>
            </div>
            <Link href="/pricing" className="t-btn-primary h-10 shrink-0 px-4 text-[14px]">
              {t.profilePage.upgrade}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Real usage stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} {...enter(i + 1)} className="t-card p-4">
              <stat.icon className="h-4 w-4 text-mute" />
              <div className="mt-3 text-[20px] font-semibold tabular-nums tracking-[-0.022em] text-ink">{stat.value}</div>
              <div className="t-label mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Billing — honestly empty on the free plan */}
        <motion.div {...enter(4)} className="t-card p-6">
          <h3 className="t-label">{t.profilePage.billingHistory}</h3>
          <div className="py-8 text-center">
            <CreditCard className="mx-auto h-7 w-7 text-mute" />
            <p className="mt-3 text-[14px] text-mute">{t.profilePage.noBilling}</p>
            <Link
              href="/pricing"
              className="mt-3 inline-block text-[14px] text-ink underline decoration-ink/30 underline-offset-[3px] transition-colors hover:decoration-ink"
            >
              {t.profilePage.viewPlans} →
            </Link>
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div {...enter(5)} className="mt-4">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="t-btn-secondary h-11 w-full text-[14px]"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? t.chat.signingOut : t.chat.signOut}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
