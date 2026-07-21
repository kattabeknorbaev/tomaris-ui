"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Smile, Meh, Frown } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/components/shared/i18n-provider";
import { cn } from "@/lib/utils";

// Fired from anywhere (e.g. the sidebar Help section) to open the feedback form.
export const SHOW_FEEDBACK_EVENT = "tomaris:show-feedback";

type Sentiment = "positive" | "neutral" | "negative" | "";

// A lightweight feedback form. Submissions POST to /api/feedback, which emails
// the team via Resend (same delivery as the contact form). Mounted once in the
// app shell; opened via SHOW_FEEDBACK_EVENT.
export function FeedbackDialog() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment>("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(SHOW_FEEDBACK_EVENT, show);
    return () => window.removeEventListener(SHOW_FEEDBACK_EVENT, show);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async () => {
    if (message.trim().length < 2 || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          sentiment: sentiment || undefined,
          email: session?.user?.email,
          page: pathname,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(t.feedback.sent);
      setMessage("");
      setSentiment("");
      setOpen(false);
    } catch {
      toast.error(t.feedback.failed);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  const sentiments: { key: Exclude<Sentiment, "">; icon: typeof Smile; label: string }[] = [
    { key: "positive", icon: Smile, label: t.feedback.good },
    { key: "neutral", icon: Meh, label: t.feedback.okay },
    { key: "negative", icon: Frown, label: t.feedback.bad },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.feedback.title}
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">{t.feedback.title}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t.feedback.subtitle}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label={t.feedback.cancel}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-ink transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Optional sentiment */}
        <p className="mt-4 mb-2 text-xs font-medium text-muted-foreground">{t.feedback.sentimentLabel}</p>
        <div className="grid grid-cols-3 gap-2">
          {sentiments.map((s) => {
            const active = sentiment === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSentiment(active ? "" : s.key)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs transition-colors duration-150",
                  active
                    ? "border-primary bg-primary/5 text-ink"
                    : "border-border text-muted-foreground hover:bg-surface-2 hover:text-ink"
                )}
              >
                <s.icon className="h-5 w-5" />
                {s.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder={t.feedback.placeholder}
          rows={4}
          autoFocus
          className="mt-4 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary placeholder:text-mute"
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-ink transition-colors duration-150"
          >
            {t.feedback.cancel}
          </button>
          <button
            onClick={submit}
            disabled={sending || message.trim().length < 2}
            className="btn-lift rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-deep disabled:opacity-50 disabled:pointer-events-none"
          >
            {sending ? t.feedback.sending : t.feedback.send}
          </button>
        </div>
      </div>
    </div>
  );
}
