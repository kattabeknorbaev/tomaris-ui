"use client";

import { useState, memo, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { Copy, Check, Brain, ChevronDown, RotateCcw, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useI18n } from "@/components/shared/i18n-provider";
import { useChatStore } from "@/stores/chat-store";
import { TomarisMark } from "@/components/shared/tomaris-mark";

/**
 * "Oʻzbekiston Respublikasining Mehnat kodeksi" -> "Mehnat kodeksi".
 * The official prefix is on every code title and would blow out the chip.
 */
function shortCodeName(codeTitle: string | undefined, slug: string): string {
  if (!codeTitle) return slug.replace(/_/g, " ");
  return codeTitle.replace(/^O[\u02bb'’]?zbekiston Respublikasining\s+/i, "").trim() || slug;
}

// Pull the raw text out of a React node tree (for copying code verbatim).
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

// Fenced code block with a language label and a copy button.
function CodeBlock({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const codeEl = Array.isArray(children) ? children[0] : children;
  const className = isValidElement(codeEl)
    ? (codeEl.props as { className?: string }).className ?? ""
    : "";
  const lang = /language-(\w+)/.exec(className)?.[1] ?? "";
  const raw = extractText(children).replace(/\n$/, "");

  const handleCopyCode = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="code-block my-3 overflow-hidden rounded-[10px] border border-hairline bg-surface-1 shadow-[inset_0_1px_0_var(--specular)]">
      <div className="flex items-center justify-between border-b border-hairline bg-ink/[0.025] py-1 pl-3.5 pr-1.5">
        <span className="t-label">{lang || "code"}</span>
        <button
          onClick={handleCopyCode}
          className="t-icon-btn h-7 gap-1 px-2 text-[11.5px]"
          aria-label={t.chat.copyCode}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" /> {t.chat.copied}
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> {t.chat.copy}
            </>
          )}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-[5px]">
      <span className="typing-dot h-[5px] w-[5px] rounded-full bg-body" />
      <span className="typing-dot h-[5px] w-[5px] rounded-full bg-body" />
      <span className="typing-dot h-[5px] w-[5px] rounded-full bg-body" />
    </span>
  );
}

const MarkdownContent = memo(function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-tomaris">
      <ReactMarkdown components={{ pre: CodeBlock }}>{content}</ReactMarkdown>
    </div>
  );
});

export const ChatMessage = memo(function ChatMessage({
  message,
  userInitial = "U",
  isLast = false,
  busy = false,
}: {
  message: Message;
  userInitial?: string;
  /** The last message in the chat — only then is "Regenerate" offered. */
  isLast?: boolean;
  /** A stream is in flight — edit/regenerate are disabled while true. */
  busy?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const { t } = useI18n();
  const activeChatId = useChatStore((s) => s.activeChatId);
  const regenerate = useChatStore((s) => s.regenerate);
  const editMessage = useChatStore((s) => s.editMessage);

  const startEdit = () => {
    setDraft(message.content);
    setEditing(true);
  };
  const submitEdit = () => {
    if (activeChatId && draft.trim()) {
      editMessage(activeChatId, message.id, draft);
    }
    setEditing(false);
  };

  const handleCopy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isUser = message.role === "user";
  const isEmpty = !message.content && !message.reasoning && message.isStreaming;
  const hasReasoning = !isUser && !!message.reasoning;
  const isThinking = !!message.isStreaming && !message.content && !!message.reasoning;
  const reasoningExpanded = isThinking || reasoningOpen;

  return (
    <div className="group relative py-3.5">
      {isUser ? (
        <div className="flex justify-end gap-2.5">
          <div className="flex min-w-0 max-w-[85%] flex-col items-end">
            {editing ? (
              <div className="w-full rounded-[10px] rounded-tr-[4px] border border-ink/20 bg-ink/[0.05] p-2.5 shadow-[inset_0_1px_0_var(--specular)]">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitEdit();
                    }
                    if (e.key === "Escape") setEditing(false);
                  }}
                  autoFocus
                  rows={Math.min(draft.split("\n").length + 1, 8)}
                  className="w-full min-w-[240px] resize-none bg-transparent px-1 text-[15px] leading-[1.55] text-ink outline-none"
                />
                <div className="mt-2 flex justify-end gap-1.5">
                  <button onClick={() => setEditing(false)} className="t-icon-btn h-8 px-3 text-[13px]">
                    {t.chat.cancelEdit}
                  </button>
                  <button onClick={submitEdit} disabled={!draft.trim()} className="t-btn-primary h-8 px-3.5 text-[13px]">
                    {t.chat.saveEdit}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] rounded-tr-[4px] border border-ink/[0.08] bg-ink/[0.09] px-3.5 py-2.5 text-[15px] leading-[1.55] tracking-[-0.006em] text-ink shadow-[inset_0_1px_0_var(--specular)]">
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            )}
            {!editing && !message.isStreaming && message.content && (
              <div className="mt-1 flex items-center gap-0.5 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100">
                <button onClick={startEdit} disabled={busy} className="t-icon-btn h-8 w-8" title={t.chat.editMessage} aria-label={t.chat.editMessage}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          <span className="t-avatar t-avatar-you">{userInitial}</span>
        </div>
      ) : (
        <div className="flex gap-3">
          <span className="t-avatar -mt-[3px]">
            <TomarisMark size={13} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex h-[22px] items-center">
              <span className="t-label">Tomaris</span>
            </div>
            {hasReasoning && (
              <div className="mb-3">
                <button
                  onClick={() => setReasoningOpen((o) => !o)}
                  aria-expanded={reasoningExpanded}
                  className="inline-flex items-center gap-1.5 text-mute transition-colors duration-150 hover:text-ink"
                >
                  <Brain className="h-3.5 w-3.5" />
                  <span className="t-label text-inherit">{isThinking ? t.chat.thinking : t.chat.reasoning}</span>
                  {isThinking && <StreamingDots />}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", reasoningExpanded && "rotate-180")} />
                </button>
                {reasoningExpanded && (
                  <div className="mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap rounded-[10px] border border-hairline bg-ink/[0.03] px-3.5 py-2.5 text-[13px] leading-relaxed text-mute shadow-[inset_0_1px_0_var(--specular)]">
                    {message.reasoning}
                  </div>
                )}
              </div>
            )}
            {isEmpty ? (
              <div className="flex h-7 items-center">
                <StreamingDots />
              </div>
            ) : (
              <MarkdownContent content={message.content} />
            )}
            {message.isStreaming && !!message.content && <span className="streaming-cursor" />}
            {!message.isStreaming && message.ragBackendMissing && (
              <div className="mt-3 rounded-[10px] border border-warning/30 bg-warning/10 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-warning">
                {t.chat.ragBackendMissing}
              </div>
            )}
            {!message.isStreaming && !!message.citations?.length && (
              <div className="mt-4">
                <div className="t-label mb-2">{t.chat.sources}</div>
                <div className="flex flex-wrap gap-2">
                  {message.citations.map((c, i) => {
                    const label = `${shortCodeName(c.code_title, c.code)} ${c.article}`;
                    const chip = (
                      <span className="inline-flex items-center gap-2.5 rounded-lg border border-hairline bg-surface-3 bg-linear-to-b from-ink/[0.03] to-transparent px-3 py-2 text-[12.5px] text-body shadow-[inset_0_1px_0_var(--specular)] transition-colors duration-150 group-hover/cite:border-hairline-soft group-hover/cite:text-ink">
                        {label}
                        <span className="t-dot" aria-hidden="true" />
                      </span>
                    );
                    return c.lex_uz ? (
                      <a
                        key={`${c.code}-${c.article}-${i}`}
                        href={`https://lex.uz/docs/${encodeURIComponent(c.lex_uz)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/cite"
                        title={c.code_title || c.code}
                      >
                        {chip}
                      </a>
                    ) : (
                      <span key={`${c.code}-${c.article}-${i}`} title={c.code_title || c.code}>
                        {chip}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {!message.isStreaming && message.content && (
              <div className="-ml-2 mt-2 flex items-center gap-0.5 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100">
                <button onClick={handleCopy} className="t-icon-btn h-8 w-8" title={t.chat.copy} aria-label={t.chat.copy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                {isLast && activeChatId && (
                  <button onClick={() => regenerate(activeChatId, message.id)} disabled={busy} className="t-icon-btn h-8 w-8" title={t.chat.regenerate} aria-label={t.chat.regenerate}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
