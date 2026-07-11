"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Square, X, FileText, Loader2, File } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";
import { extractFileText, fileKind, MAX_CHARS_TOTAL } from "@/lib/file-extract";
import { toast } from "sonner";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  /** Extracted text — null while reading. */
  text: string | null;
}

const MOCK_RESPONSES = [
  "Assalomu alaykum! Men Tomarisman — O'zbekiston uchun yaratilgan sun'iy intellekt yordamchisi.\n\nMen quyidagi sohalarda yordam bera olaman:\n\n- **Tarjima** — O'zbek, ingliz va rus tillari orasida\n- **Kod yozish** — Python, JavaScript va boshqa tillarda\n- **Ma'lumot** — O'zbekiston va dunyo haqida\n- **Ta'lim** — Turli fanlar bo'yicha tushuntirishlar",
  "Albatta! Keling, bu masalani birga ko'rib chiqaylik.\n\n1. **Tushunish** — avval muammoni yaxshi tushunish kerak\n2. **Rejalashtirish** — eng yaxshi yechimni tanlash\n3. **Amalga oshirish** — qadamlarni bajaratish",
  "O'zbekiston — Markaziy Osiyoning eng qiziqarli mamlakatlaridan biri. Boy tarixi, go'zal tabiati va mehmondo'st xalqi bilan ajralib turadi.\n\n```python\nmamlakat = {\n    'nomi': \"O'zbekiston\",\n    'poytaxti': 'Toshkent',\n    'aholisi': 36_000_000\n}\n```",
];

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
  const mockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      if (kind === "image") {
        // Honest: the current model is text-only and cannot see images.
        toast.info("Image understanding isn't available yet — Tomaris currently reads text and documents.");
        continue;
      }
      if (kind === "unsupported") {
        toast.info(`Can't read ${file.name} yet — try text, code, CSV, JSON, or PDF files.`);
        continue;
      }
      const id = generateId();
      // Show the chip immediately; fill in the text when extraction finishes.
      setAttachments((prev) => [
        ...prev,
        { id, name: file.name, type: file.type, size: file.size, text: null },
      ]);
      extractFileText(file)
        .then((text) => {
          if (!text) throw new Error("empty");
          setAttachments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, text } : a))
          );
        })
        .catch(() => {
          toast.error(`Couldn't read ${file.name} — it may be scanned or corrupted.`);
          setAttachments((prev) => prev.filter((a) => a.id !== id));
        });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const streamResponse = useCallback(
    async (chatId: string, assistantMsgId: string) => {
      const state = useChatStore.getState();
      const chat = state.chats.find((c) => c.id === chatId);
      const apiMessages = (chat?.messages || [])
        .filter((m) => m.id !== assistantMsgId && !m.isStreaming)
        .map((m) => ({
          role: m.role,
          // Attached-file text rides along invisibly so the model can read it.
          content: m.fileText
            ? `${m.content}\n\n[Attached file content]\n${m.fileText}`
            : m.content,
        }));

      // "real" (incl. user-stopped partials) gets persisted to the account;
      // demo mocks and error placeholders never do.
      let outcome: "real" | "mock" | "error" = "real";
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
            } catch {}
          }
        }
      } catch (err: unknown) {
        // User pressed Stop — keep whatever streamed as a real partial reply.
        if (err instanceof Error && err.name === "AbortError") {
          // outcome stays "real"
        } else if (apiStatusRef.current === "error") {
          // Known demo mode (model server not configured/reachable at load):
          // play a canned demo reply. The demo banner is already visible.
          outcome = "mock";
          const mock =
            MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
          await new Promise<void>((resolve) => {
            let charIndex = 0;
            mockTimerRef.current = setInterval(() => {
              if (stoppedRef.current) {
                if (mockTimerRef.current) clearInterval(mockTimerRef.current);
                mockTimerRef.current = null;
                resolve();
                return;
              }
              charIndex += Math.floor(Math.random() * 4) + 2;
              patchMessage(chatId, assistantMsgId, { content: mock.slice(0, charIndex) });
              if (charIndex >= mock.length) {
                if (mockTimerRef.current) clearInterval(mockTimerRef.current);
                mockTimerRef.current = null;
                resolve();
              }
            }, 30);
          });
        } else {
          // The server was healthy at load but this request failed — show a
          // real error instead of silently faking an answer.
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
        toast.info("Still reading your file — one moment…");
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
    [attachments, isStreaming, activeChatId, addMessage, createChat, streamResponse]
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
    if (mockTimerRef.current) {
      clearInterval(mockTimerRef.current);
      mockTimerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      if (mockTimerRef.current) clearInterval(mockTimerRef.current);
    };
  }, []);

  return (
    <div className="shrink-0 border-t border-border bg-canvas px-4 py-3 sm:px-0">
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
              const Icon = getFileIcon(att.type);
              return (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-2.5 py-1.5 text-body-sm transition-colors duration-150 hover:border-hairline-soft"
                >
                  {att.text === null ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-mute" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                  <span className="truncate max-w-[160px] text-ink">{att.name}</span>
                  <span className="text-caption">{formatSize(att.size)}</span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-mute hover:text-error hover:bg-error/10 active:scale-90 transition-all duration-150 ml-0.5"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end gap-2 rounded-2xl border border-border bg-canvas-soft px-3 py-2 transition-all duration-200 focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_rgba(15,143,111,0.08)]">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.txt,.md,.csv,.tsv,.json,.jsonl,.xml,.yaml,.yml,.html,.css,.js,.jsx,.ts,.tsx,.py,.java,.c,.h,.cpp,.cs,.go,.rs,.rb,.php,.sql,.sh,.log,text/*,application/pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-mute hover:text-ink hover:bg-surface-2 active:scale-90 transition-all duration-150"
            title="Attach file"
            aria-label="Attach file"
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
                title="Stop"
                aria-label="Stop"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() && attachments.length === 0}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  input.trim() || attachments.length > 0
                    ? "bg-primary text-on-primary hover:bg-primary-deep hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-[0_4px_14px_-4px_rgba(15,143,111,0.6)]"
                    : "text-hairline-soft"
                )}
                title="Send"
                aria-label="Send"
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