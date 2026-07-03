"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { useChatStore } from "@/stores/chat-store";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useChatStore();

  return (
    <div className="flex h-screen overflow-hidden">
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
