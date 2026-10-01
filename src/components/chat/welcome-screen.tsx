"use client";

import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/components/shared/i18n-provider";
import { GirihFigure, TomarisMark } from "@/components/shared/tomaris-mark";
import { motion } from "framer-motion";

const ENTER = [0.23, 1, 0.32, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: ENTER } },
};

export function WelcomeScreen() {
  const { data: session } = authClient.useSession();
  const { t } = useI18n();

  // First name from the account (Google name, else the email's local part).
  const rawName = session?.user?.name || session?.user?.email?.split("@")[0] || "";
  const firstName = rawName
    ? rawName.split(/[\s.]+/)[0].replace(/^\w/, (c) => c.toUpperCase())
    : "";

  const hour = new Date().getHours();
  const salutation =
    hour < 12 ? t.chat.goodMorning : hour < 18 ? t.chat.goodAfternoon : t.chat.goodEvening;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5">
      <GirihFigure className="pointer-events-none absolute left-1/2 top-1/2 w-[min(78vw,540px)] -translate-x-1/2 -translate-y-1/2 opacity-70" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex w-full max-w-xl flex-col items-center text-center"
      >
        <motion.span variants={item} className="t-avatar mb-7 h-11 w-11">
          <TomarisMark size={20} />
        </motion.span>
        <motion.h1
          variants={item}
          suppressHydrationWarning
          className="text-[clamp(34px,4.6vw,52px)] font-semibold leading-[1.06] tracking-[-0.034em] text-ink [text-wrap:balance]"
        >
          {firstName ? `${salutation}, ${firstName}.` : `${salutation}.`}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-4 max-w-[34ch] text-[clamp(16px,1.6vw,19px)] leading-[1.45] tracking-[-0.01em] text-mute"
        >
          {t.chat.helpSubline}
        </motion.p>
      </motion.div>
    </div>
  );
}
