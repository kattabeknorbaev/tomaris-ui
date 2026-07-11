"use client";

import { useState, useEffect } from "react";
import { Globe, Moon, Sun, Bell, Shield, Trash2, Download, UserX } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useI18n } from "@/components/shared/i18n-provider";
import { useChatStore } from "@/stores/chat-store";
import { apiLoadChats } from "@/lib/chat-api";
import { authClient } from "@/lib/auth-client";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const [notifications, setNotifications] = useState({ email: true, push: false, marketing: false });
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tomaris-notifications");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage read after mount; SSR can't know client prefs
    if (stored) setNotifications(JSON.parse(stored));
  }, []);

  const saveNotifications = (updates: Partial<typeof notifications>) => {
    const next = { ...notifications, ...updates };
    setNotifications(next);
    localStorage.setItem("tomaris-notifications", JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Export from the server (account truth), falling back to the local store
  // for guests or when the network is down.
  const exportData = async () => {
    setBusy(true);
    const serverChats = await apiLoadChats();
    setBusy(false);
    const chats = serverChats.length ? serverChats : useChatStore.getState().chats;
    const data = {
      exportedAt: new Date().toISOString(),
      chats,
      settings: { notifications, locale, theme },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tomaris-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Deletes every chat server-side AND locally, keeping the session and
  // sync ownership intact.
  const clearChats = async () => {
    if (!window.confirm(t.settingsPage.clearChatsConfirm)) return;
    setBusy(true);
    try {
      await fetch("/api/chats", { method: "DELETE" });
      useChatStore.getState().clearChats();
      toast.success(t.settingsPage.dataCleared);
    } catch {
      toast.error(t.auth.sendFailed);
    } finally {
      setBusy(false);
    }
  };

  // Real account deletion: Better Auth removes the user; chats cascade in
  // the database. Then a full local reset and back to the landing page.
  const deleteAccount = async () => {
    if (!window.confirm(t.settingsPage.deleteConfirm)) return;
    setBusy(true);
    const { error } = await authClient.deleteUser();
    setBusy(false);
    if (error) {
      toast.error(t.settingsPage.accountDeleteFailed);
      return;
    }
    useChatStore.getState().clearAllChats();
    localStorage.removeItem("tomaris-notifications");
    toast.success(t.settingsPage.accountDeleted);
    router.push("/home");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold">{t.settingsPage.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.settingsPage.subtitle}</p>
        </div>

        {saved && (
          <div className="mb-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary" role="status">{t.settingsPage.saved}</div>
        )}

        <div className="space-y-4">
          {/* Appearance */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
              <span className="text-sm font-medium">{t.settingsPage.appearance}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setTheme("light")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                <Sun className="h-4 w-4" />{t.common.lightMode}
              </button>
              <button onClick={() => setTheme("dark")} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                <Moon className="h-4 w-4" />{t.common.darkMode}
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t.common.language}</span>
            </div>
            <select value={locale} onChange={(e) => setLocale(e.target.value as "en" | "uz" | "ru")} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
              <option value="en">English</option>
              <option value="uz">O&apos;zbek</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t.settingsPage.notifications}</span>
            </div>
            <div className="space-y-3">
              {([
                { key: "email" as const, label: t.settingsPage.emailNotif, desc: t.settingsPage.emailNotifDesc },
                { key: "push" as const, label: t.settingsPage.pushNotif, desc: t.settingsPage.pushNotifDesc },
                { key: "marketing" as const, label: t.settingsPage.marketingNotif, desc: t.settingsPage.marketingNotifDesc },
              ]).map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <button onClick={() => saveNotifications({ [item.key]: !notifications[item.key] })} role="switch" aria-checked={notifications[item.key]} className={`relative h-5 w-9 rounded-full transition-colors ${notifications[item.key] ? "bg-primary" : "bg-muted"}`}>
                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${notifications[item.key] ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{t.settingsPage.privacyData}</span>
            </div>
            <div className="space-y-2">
              <button onClick={exportData} disabled={busy} className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-60">
                <Download className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium">{t.settingsPage.exportData}</div>
                  <div className="text-xs text-muted-foreground">{t.settingsPage.exportDesc}</div>
                </div>
              </button>
              <button onClick={clearChats} disabled={busy} className="flex w-full items-center gap-2 rounded-md border border-error/20 px-3 py-2 text-sm hover:bg-error/5 transition-colors disabled:opacity-60">
                <Trash2 className="h-4 w-4 text-error" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium text-error">{t.settingsPage.clearChatsBtn}</div>
                  <div className="text-xs text-muted-foreground">{t.settingsPage.clearChatsDesc}</div>
                </div>
              </button>
              <button onClick={deleteAccount} disabled={busy} className="flex w-full items-center gap-2 rounded-md border border-error/20 px-3 py-2 text-sm hover:bg-error/5 transition-colors disabled:opacity-60">
                <UserX className="h-4 w-4 text-error" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium text-error">{t.settingsPage.deleteAccount}</div>
                  <div className="text-xs text-muted-foreground">{t.settingsPage.deleteDesc}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
