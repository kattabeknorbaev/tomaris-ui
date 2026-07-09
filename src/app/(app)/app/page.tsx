"use client";

import { useChatStore } from "@/stores/chat-store";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useI18n } from "@/components/shared/i18n-provider";
import { useEffect, useRef } from "react";

export default function AppPage() {
  const activeChat = useChatStore((s) =>
    s.chats.find((c) => c.id === s.activeChatId)
  );
  const createChat = useChatStore((s) => s.createChat);
  const sidebarOpen = useChatStore((s) => s.sidebarOpen);
  const { t } = useI18n();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      autoScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const lastMessage = activeChat?.messages[activeChat.messages.length - 1];

  // Follow the stream: throttled to one scroll per frame, instant (not smooth)
  // so per-token updates don't queue competing smooth animations.
  useEffect(() => {
    if (!autoScrollRef.current) return;
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const container = scrollContainerRef.current;
      if (container && autoScrollRef.current) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }, [activeChat?.messages.length, lastMessage?.content, lastMessage?.reasoning]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  const hasMessages = activeChat && activeChat.messages.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className={cn("flex h-12 shrink-0 items-center justify-between border-b border-border px-4", !sidebarOpen && "pl-14 md:pl-4")}>
        <span className="text-[13px] font-medium">Tomaris 27B</span>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {hasMessages ? (
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl py-4">
            {activeChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </div>
      ) : activeChat ? (
        <WelcomeScreen />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 text-mute mb-4">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h2 className="text-body-sm font-medium mb-1">{t.chat.noChatSelected}</h2>
          <p className="text-caption mb-4">{t.chat.noChatDesc}</p>
          <button
            onClick={() => createChat()}
            className="btn-lift rounded-xl bg-primary px-4 py-2 text-body-sm font-medium text-on-primary hover:bg-primary-deep shadow-[0_4px_14px_-4px_rgba(15,143,111,0.5)]"
          >
            {t.chat.newChat}
          </button>
        </div>
      )}

      <ChatInput />
    </div>
  );
}
