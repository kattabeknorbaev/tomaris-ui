"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Mic, Square, X, FileText, Image as ImageIcon, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import { useI18n } from "@/components/shared/i18n-provider";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

const MOCK_RESPONSES = [
  "Assalomu alaykum! Men Tomarisman — O'zbekiston uchun yaratilgan sun'iy intellekt yordamchisi.\n\nMen quyidagi sohalarda yordam bera olaman:\n\n- **Tarjima** — O'zbek, ingliz va rus tillari orasida\n- **Kod yozish** — Python, JavaScript va boshqa tillarda\n- **Ma'lumot** — O'zbekiston va dunyo haqida\n- **Ta'lim** — Turli fanlar bo'yicha tushuntirishlar",
  "Albatta! Keling, bu masalani birga ko'rib chiqaylik.\n\n1. **Tushunish** — avval muammoni yaxshi tushunish kerak\n2. **Rejalashtirish** — eng yaxshi yechimni tanlash\n3. **Amalga oshirish** — qadamlarni bajaratish",
  "O'zbekiston — Markaziy Osiyoning eng qiziqarli mamlakatlaridan biri. Boy tarixi, go'zal tabiati va mehmondo'st xalqi bilan ajralib turadi.\n\n```python\nmamlakat = {\n    'nomi': \"O'zbekiston\",\n    'poytaxti': 'Toshkent',\n    'aholisi': 36_000_000\n}\n```",
];

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { activeChatId, addMessage, createChat, updateMessage, updateMessageReasoning } = useChatStore();
  const { t } = useI18n();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Check API health on mount
  useEffect(() => {
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "ping" }] }),
    })
      .then((r) => setApiStatus(r.ok ? "ok" : "error"))
      .catch(() => setApiStatus("error"));
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      type: file.type,
      size: file.size,
      file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
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
        .map((m) => ({ role: m.role, content: m.content }));

      // Try real API first
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

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta || {};
              const reasoningChunk = delta.reasoning_content || delta.reasoning || "";
              const token = delta.content || "";
              if (reasoningChunk) {
                fullReasoning += reasoningChunk;
                updateMessageReasoning(chatId, assistantMsgId, fullReasoning);
              }
              if (token) {
                fullContent += token;
                updateMessage(chatId, assistantMsgId, fullContent);
              }
            } catch {}
          }
        }
      } catch (err: unknown) {
        // Fallback to mock response if API unavailable
        if (err instanceof Error && err.name === "AbortError") return;

        console.warn("API unavailable, using mock response");
        const mock =
          MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
        let charIndex = 0;
        const interval = setInterval(() => {
          charIndex += Math.floor(Math.random() * 4) + 2;
          updateMessage(chatId, assistantMsgId, mock.slice(0, charIndex));
          if (charIndex >= mock.length) clearInterval(interval);
        }, 30);
        await new Promise((resolve) => setTimeout(resolve, mock.length * 60));
      } finally {
        setIsStreaming(false);
        useChatStore.setState((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                  ),
                }
              : c
          ),
        }));
      }
    },
    [updateMessage, updateMessageReasoning]
  );

  const handleSend = useCallback(() => {
    const hasContent = input.trim() || attachments.length > 0;
    if (!hasContent || isStreaming) return;

    let chatId = activeChatId;
    if (!chatId) chatId = createChat();

    let messageContent = input.trim();
    if (attachments.length > 0) {
      const fileList = attachments.map((a) => `📎 ${a.name} (${formatSize(a.size)})`).join("\n");
      messageContent = messageContent ? `${messageContent}\n\n${fileList}` : fileList;
    }

    addMessage(chatId, { role: "user", content: messageContent });
    addMessage(chatId, { role: "assistant", content: "", isStreaming: true });
    setInput("");
    setAttachments([]);
    setIsStreaming(true);

    // Get the assistant message ID we just created
    const state = useChatStore.getState();
    const chat = state.chats.find((c) => c.id === chatId);
    const assistantMsgId = chat?.messages[chat.messages.length - 1]?.id;
    if (assistantMsgId) streamResponse(chatId, assistantMsgId);
    else setIsStreaming(false);
  }, [input, attachments, isStreaming, activeChatId, addMessage, createChat, streamResponse]);

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
    setIsStreaming(false);
  }, []);

  return (
    <div className="shrink-0 border-t border-border bg-canvas px-4 py-3 sm:px-0">
      <div className="mx-auto max-w-2xl">
        {/* API status indicator */}
        {apiStatus === "error" && (
          <div className="mb-2 rounded-md bg-warning/10 border border-warning/20 px-3 py-1.5 text-caption flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
            AI model not connected — using demo responses
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
                  className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-body-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate max-w-[160px] text-ink">{att.name}</span>
                  <span className="text-caption">{formatSize(att.size)}</span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="text-mute hover:text-error transition-colors duration-150 ml-0.5"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end gap-2 rounded-lg border border-border bg-canvas-soft px-3 py-2 transition-colors duration-150 focus-within:border-hairline-soft">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.csv,.json,.md,.png,.jpg,.jpeg,.gif,.webp,.pptx,.xlsx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-mute hover:text-ink hover:bg-surface-2 transition-colors duration-150"
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
            className="max-h-[200px] min-h-[32px] flex-1 resize-none bg-transparent py-1 text-body-sm text-ink outline-none placeholder:text-mute"
          />
          <div className="flex items-center gap-0.5">
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-mute hover:text-ink hover:bg-surface-2 transition-colors duration-150"
              title="Voice"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>
            {isStreaming ? (
              <button
                onClick={handleStop}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-error hover:bg-error/10 transition-colors duration-150"
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
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded transition-all duration-150",
                  input.trim() || attachments.length > 0
                    ? "bg-primary text-on-primary hover:bg-primary-deep"
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
          Tomaris can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}