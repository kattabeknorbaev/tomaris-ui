"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Square, X, FileText, Loader2, File, Image as ImageIcon } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { orderTranscript } from "@/lib/message-order";
import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { extractFileText, fileKind, MAX_CHARS_TOTAL } from "@/lib/file-extract";
import { toast } from "sonner";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  /** How the text is pulled out — drives the chip's icon and status copy. */
  kind: "text" | "pdf" | "image";
  /** Extracted text — null while reading. */
  text: string | null;
}


const TEXTAREA_MAX_HEIGHT = 200;

function getFileIcon(type: string) {
  if (type.includes("pdf") || type.includes("doc") || type.includes("text")) return FileText;
  return File;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "error" | "ok">("idle");
  // Ref mirror so streamResponse (a stable callback) sees the current status.
  const apiStatusRef = useRef<typeof apiStatus>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stoppedRef = useRef(false);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const addMessage = useChatStore((s) => s.addMessage);
  const createChat = useChatStore((s) => s.createChat);
  const patchMessage = useChatStore((s) => s.patchMessage);
  const { t } = useI18n();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT) + "px";
    }
  }, [input]);

  // Check API health on mount (GET hits /v1/models upstream — no generation cost)
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => {
        apiStatusRef.current = r.ok ? "ok" : "error";
        setApiStatus(apiStatusRef.current);
      })
      .catch(() => {
        apiStatusRef.current = "error";
        setApiStatus("error");
      });
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const kind = fileKind(file);
      if (kind === "unsupported") {
        toast.info(t.chat.fileUnsupported);
        continue;
      }
      const id = generateId();
      // Show the chip immediately; fill in the text when extraction finishes.
      // Images run through OCR, which is slower — the chip's spinner covers it.
      setAttachments((prev) => [
        ...prev,
        { id, name: file.name, type: file.type, size: file.size, kind, text: null },
      ]);
      extractFileText(file)
        .then((text) => {
          if (!text) throw new Error("empty");
          setAttachments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, text } : a))
          );
        })
        .catch((err: unknown) => {
          const noText = err instanceof Error && err.message === "no-text";
          toast.error(kind === "image" && noText ? t.chat.imageNoText : t.chat.fileReadError);
          setAttachments((prev) => prev.filter((a) => a.id !== id));
        });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [t]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const streamResponse = useCallback(
    async (chatId: string, assistantMsgId: string) => {
      const state = useChatStore.getState();
      const chat = state.chats.find((c) => c.id === chatId);
      const apiMessages = orderTranscript(chat?.messages || [])
        .filter((m) => m.id !== assistantMsgId && !m.isStreaming)
        .map((m) => ({
          role: m.role,
          // Attached-file text rides along invisibly so the model can read it.
          content: m.fileText
            ? `${m.content}\n\n[Attached file content]\n${m.fileText}`
            : m.content,
        }));

      // "real" (incl. user-stopped partials) gets persisted to the account;
      // error placeholders never do.
      let outcome: "real" | "error" = "real";
      stoppedRef.current = false;
      try {
        abortRef.current = new AbortController();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";
        let fullReasoning = "";
        let sseDone = false;

        while (!sseDone) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              sseDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta || {};
              // Different vLLM builds emit `reasoning` or `reasoning_content` — keep both.
              const reasoningChunk = delta.reasoning_content || delta.reasoning || "";
              const token = delta.content || "";
              if (reasoningChunk) {
                fullReasoning += reasoningChunk;
                patchMessage(chatId, assistantMsgId, { reasoning: fullReasoning });
              }
              if (token) {
                fullContent += token;
                patchMessage(chatId, assistantMsgId, { content: fullContent });
              }
              // The final frame carries the audited statute list and which
              // path produced the answer. Both were parsed and dropped before,
              // so the one thing that makes this a legal tool rather than a
              // chatbot never reached the screen.
              if (Array.isArray(parsed.citations) && parsed.citations.length) {
                patchMessage(chatId, assistantMsgId, { citations: parsed.citations });
              }
              if (typeof parsed.retrieval_mode === "string") {
                patchMessage(chatId, assistantMsgId, {
                  retrievalMode: parsed.retrieval_mode,
                });
              }
            } catch {}
          }
        }

        // Hobby kills the function at 60s. That often closes the pipe
        // without [DONE] and without throwing — an empty bubble, not an error.
        if (!sseDone && !fullContent && !fullReasoning) {
          throw new Error("upstream stream closed before first token");
        }
      } catch (err: unknown) {
        // User pressed Stop — keep whatever streamed as a real partial reply.
        if (err instanceof Error && err.name === "AbortError") {
          // outcome stays "real"
        } else {
          // Always a real error. There used to be a branch here that played a
          // canned MOCK_RESPONSES reply whenever the health check had failed at
          // mount -- and that check ran once, in a `[]` effect, so a tab opened
          // while the backend was down stayed latched for its whole life and
          // faked every later answer, typed out char-by-char so it looked real.
          // The canned text also advertised "Kod yozish - Python, JavaScript",
          // which this product does not do. Never fake an answer.
          console.error("chat request failed:", err);
          outcome = "error";
          patchMessage(chatId, assistantMsgId, { content: t.chat.sendError });
        }
      } finally {
        setIsStreaming(false);
        patchMessage(chatId, assistantMsgId, { isStreaming: false });
        // Persist only genuine model output to the account.
        if (outcome === "real") {
          useChatStore.getState().saveMessage(chatId, assistantMsgId);
        }
      }
    },
    [patchMessage, t]
  );

  // The one true send path — used by the composer, and by welcome-screen
  // prompt cards via the store's pendingPrompt.
  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      const hasContent = trimmed || attachments.length > 0;
      if (!hasContent || isStreaming) return;
      if (attachments.some((a) => a.text === null)) {
        toast.info(t.chat.fileReading);
        return;
      }

      let chatId = activeChatId;
      if (!chatId) chatId = createChat();

      let messageContent = trimmed;
      let fileText: string | undefined;
      if (attachments.length > 0) {
        const fileList = attachments.map((a) => `📎 ${a.name} (${formatSize(a.size)})`).join("\n");
        messageContent = messageContent ? `${messageContent}\n\n${fileList}` : fileList;
        fileText = attachments
          .map((a) => `--- ${a.name} ---\n${a.text}`)
          .join("\n\n")
          .slice(0, MAX_CHARS_TOTAL);
      }

      addMessage(chatId, { role: "user", content: messageContent, fileText });
      const assistantMsgId = addMessage(chatId, {
        role: "assistant",
        content: "",
        isStreaming: true,
      });
      setInput("");
      setAttachments([]);
      setIsStreaming(true);
      streamResponse(chatId, assistantMsgId);
    },
    [attachments, isStreaming, activeChatId, addMessage, createChat, streamResponse, t]
  );

  const handleSend = useCallback(() => sendText(input), [sendText, input]);

  // A prompt card was clicked on the welcome screen — send it for real,
  // through the same pipeline as a typed message.
  const pendingPrompt = useChatStore((s) => s.pendingPrompt);
  useEffect(() => {
    if (!pendingPrompt || isStreaming) return;
    useChatStore.getState().setPendingPrompt(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a cross-component send request is exactly this effect's job
    sendText(pendingPrompt);
  }, [pendingPrompt, isStreaming, sendText]);

  // A regenerate/edit was triggered from a message — stream into the assistant
  // message the store already prepared, through the same pipeline as a send.
  const pendingStream = useChatStore((s) => s.pendingStream);
  useEffect(() => {
    if (!pendingStream || isStreaming) return;
    const { chatId, assistantMsgId } = pendingStream;
    useChatStore.getState().setPendingStream(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a cross-component regenerate/edit request is exactly this effect's job
    setIsStreaming(true);
    streamResponse(chatId, assistantMsgId);
  }, [pendingStream, isStreaming, streamResponse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    stoppedRef.current = true;
    setIsStreaming(false);
  }, []);

  return (
    <div className="shrink-0 bg-transparent px-4 py-3 pb-6 sm:px-0">
      <div className="mx-auto max-w-2xl">
        {/* API status indicator */}
        {apiStatus === "error" && (
          <div className="mb-2 rounded-md bg-warning/10 border border-warning/20 px-3 py-1.5 text-caption flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
            {t.chat.demoBanner}
          </div>
        )}

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((att) => {
              const Icon = att.kind === "image" ? ImageIcon : getFileIcon(att.type);
              const reading = att.text === null;
              return (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-xl border border-border/40 bg-surface-2/40 backdrop-blur-md px-2.5 py-1.5 text-body-sm transition-colors duration-150 hover:border-border/60 shadow-[var(--shadow-sm)]"
                >
                  {reading ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-mute" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  <span className="truncate max-w-[160px] text-ink">{att.name}</span>
                  <span className="text-caption">
                    {reading && att.kind === "image" ? t.chat.imageReading : formatSize(att.size)}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-mute hover:text-error hover:bg-error/10 active:scale-90 transition-all duration-150 ml-0.5"
                    aria-label={t.chat.remove}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end gap-2 rounded-2xl border border-border/40 bg-canvas-soft/70 backdrop-blur-xl shadow-[var(--shadow-lg)] px-3 py-2 transition-all duration-200 focus-within:border-primary/50 focus-within:bg-canvas-soft/90">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.txt,.md,.csv,.tsv,.json,.jsonl,.xml,.yaml,.yml,.html,.css,.js,.jsx,.ts,.tsx,.py,.java,.c,.h,.cpp,.cs,.go,.rs,.rb,.php,.sql,.sh,.log,.png,.jpg,.jpeg,.webp,.bmp,text/*,application/pdf,image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-mute hover:text-ink hover:bg-surface-2 active:scale-90 transition-all duration-150"
            title={t.chat.attachFile}
            aria-label={t.chat.attachFile}
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chat.placeholder}
            rows={1}
            style={{ maxHeight: TEXTAREA_MAX_HEIGHT }}
            className="min-h-[32px] flex-1 resize-none bg-transparent py-1 text-body-sm text-ink outline-none placeholder:text-mute"
          />
          <div className="flex items-center gap-0.5">
            {isStreaming ? (
              <button
                onClick={handleStop}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-error hover:bg-error/10 active:scale-90 transition-all duration-150"
                title={t.chat.stop}
                aria-label={t.chat.stop}
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() && attachments.length === 0}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  input.trim() || attachments.length > 0
                    ? "btn-lift bg-primary text-on-primary shadow-[0_4px_14px_-4px_rgba(15,143,111,0.6)] hover:bg-primary-deep"
                    : "text-hairline-soft transition-colors duration-200"
                )}
                title={t.chat.send}
                aria-label={t.chat.send}
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-mute">
          {t.chat.disclaimer}
        </p>
      </div>
    </div>
  );
}