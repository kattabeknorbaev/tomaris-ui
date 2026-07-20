"use client";

import { useState, memo, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { Copy, Check, Brain, ChevronDown, RotateCcw, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useI18n } from "@/components/shared/i18n-provider";
import { useChatStore } from "@/stores/chat-store";

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
    <div className="code-block my-3 overflow-hidden rounded-lg border border-hairline">
      <div className="flex items-center justify-between border-b border-hairline bg-surface-2/50 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-mute">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-mute transition-all duration-150 hover:bg-surface-2 hover:text-ink active:scale-90"
          aria-label={t.chat.copyCode}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-primary" /> {t.chat.copied}
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
    <span className="inline-flex gap-1">
      <span className="typing-dot h-1 w-1 rounded-full bg-primary" />
      <span className="typing-dot h-1 w-1 rounded-full bg-primary" />
      <span className="typing-dot h-1 w-1 rounded-full bg-primary" />
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
    <div className={cn("group relative px-4 py-4 sm:px-0")}>
      <div className="mx-auto max-w-2xl">
        <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
          {!isUser && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-semibold text-on-primary mt-0.5">T</div>
          )}
          <div className={cn("max-w-[85%] sm:max-w-[80%]", isUser ? "order-1" : "order-2")}>
            {hasReasoning && (
              <div className="mb-1.5">
                <button
                  onClick={() => setReasoningOpen((o) => !o)}
                  aria-expanded={reasoningExpanded}
                  className="flex items-center gap-1 text-caption text-mute hover:text-ink transition-colors duration-150"
                >
                  <Brain className="h-3 w-3" />
                  <span>{isThinking ? t.chat.thinking : t.chat.reasoning}</span>
                  {isThinking && <StreamingDots />}
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-150", reasoningExpanded && "rotate-180")} />
                </button>
                {reasoningExpanded && (
                  <div className="mt-1 max-h-60 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-surface-2/50 px-2.5 py-1.5 text-caption leading-relaxed text-mute">
                    {message.reasoning}
                  </div>
                )}
              </div>
            )}
            {isUser && editing ? (
              <div className="rounded-lg rounded-br-sm border border-primary/40 bg-primary/5 p-2">
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
                  className="w-full min-w-[220px] resize-none bg-transparent text-body-sm text-ink outline-none"
                />
                <div className="mt-1.5 flex justify-end gap-1.5">
                  <button onClick={() => setEditing(false)} className="rounded-md px-2.5 py-1 text-caption text-mute hover:text-ink hover:bg-surface-2 transition-colors duration-150">
                    {t.chat.cancelEdit}
                  </button>
                  <button onClick={submitEdit} disabled={!draft.trim()} className="rounded-md bg-primary px-2.5 py-1 text-caption font-semibold text-on-primary hover:bg-primary-deep disabled:opacity-50 transition-colors duration-150">
                    {t.chat.saveEdit}
                  </button>
                </div>
              </div>
            ) : (
              <div className={cn("rounded-lg px-3 py-2 text-body-sm leading-relaxed", isUser ? "rounded-br-sm bg-primary/10 text-ink" : "rounded-bl-sm bg-transparent p-0")}>
                {isEmpty ? <StreamingDots /> : isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <MarkdownContent content={message.content} />}
                {message.isStreaming && !!message.content && <span className="streaming-cursor" />}
              </div>
            )}
            {isUser && !editing && !message.isStreaming && message.content && (
              <div className="mt-1.5 flex items-center justify-end gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                <button onClick={startEdit} disabled={busy} className="flex h-7 w-7 items-center justify-center rounded-lg text-mute hover:text-ink hover:bg-surface-2 active:scale-90 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-150" title={t.chat.editMessage} aria-label={t.chat.editMessage}>
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {!isUser && !message.isStreaming && message.content && (
              <div className="mt-1.5 flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                <button onClick={handleCopy} className="flex h-7 w-7 items-center justify-center rounded-lg text-mute hover:text-ink hover:bg-surface-2 active:scale-90 transition-all duration-150" title={t.chat.copy} aria-label={t.chat.copy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                {isLast && activeChatId && (
                  <button onClick={() => regenerate(activeChatId, message.id)} disabled={busy} className="flex h-7 w-7 items-center justify-center rounded-lg text-mute hover:text-ink hover:bg-surface-2 active:scale-90 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-150" title={t.chat.regenerate} aria-label={t.chat.regenerate}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          {isUser && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-[10px] font-semibold uppercase text-ink order-2 mt-0.5">{userInitial}</div>
          )}
        </div>
      </div>
    </div>
  );
});
