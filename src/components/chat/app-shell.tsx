"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatSync } from "@/components/chat/chat-sync";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatSync />
      <ChatSidebar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
