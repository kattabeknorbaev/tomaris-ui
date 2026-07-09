"use client";

import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Bot, FolderOpen, Settings, Trash2, PanelLeftClose, PanelLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function ChatSidebar() {
  const { chats, activeChatId, setActiveChat, createChat, deleteChat, renameChat, sidebarOpen, toggleSidebar } = useChatStore();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { href: "/agents", icon: Bot, label: t.chat.agents },
    { href: "/workspace", icon: FolderOpen, label: t.chat.workspace },
    { href: "/settings", icon: Settings, label: t.chat.settings },
  ];

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  const handleRenameStart = (chat: { id: string; title: string }) => {
    setRenamingId(chat.id);
    setRenameValue(chat.title);
  };

  const handleRenameSubmit = () => {
    if (renamingId && renameValue.trim()) renameChat(renamingId, renameValue.trim());
    setRenamingId(null);
  };

  // Selecting or creating a chat from another page (settings, agents, …)
  // must also bring the user back to the chat surface.
  const openChat = (id: string) => {
    setActiveChat(id);
    if (pathname !== "/app") router.push("/app");
  };

  const handleNewChat = () => {
    createChat();
    if (pathname !== "/app") router.push("/app");
  };

  return (
    <>
      {/* Collapsed state — mobile: floating chip over the page; desktop: slim in-flow rail */}
      {!sidebarOpen && (
        <button onClick={toggleSidebar} aria-label="Open sidebar" className="fixed left-3 top-2 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-canvas text-muted-foreground shadow-sm hover:text-ink hover:bg-surface-2 transition-colors duration-150 md:hidden">
          <PanelLeft className="h-4 w-4" />
        </button>
      )}
      {!sidebarOpen && (
        <div className="hidden h-full w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-canvas-soft py-2 md:flex">
          <button onClick={toggleSidebar} aria-label="Open sidebar" className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2 transition-colors duration-150">
            <PanelLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNewChat} aria-label={t.chat.newChat} title={t.chat.newChat} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2 transition-colors duration-150">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={toggleSidebar} aria-hidden="true" />}

      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[260px] max-w-[85vw] flex-col border-r border-border bg-canvas-soft transition-transform duration-200 md:static md:z-auto md:h-full md:max-w-none md:transition-none", sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden")}>
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Tomaris" width={20} height={20} className="rounded-sm" />
            <span className="text-sm font-semibold text-ink">Tomaris</span>
          </Link>
          <button onClick={toggleSidebar} aria-label="Close sidebar" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2 transition-colors duration-150">
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="shrink-0 p-2.5">
          <button onClick={handleNewChat} className="flex w-full items-center gap-2 rounded-xl border border-border bg-canvas px-3 py-2 text-body-sm text-ink hover:bg-surface-2 hover:border-hairline-soft active:scale-[0.98] transition-all duration-150">
            <Plus className="h-4 w-4" />{t.chat.newChat}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2.5">
          <div className="mb-1.5 px-2 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-mute">{t.chat.history}</span>
          </div>
          <div className="space-y-px">
            {chats.length === 0 && <p className="px-2.5 py-4 text-caption text-mute text-center">{t.chat.noChats}</p>}
            {chats.map((chat) => (
              <div key={chat.id} className={cn("group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-body-sm cursor-pointer transition-colors duration-150", activeChatId === chat.id ? "bg-surface-2 text-ink" : "text-muted-foreground hover:text-ink hover:bg-surface-2")} onClick={() => openChat(chat.id)} onDoubleClick={() => handleRenameStart(chat)}>
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-40" />
                {renamingId === chat.id ? (
                  <input ref={renameRef} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={handleRenameSubmit} onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); if (e.key === "Escape") setRenamingId(null); }} className="flex-1 min-w-0 bg-transparent text-[13px] outline-none border-b border-primary" onClick={(e) => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 truncate text-[13px]">{chat.title}</span>
                )}
                <button onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }} aria-label="Delete chat" className="hidden h-5 w-5 items-center justify-center rounded text-mute hover:text-error group-hover:flex transition-colors duration-150">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-border p-2.5 space-y-px">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150", pathname === item.href ? "bg-surface-2 text-ink" : "text-muted-foreground hover:text-ink hover:bg-surface-2")}>
              <item.icon className="h-3.5 w-3.5 opacity-50" />{item.label}
            </Link>
          ))}
          <Link href="/profile" className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150", pathname === "/profile" ? "bg-surface-2 text-ink" : "text-muted-foreground hover:text-ink hover:bg-surface-2")}>
            <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-[8px] font-bold text-on-primary">U</div>
            {t.common.profile}
          </Link>
          <div className="flex items-center gap-2 px-2.5 pt-2 mt-1 border-t border-border">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
