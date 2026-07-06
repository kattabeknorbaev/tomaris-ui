"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { useChatStore } from "@/stores/chat-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useChatStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-dvh overflow-hidden">
      <ChatSidebar />
      <main
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          sidebarOpen ? "md:ml-[260px]" : "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
