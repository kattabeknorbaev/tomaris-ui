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
  const { theme: rawTheme, setTheme } = useTheme();
  // next-themes only knows the theme on the client; reading it during SSR
  // left neither option highlighted after hydration.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  useEffect(() => setMounted(true), []);
  const theme = mounted ? rawTheme : undefined;
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
    router.push("/");
  };

  const optionClass = (active: boolean) =>
    `flex h-10 items-center justify-center gap-2 rounded-full border text-[13.5px] transition-colors duration-150 ${
      active
        ? "border-ink/20 bg-ink/[0.09] text-ink shadow-[inset_0_1px_0_var(--specular)]"
        : "border-hairline text-mute hover:bg-ink/[0.05] hover:text-ink"
    }`;
  const dangerRow =
    "flex w-full items-center gap-3 rounded-[10px] border border-error/25 px-3.5 py-3 text-left transition-colors duration-150 hover:bg-error/[0.06] disabled:opacity-60";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-xl px-4 pb-12 pt-16 md:pt-14">
        <div className="mb-8">
          <h1 className="text-[clamp(28px,3vw,36px)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">{t.settingsPage.title}</h1>
          <p className="mt-2 text-[15px] text-mute">{t.settingsPage.subtitle}</p>
        </div>

        {saved && (
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-[13px] text-ink" role="status">
            <span className="t-dot" aria-hidden="true" />
            {t.settingsPage.saved}
          </div>
        )}

        <div className="space-y-4">
          {/* Appearance */}
          <section className="t-card p-5">
            <div className="mb-4 flex items-center gap-2 text-mute">
              {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              <span className="t-label">{t.settingsPage.appearance}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setTheme("light")} aria-pressed={theme === "light"} className={optionClass(theme === "light")}>
                <Sun className="h-4 w-4" />{t.common.lightMode}
              </button>
              <button onClick={() => setTheme("dark")} aria-pressed={theme === "dark"} className={optionClass(theme === "dark")}>
                <Moon className="h-4 w-4" />{t.common.darkMode}
              </button>
            </div>
          </section>

          {/* Language */}
          <section className="t-card p-5">
            <div className="mb-4 flex items-center gap-2 text-mute">
              <Globe className="h-3.5 w-3.5" />
              <span className="t-label">{t.common.language}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { code: "en" as const, label: "English" },
                { code: "uz" as const, label: "O'zbek" },
                { code: "ru" as const, label: "Русский" },
              ]).map((lang) => (
                <button key={lang.code} onClick={() => setLocale(lang.code)} aria-pressed={locale === lang.code} className={optionClass(locale === lang.code)}>
                  {lang.label}
                </button>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="t-card p-5">
            <div className="mb-4 flex items-center gap-2 text-mute">
              <Bell className="h-3.5 w-3.5" />
              <span className="t-label">{t.settingsPage.notifications}</span>
            </div>
            <div className="divide-y divide-hairline">
              {([
                { key: "email" as const, label: t.settingsPage.emailNotif, desc: t.settingsPage.emailNotifDesc },
                { key: "push" as const, label: t.settingsPage.pushNotif, desc: t.settingsPage.pushNotifDesc },
                { key: "marketing" as const, label: t.settingsPage.marketingNotif, desc: t.settingsPage.marketingNotifDesc },
              ]).map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-[14px] text-ink">{item.label}</div>
                    <div className="mt-0.5 text-[12.5px] text-mute">{item.desc}</div>
                  </div>
                  <button onClick={() => saveNotifications({ [item.key]: !notifications[item.key] })} role="switch" aria-checked={notifications[item.key]} aria-label={item.label} className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-150 ${notifications[item.key] ? "border-success/40 bg-success" : "border-hairline bg-ink/10"}`}>
                    <span className={`absolute left-0 top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${notifications[item.key] ? "translate-x-[19px]" : "translate-x-[3px]"}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section className="t-card p-5">
            <div className="mb-4 flex items-center gap-2 text-mute">
              <Shield className="h-3.5 w-3.5" />
              <span className="t-label">{t.settingsPage.privacyData}</span>
            </div>
            <div className="space-y-2">
              <button onClick={exportData} disabled={busy} className="flex w-full items-center gap-3 rounded-[10px] border border-hairline px-3.5 py-3 text-left transition-colors duration-150 hover:bg-ink/[0.04] disabled:opacity-60">
                <Download className="h-4 w-4 shrink-0 text-mute" aria-hidden="true" />
                <div>
                  <div className="text-[14px] text-ink">{t.settingsPage.exportData}</div>
                  <div className="mt-0.5 text-[12.5px] text-mute">{t.settingsPage.exportDesc}</div>
                </div>
              </button>
              <button onClick={clearChats} disabled={busy} className={dangerRow}>
                <Trash2 className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                <div>
                  <div className="text-[14px] text-error">{t.settingsPage.clearChatsBtn}</div>
                  <div className="mt-0.5 text-[12.5px] text-mute">{t.settingsPage.clearChatsDesc}</div>
                </div>
              </button>
              <button onClick={deleteAccount} disabled={busy} className={dangerRow}>
                <UserX className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                <div>
                  <div className="text-[14px] text-error">{t.settingsPage.deleteAccount}</div>
                  <div className="mt-0.5 text-[12.5px] text-mute">{t.settingsPage.deleteDesc}</div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
