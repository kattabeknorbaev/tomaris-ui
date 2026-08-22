import type { Chat, Message } from "@/types";
import { orderTranscript } from "@/lib/message-order";

// Fire-and-forget helpers that mirror local chat changes to the server. They
// swallow errors (log only) so a network hiccup never breaks the UI — the local
// store stays the instant source of truth and the server catches up.

async function send(url: string, method: string, body?: unknown) {
  try {
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    console.warn("chat sync failed:", method, url, e);
  }
}

export const apiCreateChat = (id: string, title: string) =>
  send("/api/chats", "POST", { id, title });

export const apiRenameChat = (id: string, title: string) =>
  send(`/api/chats/${id}`, "PATCH", { title });

export const apiDeleteChat = (id: string) =>
  send(`/api/chats/${id}`, "DELETE");

export const apiSaveMessage = (chatId: string, m: Message) =>
  send(`/api/chats/${chatId}/messages/${m.id}`, "PUT", {
    role: m.role,
    content: m.content,
    reasoning: m.reasoning ?? null,
    fileContext: m.fileText ?? null,
    // Client clock, not server defaultNow — otherwise the empty assistant
    // insert can race ahead of the user prompt and invert the turn on reload.
    createdAt: m.timestamp,
  });

export const apiImportChats = (chats: Chat[]) =>
  send("/api/chats/import", "POST", { chats });

// Remove messages server-side after an edit/regenerate truncates the tail.
export const apiDeleteMessages = (chatId: string, ids: string[]) =>
  send(`/api/chats/${chatId}/messages`, "DELETE", { ids });

type ServerMsg = {
  id: string;
  role: string;
  content: string;
  reasoning: string | null;
  fileContext: string | null;
  createdAt: string;
};
type ServerChat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ServerMsg[];
};

// Load the user's chats and map the DB rows into the store's shape
// (DB `createdAt` on a message becomes the store's `timestamp`, etc.).
export async function apiLoadChats(): Promise<Chat[]> {
  try {
    const res = await fetch("/api/chats", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { chats: ServerChat[] };
    return data.chats
      .map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        model: "tomaris-27b" as const,
        messages: orderTranscript(
          c.messages.map((m) => ({
            id: m.id,
            role: m.role as Message["role"],
            content: m.content,
            reasoning: m.reasoning ?? undefined,
            fileText: m.fileContext ?? undefined,
            timestamp: m.createdAt,
            isStreaming: false,
          }))
        ),
      }))
      // Newest chat first, matching how the sidebar shows them.
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  } catch (e) {
    console.warn("failed to load chats:", e);
    return [];
  }
}
