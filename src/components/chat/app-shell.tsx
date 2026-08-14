"use client";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatSync } from "@/components/chat/chat-sync";
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts";
import { FeedbackDialog } from "@/components/shared/feedback-dialog";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-dvh overflow-hidden bg-background">
      <div className="hero-backdrop" aria-hidden="true" />
      <ChatSync />
      <ChatSidebar />
      <main className="relative flex min-w-0 flex-1 flex-col z-10">{children}</main>
      <KeyboardShortcuts />
      <FeedbackDialog />
    </div>
  );
}
