"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";

// Fired from anywhere (e.g. the sidebar Help link) to open the shortcuts panel.
export const SHOW_SHORTCUTS_EVENT = "tomaris:show-shortcuts";
// Fired when the user hits the "search chats" shortcut — the sidebar focuses
// its search box in response.
export const FOCUS_SEARCH_EVENT = "tomaris:focus-search";

// A single source of truth for the app's keyboard shortcuts: it both wires the
// global key handler and renders the help panel that documents them. Mounted
// once inside the authenticated app shell.
export function KeyboardShortcuts() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { createChat, toggleSidebar, setSidebarOpen } = useChatStore();
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time platform detect after mount; SSR can't read userAgent, so it must run client-side to avoid a hydration mismatch
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const openPanel = () => setOpen(true);
    window.addEventListener(SHOW_SHORTCUTS_EVENT, openPanel);
    return () => window.removeEventListener(SHOW_SHORTCUTS_EVENT, openPanel);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Escape closes the panel first; other shortcuts stay out of its way.
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      // New chat — ⌘/Ctrl + Shift + O (matches the common convention).
      if (e.shiftKey && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        createChat();
        if (pathname !== "/app") router.push("/app");
        return;
      }
      if (e.shiftKey) return;

      switch (e.key) {
        case "b":
        case "B":
          e.preventDefault();
          toggleSidebar();
          break;
        case "k":
        case "K":
          e.preventDefault();
          setSidebarOpen(true);
          window.dispatchEvent(new CustomEvent(FOCUS_SEARCH_EVENT));
          break;
        case "/":
          e.preventDefault();
          setOpen((v) => !v);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pathname, router, createChat, toggleSidebar, setSidebarOpen]);

  if (!open) return null;

  const mod = isMac ? "⌘" : "Ctrl";
  const rows: { label: string; keys: string[] }[] = [
    { label: t.shortcuts.newChat, keys: [mod, "Shift", "O"] },
    { label: t.shortcuts.toggleSidebar, keys: [mod, "B"] },
    { label: t.shortcuts.searchChats, keys: [mod, "K"] },
    { label: t.shortcuts.showShortcuts, keys: [mod, "/"] },
    { label: t.shortcuts.close, keys: ["Esc"] },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.shortcuts.title}
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">{t.shortcuts.title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.shortcuts.subtitle}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label={t.shortcuts.close}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-ink transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-ink">{row.label}</span>
              <span className="flex items-center gap-1">
                {row.keys.map((k) => (
                  <kbd
                    key={k}
                    className="min-w-[1.6rem] rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-center text-[11px] font-medium text-muted-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
