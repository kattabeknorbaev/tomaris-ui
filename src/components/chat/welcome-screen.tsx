"use client";

import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { Atom, FileText, Code2, FileScan } from "lucide-react";

const promptIcons = [Atom, FileText, Code2, FileScan];

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
      <div className="mx-auto max-w-xl text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
          <span className="text-lg font-bold">T</span>
        </div>

        {/* Greeting */}
        <h1 className="text-heading-2">{t.chat.greeting}</h1>

        {/* Suggested prompts */}
        <div className="mt-10 grid gap-2.5 sm:grid-cols-2">
          {prompts.map((text, i) => {
            const Icon = promptIcons[i] || Atom;
            return (
              <button
                key={i}
                onClick={() => handlePromptClick(text)}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 text-left transition-all hover:bg-muted active:scale-[0.98]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-body-sm line-clamp-2 text-muted-foreground">
                  {text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
