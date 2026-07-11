"use client";

import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Atom, FileText, Code2, Briefcase, ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";

const promptIcons = [Atom, FileText, Code2, Briefcase];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export function WelcomeScreen() {
  const setPendingPrompt = useChatStore((s) => s.setPendingPrompt);
  const { t } = useI18n();
  const { data: session } = authClient.useSession();

  // First name from the account (Google name, else the email's local part).
  const rawName = session?.user?.name || session?.user?.email?.split("@")[0] || "";
  const firstName = rawName
    ? rawName.split(/[\s.]+/)[0].replace(/^\w/, (c) => c.toUpperCase())
    : "";

  // Time-of-day greeting — computed on the client, so it's the user's local time.
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? t.chat.goodMorning : hour < 18 ? t.chat.goodAfternoon : t.chat.goodEvening;
  const greeting = firstName ? `${timeGreeting}, ${firstName}` : timeGreeting;

  const prompts = t.chat.suggestedPrompts;

  const handlePromptClick = (text: string) => {
    setPendingPrompt(text);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-xl"
      >
        {/* Personal, time-aware greeting — the warm editorial serif is the
            focal point, not a glowing logo. */}
        <motion.h1
          variants={item}
          className="text-center font-serif text-3xl font-medium tracking-tight text-ink-strong sm:text-[2.5rem] sm:leading-[1.1]"
        >
          {greeting}
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-3 text-center text-body text-muted-foreground"
        >
          {t.chat.helpSubline}
        </motion.p>

        {/* Suggested prompts */}
        <div className="mt-10 grid gap-2.5 sm:grid-cols-2">
          {prompts.map((text, i) => {
            const Icon = promptIcons[i] || Atom;
            return (
              <motion.button
                key={i}
                variants={item}
                onClick={() => handlePromptClick(text)}
                className="card-lift group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="flex-1 text-body-sm line-clamp-2 text-muted-foreground transition-colors group-hover:text-ink">
                  {text}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-mute opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-primary" aria-hidden="true" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
