"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatSync } from "@/components/chat/chat-sync";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { FeedbackDialog } from "@/components/shared/feedback-dialog";
import { GirihGround } from "@/components/ui/girih-ground";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-dvh overflow-hidden">
      <GirihGround />
      <ChatSync />
      <ChatSidebar />
      <main className="relative z-10 flex min-w-0 flex-1 flex-col">{children}</main>
      <KeyboardShortcuts />
      <FeedbackDialog />
    </div>
  );
}
