"use client";

import { useChatStore } from "@/stores/chat-store";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { ModelSelector } from "@/components/chat/model-selector";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { Search, MoreHorizontal, MessageSquare } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useEffect, useRef } from "react";

export default function AppPage() {
  const { chats, activeChatId } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const activeChat = chats.find((c) => c.id === activeChatId);

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

  useEffect(() => {
    if (autoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages?.length, activeChat?.messages?.[activeChat.messages.length - 1]?.content]);

  const hasMessages = activeChat && activeChat.messages.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <ModelSelector />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-body hover:bg-surface-2 hover:text-ink transition-colors duration-150" aria-label="Search">
            <Search className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-body hover:bg-surface-2 hover:text-ink transition-colors duration-150" aria-label="More options">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {hasMessages ? (
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl py-4">
            {activeChat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : activeChat ? (
        <WelcomeScreen />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-medium mb-1">No chat selected</h2>
          <p className="text-xs text-muted-foreground mb-4">Create a new chat to get started</p>
          <button
            onClick={() => useChatStore.getState().createChat()}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            New Chat
          </button>
        </div>
      )}

      <ChatInput />
    </div>
  );
}
