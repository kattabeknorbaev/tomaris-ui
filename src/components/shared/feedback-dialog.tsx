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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden="true" />
      <div
        className="t-panel relative w-full max-w-md rounded-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.022em] text-ink">{t.feedback.title}</h2>
            <p className="mt-1 text-[13px] text-mute">{t.feedback.subtitle}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label={t.feedback.cancel}
            className="t-icon-btn h-8 w-8"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Optional sentiment */}
        <p className="t-label mb-2 mt-5">{t.feedback.sentimentLabel}</p>
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
                  "flex flex-col items-center gap-1.5 rounded-[10px] border px-2 py-3 text-[12.5px] transition-colors duration-150",
                  active
                    ? "border-ink/20 bg-ink/[0.09] text-ink shadow-[inset_0_1px_0_var(--specular)]"
                    : "border-hairline text-mute hover:bg-ink/[0.05] hover:text-ink"
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
          className="t-input mt-4 resize-none text-[14px]"
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="t-icon-btn h-9 px-4 text-[14px]"
          >
            {t.feedback.cancel}
          </button>
          <button
            onClick={submit}
            disabled={sending || message.trim().length < 2}
            className="t-btn-primary h-9 px-4 text-[14px]"
          >
            {sending ? t.feedback.sending : t.feedback.send}
          </button>
        </div>
      </div>
    </div>
  );
}
