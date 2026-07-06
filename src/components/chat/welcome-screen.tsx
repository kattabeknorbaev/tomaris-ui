"use client";

import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { motion } from "framer-motion";
import { Atom, FileText, Code2, FileScan, ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";

const promptIcons = [Atom, FileText, Code2, FileScan];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

export function WelcomeScreen() {
  const { addMessage, activeChatId, createChat } = useChatStore();
  const { t } = useI18n();

  const prompts = [
    t.features.items[0]?.desc || "Explain quantum physics in Uzbek",
    t.features.items[1]?.desc || "Translate this contract to English",
    t.features.items[2]?.desc || "Write Python code for a web scraper",
    t.features.items[3]?.desc || "Summarize this document",
  ];

  const handlePromptClick = (text: string) => {
    let chatId = activeChatId;
    if (!chatId || chatId === "welcome") {
      chatId = createChat();
    }
    addMessage(chatId, { role: "user", content: text });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-xl text-center"
      >
        {/* Logo */}
        <motion.div
          variants={item}
          className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_8px_24px_-6px_rgba(15,143,111,0.6)]"
        >
          <span className="text-xl font-bold">T</span>
        </motion.div>

        {/* Greeting */}
        <motion.h1 variants={item} className="text-heading-2 text-ink-strong">
          {t.chat.greeting}
        </motion.h1>

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
