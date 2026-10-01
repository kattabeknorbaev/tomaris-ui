"use client";

import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { cn } from "@/lib/utils";
import { orderTranscript } from "@/lib/message-order";
import type { Chat } from "@/types";
import { Plus, Settings, Trash2, Pencil, PanelLeftClose, PanelLeft, Search, Download, HelpCircle, Sparkles, Keyboard, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { TomarisLockup, TomarisMark } from "@/components/shared/tomaris-mark";
import { SHOW_SHORTCUTS_EVENT, FOCUS_SEARCH_EVENT } from "@/components/shared/keyboard-shortcuts";
import { SHOW_FEEDBACK_EVENT } from "@/components/shared/feedback-dialog";
import { authClient } from "@/lib/auth-client";

// Download a conversation as a portable Markdown file.
function downloadChatMarkdown(chat: Chat, assistantLabel: string) {
  const lines = [`# ${chat.title}`, ""];
  for (const m of orderTranscript(chat.messages)) {
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

  const homeHref = process.env.NODE_ENV === "development" ? "/" : "https://tomaris.ai";
  const email = session?.user?.email;
  const rowClass = "t-row w-full px-3 py-2 text-[13px]";

  return (
    <>
      {/* Collapsed state — mobile: floating chip over the page; desktop: slim floating rail */}
      {!sidebarOpen && (
        <button onClick={toggleSidebar} aria-label={t.chat.openSidebar} className="t-panel t-icon-btn fixed left-3 top-3 z-50 h-10 w-10 md:hidden">
          <PanelLeft className="h-4 w-4" />
        </button>
      )}
      {!sidebarOpen && (
        <div className="t-panel relative z-20 my-3 ml-3 hidden w-[52px] shrink-0 flex-col items-center gap-1 rounded-2xl py-2.5 md:flex">
          <a href={homeHref} aria-label="Tomaris" className="mb-1 flex h-9 w-9 items-center justify-center text-ink">
            <TomarisMark size={20} />
          </a>
          <button onClick={toggleSidebar} aria-label={t.chat.openSidebar} title={t.chat.openSidebar} className="t-icon-btn h-9 w-9">
            <PanelLeft className="h-4 w-4" />
          </button>
          <button onClick={handleNewChat} aria-label={t.chat.newChat} title={t.chat.newChat} className="t-icon-btn h-9 w-9">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] md:hidden" onClick={toggleSidebar} aria-hidden="true" />}

      <aside className={cn("t-panel fixed inset-y-0 left-0 z-40 flex w-[272px] max-w-[85vw] flex-col rounded-r-2xl border-l-0 transition-transform duration-200 md:relative md:z-20 md:my-3 md:ml-3 md:max-w-none md:rounded-2xl md:border-l md:transition-none", sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden")}>
        <div className="flex h-14 shrink-0 items-center justify-between pl-4 pr-2.5">
          <a href={homeHref} className="flex min-h-11 items-center">
            <TomarisLockup />
          </a>
          <button onClick={toggleSidebar} aria-label={t.chat.closeSidebar} title={t.chat.closeSidebar} className="t-icon-btn h-9 w-9">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="shrink-0 px-3 pb-2">
          <button onClick={handleNewChat} className="t-btn-primary h-10 w-full text-[13.5px]">
            <Plus className="h-4 w-4" />{t.chat.newChat}
          </button>
        </div>

        {chats.length > 0 && (
          <div className="shrink-0 px-3 pb-1">
            <div className="flex h-9 items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.03] px-3 transition-colors duration-150 focus-within:border-ink/25 focus-within:bg-ink/[0.05]">
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

        <div className="flex-1 overflow-y-auto px-3">
          <div className="px-3 pb-2 pt-4">
            <span className="t-label">{t.chat.history}</span>
          </div>
          <div className="space-y-0.5 pb-2">
            {chats.length === 0 && <p className="px-3 py-3 text-[13px] text-mute">{t.chat.noChats}</p>}
            {chats.length > 0 && filteredChats.length === 0 && <p className="px-3 py-3 text-[13px] text-mute">{t.chat.noChatsFound}</p>}
            {filteredChats.map((chat) => (
              <div key={chat.id} data-active={activeChatId === chat.id} className="t-row group cursor-pointer py-2 pl-3 pr-2 text-[13.5px]" onClick={() => openChat(chat.id)} onDoubleClick={() => handleRenameStart(chat)}>
                {renamingId === chat.id ? (
                  <input ref={renameRef} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={handleRenameSubmit} onKeyDown={(e) => { if (e.key === "Enter") handleRenameSubmit(); if (e.key === "Escape") setRenamingId(null); }} className="min-w-0 flex-1 border-b border-ink/40 bg-transparent text-[13.5px] text-ink outline-none" onClick={(e) => e.stopPropagation()} />
                ) : (
                  <span className="flex-1 truncate">{chat.title}</span>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleRenameStart(chat); }} aria-label={t.chat.rename} title={t.chat.rename} className="t-icon-btn hidden h-6 w-6 group-hover:inline-flex">
                  <Pencil className="h-3 w-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); downloadChatMarkdown(chat, "Tomaris"); }} aria-label={t.chat.exportChat} title={t.chat.exportChat} className="t-icon-btn hidden h-6 w-6 group-hover:inline-flex">
                  <Download className="h-3 w-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); if (window.confirm(t.chat.deleteChatConfirm)) deleteChat(chat.id); }} aria-label={t.chat.deleteChat} title={t.chat.deleteChat} className="t-icon-btn hidden h-6 w-6 hover:!text-error group-hover:inline-flex">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-hairline px-3 pb-3 pt-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-active={pathname === item.href} className={rowClass}>
              <item.icon className="h-3.5 w-3.5" />{item.label}
            </Link>
          ))}
          {/* Help — support, what's new, and keyboard shortcuts. These pages live in this
              app (chat.tomaris.ai); the tomaris.ai landing site has no /help. */}
          <a href="/help" target="_blank" rel="noopener noreferrer" className={rowClass}>
            <HelpCircle className="h-3.5 w-3.5" />{t.help.helpCenter}
          </a>
          <a href="/changelog" target="_blank" rel="noopener noreferrer" className={rowClass}>
            <Sparkles className="h-3.5 w-3.5" />{t.help.releaseNotes}
          </a>
          <button onClick={() => window.dispatchEvent(new CustomEvent(SHOW_SHORTCUTS_EVENT))} className={rowClass}>
            <Keyboard className="h-3.5 w-3.5" />{t.help.keyboardShortcuts}
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent(SHOW_FEEDBACK_EVENT))} className={rowClass}>
            <MessageSquarePlus className="h-3.5 w-3.5" />{t.feedback.button}
          </button>

          <Link href="/profile" data-active={pathname === "/profile"} className="t-row mt-2 w-full px-2 py-2 text-[13px]">
            <span className="t-avatar t-avatar-you">{email?.[0] ?? "U"}</span>
            <span className="min-w-0 flex-1 truncate">{email ?? t.common.profile}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
