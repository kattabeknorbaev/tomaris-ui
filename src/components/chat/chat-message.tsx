"use client";

import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Brain, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useI18n } from "@/components/shared/i18n-provider";

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
  return <div className="prose-tomaris"><ReactMarkdown>{content}</ReactMarkdown></div>;
});

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<"up" | "down" | null>(null);
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const { t } = useI18n();

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className={cn("rounded-lg px-3 py-2 text-body-sm leading-relaxed", isUser ? "rounded-br-sm bg-primary/10 text-ink" : "rounded-bl-sm bg-transparent p-0")}>
              {isEmpty ? <StreamingDots /> : isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <MarkdownContent content={message.content} />}
              {message.isStreaming && !!message.content && <span className="streaming-cursor" />}
            </div>
            {!isUser && !message.isStreaming && message.content && (
              <div className="mt-1.5 flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
                <button onClick={handleCopy} className="flex h-6 w-6 items-center justify-center rounded text-mute hover:text-ink hover:bg-surface-2 transition-colors duration-150" title="Copy" aria-label="Copy">
                  {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                </button>
                <button onClick={() => setReaction(reaction === "up" ? null : "up")} className={cn("flex h-6 w-6 items-center justify-center rounded transition-colors duration-150 hover:bg-surface-2", reaction === "up" ? "text-primary" : "text-mute hover:text-ink")} title="Good" aria-label="Good response">
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button onClick={() => setReaction(reaction === "down" ? null : "down")} className={cn("flex h-6 w-6 items-center justify-center rounded transition-colors duration-150 hover:bg-surface-2", reaction === "down" ? "text-error" : "text-mute hover:text-ink")} title="Bad" aria-label="Bad response">
                  <ThumbsDown className="h-3 w-3" />
                </button>
                <button className="flex h-6 w-6 items-center justify-center rounded text-mute hover:text-ink hover:bg-surface-2 transition-colors duration-150" title="Regenerate" aria-label="Regenerate">
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          {isUser && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-[10px] font-semibold text-ink order-2 mt-0.5">U</div>
          )}
        </div>
      </div>
    </div>
  );
}
