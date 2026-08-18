"use client";

import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { cn } from "@/lib/utils";
import type { Chat } from "@/types";
import { MessageSquare, Plus, Settings, Trash2, Pencil, PanelLeftClose, PanelLeft, Search, Download, HelpCircle, Sparkles, Keyboard, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SHOW_SHORTCUTS_EVENT, FOCUS_SEARCH_EVENT } from "@/components/shared/keyboard-shortcuts";
import { SHOW_FEEDBACK_EVENT } from "@/components/shared/feedback-dialog";
import { authClient } from "@/lib/auth-client";

// Download a conversation as a portable Markdown file.
function downloadChatMarkdown(chat: Chat, assistantLabel: string) {
  const lines = [`# ${chat.title}`, ""];
  for (const m of chat.messages) {
    if (!m.content) continue;
    lines.push(`**${m.role === "user" ? "You" : assistantLabel}:**`, "", m.content, "");
  }
  const safeName = chat.title.replace(/[^\w\s-]/g, "").trim().slice(0, 40) || "chat";
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ChatSidebar() {
  const { chats, activeChatId, setActiveChat, createChat, deleteChat, renameChat, sidebarOpen, toggleSidebar } = useChatStore();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const { data: session } = authClient.useSession();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [query, setQuery] = useState("");
  const renameRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const filteredChats = q
    ? chats.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.messages.some((m) => m.content.toLowerCase().includes(q))
      )
    : chats;

  const navItems = [
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

  // Selecting or creating a chat from another page (settings, profile)
  // must also bring the user back to the chat surface.
  const openChat = (id: string) => {
    setActiveChat(id);
    if (pathname !== "/app") router.push("/app");
  };

  const handleNewChat = () => {
    createChat();
    if (pathname !== "/app") router.push("/app");
  };

  // The "search chats" keyboard shortcut (⌘/Ctrl+K) opens the sidebar and
  // focuses this search box.
  useEffect(() => {
    const focusSearch = () => searchRef.current?.focus();
    window.addEventListener(FOCUS_SEARCH_EVENT, focusSearch);
    return () => window.removeEventListener(FOCUS_SEARCH_EVENT, focusSearch);
  }, []);

  return (
    <>
      {/* Collapsed state — mobile: floating chip over the page; desktop: slim in-flow rail */}
      {!sidebarOpen && (
        <button onClick={toggleSidebar} aria-label={t.chat.openSidebar} className="fixed left-3 top-2 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-border/40 bg-canvas/50 backdrop-blur-md text-muted-foreground shadow-sm hover:text-ink hover:bg-surface-2/50 transition-colors duration-150 md:hidden">
          <PanelLeft className="h-4 w-4" />
        </button>
      )}
      {!sidebarOpen && (
        <div className="hidden h-full w-12 shrink-0 flex-col items-center gap-1 border-r border-border/20 bg-canvas-soft/30 backdrop-blur-xl py-2 md:flex">
          <button onClick={toggleSidebar} aria-label={t.chat.openSidebar} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2/50 transition-colors duration-150">
            <PanelLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNewChat} aria-label={t.chat.newChat} title={t.chat.newChat} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2/50 transition-colors duration-150">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={toggleSidebar} aria-hidden="true" />}

      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[260px] max-w-[85vw] flex-col border-r border-border/20 bg-canvas-soft/30 backdrop-blur-xl transition-transform duration-200 md:static md:z-auto md:h-full md:max-w-none md:transition-none", sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden")}>
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/20 px-3">
          <Link href={process.env.NODE_ENV === "development" ? "/" : "https://tomaris.ai"} className="flex items-center gap-2">
            <Image src="/logo.png" alt="Tomaris" width={20} height={20} className="rounded-sm" />
            <span className="text-sm font-semibold text-ink">Tomaris</span>
          </Link>
          <button onClick={toggleSidebar} aria-label={t.chat.closeSidebar} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2/50 transition-colors duration-150">
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="shrink-0 p-2.5 pb-1.5">
          <button onClick={handleNewChat} className="btn-lift flex w-full items-center gap-2 rounded-xl border border-border/30 bg-canvas/30 px-3 py-2 text-body-sm font-semibold text-ink hover:bg-surface-2/50 hover:border-border/60 shadow-[var(--shadow-sm)]">
            <Plus className="h-4 w-4" />{t.chat.newChat}
          </button>
        </div>

        {chats.length > 0 && (
          <div className="shrink-0 px-2.5 pb-1">
            <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-canvas/30 px-2.5 py-1.5 focus-within:border-primary/40 focus-within:bg-canvas/50 transition-colors duration-150">
              <Search className="h-3.5 w-3.5 shrink-0 text-mute" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.chat.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-mute"
                aria-label={t.chat.searchPlaceholder}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2.5">
          <div className="mb-1.5 px-2 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-mute">{t.chat.history}</span>
          </div>
          <div className="space-y-px">
            {chats.length === 0 && <p className="px-2.5 py-4 text-caption text-mute text-center">{t.chat.noChats}</p>}
            {chats.length > 0 && filteredChats.length === 0 && <p className="px-2.5 py-4 text-caption text-mute text-center">{t.chat.noChatsFound}</p>}
            {filteredChats.map((chat) => (
              <div key={chat.id} className={cn("group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-body-sm cursor-pointer transition-colors duration-150", activeChatId === chat.id ? "bg-surface-2/60 text-ink shadow-[var(--shadow-sm)]" : "text-muted-foreground hover:text-ink hover:bg-surface-2/40")} onClick={() => openChat(chat.id)} onDoubleClick={() => handleRenameStart(chat)}>
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-40" />
                {renamingId === chat.id ? (
                  <input ref={renameRef} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={handleRenameSubmit} onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); if (e.key === "Escape") setRenamingId(null); }} className="flex-1 min-w-0 bg-transparent text-[13px] outline-none border-b border-primary" onClick={(e) => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 truncate text-[13px]">{chat.title}</span>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleRenameStart(chat); }} aria-label={t.chat.rename} title={t.chat.rename} className="hidden h-5 w-5 items-center justify-center rounded text-mute hover:text-ink group-hover:flex transition-colors duration-150">
                  <Pencil className="h-3 w-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); downloadChatMarkdown(chat, "Tomaris"); }} aria-label={t.chat.exportChat} title={t.chat.exportChat} className="hidden h-5 w-5 items-center justify-center rounded text-mute hover:text-ink group-hover:flex transition-colors duration-150">
                  <Download className="h-3 w-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); if (window.confirm(t.chat.deleteChatConfirm)) deleteChat(chat.id); }} aria-label={t.chat.deleteChat} title={t.chat.deleteChat} className="hidden h-5 w-5 items-center justify-center rounded text-mute hover:text-error group-hover:flex transition-colors duration-150">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-border/20 p-2.5 space-y-px">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150", pathname === item.href ? "bg-surface-2/60 text-ink" : "text-muted-foreground hover:text-ink hover:bg-surface-2/40")}>
              <item.icon className="h-3.5 w-3.5 opacity-50" />{item.label}
            </Link>
          ))}
          <Link href="/profile" className={cn("flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150", pathname === "/profile" ? "bg-surface-2/60 text-ink" : "text-muted-foreground hover:text-ink hover:bg-surface-2/40")}>
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-primary text-[8px] font-bold uppercase text-on-primary">
              {session?.user?.email?.[0] ?? "U"}
            </div>
            <span className="flex-1 truncate">{session?.user?.email ?? t.common.profile}</span>
          </Link>
          {/* Help — support, what's new, and keyboard shortcuts. */}
          <div className="px-2.5 pt-1.5 pb-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-mute">{t.help.section}</span>
          </div>
          <a href={process.env.NODE_ENV === "development" ? "/help" : "https://tomaris.ai/help"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-surface-2/40 hover:text-ink">
            <HelpCircle className="h-3.5 w-3.5 opacity-50" />{t.help.helpCenter}
          </a>
          <a href={process.env.NODE_ENV === "development" ? "/changelog" : "https://tomaris.ai/changelog"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-surface-2/40 hover:text-ink">
            <Sparkles className="h-3.5 w-3.5 opacity-50" />{t.help.releaseNotes}
          </a>
          <button onClick={() => window.dispatchEvent(new CustomEvent(SHOW_SHORTCUTS_EVENT))} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-surface-2/40 hover:text-ink">
            <Keyboard className="h-3.5 w-3.5 opacity-50" />{t.help.keyboardShortcuts}
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent(SHOW_FEEDBACK_EVENT))} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-surface-2/40 hover:text-ink">
            <MessageSquarePlus className="h-3.5 w-3.5 opacity-50" />{t.feedback.button}
          </button>
          <div className="flex items-center gap-2 px-2.5 pt-2 mt-1 border-t border-border/20">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
