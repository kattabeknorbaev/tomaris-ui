"use client";

import { useChatStore } from "@/stores/chat-store";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useCallback, useEffect, useRef } from "react";

export default function AppPage() {
  const activeChat = useChatStore((s) =>
    s.chats.find((c) => c.id === s.activeChatId)
  );
  const sidebarOpen = useChatStore((s) => s.sidebarOpen);
  const { data: session } = authClient.useSession();
  const userInitial = (
    session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "U"
  ).toUpperCase();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true);
  const scrollRafRef = useRef<number | null>(null);
  const prevChatIdRef = useRef<string | undefined>(undefined);
  const prevLenRef = useRef(0);

  // If the user is within 100px of the bottom we keep following the stream;
  // scrolling up further releases the follow so they can read earlier replies.
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    autoScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  // Callback ref so the listener attaches the moment the scroll container
  // mounts. The container renders conditionally, so a mount-time effect with
  // [] deps would run while it's still null and never attach — which left
  // auto-scroll stuck on and made it impossible to scroll up mid-stream.
  const setScrollContainer = useCallback(
    (node: HTMLDivElement | null) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
      scrollContainerRef.current = node;
      if (node) node.addEventListener("scroll", handleScroll, { passive: true });
    },
    [handleScroll]
  );

  const lastMessage = activeChat?.messages[activeChat.messages.length - 1];

  // A new chat or a new message (a new turn) should snap back to the bottom.
  useEffect(() => {
    const id = activeChat?.id;
    const len = activeChat?.messages.length ?? 0;
    if (id !== prevChatIdRef.current || len > prevLenRef.current) {
      autoScrollRef.current = true;
    }
    prevChatIdRef.current = id;
    prevLenRef.current = len;
  }, [activeChat?.id, activeChat?.messages.length]);

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
  const streaming = !!activeChat?.messages.some((m) => m.isStreaming);

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
        <div ref={setScrollContainer} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl py-4">
            {activeChat.messages.map((message, i) => (
              <ChatMessage
                key={message.id}
                message={message}
                userInitial={userInitial}
                isLast={i === activeChat.messages.length - 1}
                busy={streaming}
              />
            ))}
          </div>
        </div>
      ) : (
        // No chat selected or an empty chat — either way, the welcome surface
        // (greeting + suggested prompts). Sending a message creates the chat.
        <WelcomeScreen />
      )}

      <ChatInput />
    </div>
  );
}
