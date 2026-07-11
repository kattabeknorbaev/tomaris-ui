import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, Message } from "@/types";
import { generateId } from "@/lib/utils";
import {
  apiCreateChat,
  apiRenameChat,
  apiDeleteChat,
  apiSaveMessage,
} from "@/lib/chat-api";

function now(): string {
  return new Date().toISOString();
}

const CHAT_TITLE_MAX_LENGTH = 50;
const DEFAULT_CHAT_TITLE = "New Chat";

/**
 * A reload mid-stream persists messages stuck with isStreaming: true.
 * Drop empty ones and clear the flag on the rest when rehydrating.
 */
function sanitizeChats(chats: Chat[]): Chat[] {
  return chats.map((chat) => ({
    ...chat,
    messages: chat.messages
      .filter((m) => m.content || m.reasoning || !m.isStreaming)
      .map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)),
  }));
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  sidebarOpen: boolean;
  /**
   * The account these chats belong to (null = guest). When set, every change
   * is mirrored to the server. Guards against showing/uploading one user's
   * chats under another account on a shared browser.
   */
  ownerId: string | null;

  createChat: () => string;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setActiveChat: (id: string) => void;
  /** Returns the id of the newly created message. */
  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => string;
  patchMessage: (
    chatId: string,
    messageId: string,
    patch: Partial<Omit<Message, "id">>
  ) => void;
  /** Persist a message's current content to the server (used when a stream ends). */
  saveMessage: (chatId: string, messageId: string) => void;
  /**
   * Replace the local chats with the account's server chats.
   * resetActive lands the user on the welcome screen (fresh login).
   */
  hydrate: (chats: Chat[], ownerId: string, resetActive?: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  clearAllChats: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      sidebarOpen: true,
      ownerId: null,

      createChat: () => {
        const id = generateId();
        const newChat: Chat = {
          id,
          title: DEFAULT_CHAT_TITLE,
          messages: [],
          createdAt: now(),
          updatedAt: now(),
          model: "tomaris-27b",
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: id,
        }));
        if (get().ownerId) apiCreateChat(id, DEFAULT_CHAT_TITLE);
        return id;
      },

      deleteChat: (id: string) => {
        set((state) => {
          const filtered = state.chats.filter((c) => c.id !== id);
          return {
            chats: filtered,
            activeChatId:
              state.activeChatId === id
                ? filtered[0]?.id ?? null
                : state.activeChatId,
          };
        });
        if (get().ownerId) apiDeleteChat(id);
      },

      renameChat: (id: string, title: string) => {
        set((state) => ({
          chats: state.chats.map((c) => (c.id === id ? { ...c, title } : c)),
        }));
        if (get().ownerId) apiRenameChat(id, title);
      },

      setActiveChat: (id: string) => set({ activeChatId: id }),

      addMessage: (chatId, message) => {
        const id = generateId();
        const msg: Message = { ...message, id, timestamp: now() };
        let titleChanged = false;
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            // Derive a title from the first user message, but never overwrite
            // an explicit title (rename, agent launch).
            const derivedTitle =
              chat.messages.length === 0 &&
              message.role === "user" &&
              chat.title === DEFAULT_CHAT_TITLE
                ? message.content.slice(0, CHAT_TITLE_MAX_LENGTH)
                : chat.title;
            if (derivedTitle !== chat.title) titleChanged = true;
            return {
              ...chat,
              messages: [...chat.messages, msg],
              updatedAt: now(),
              title: derivedTitle,
            };
          }),
        }));
        if (get().ownerId) {
          apiSaveMessage(chatId, msg);
          if (titleChanged) {
            const chat = get().chats.find((c) => c.id === chatId);
            if (chat) apiRenameChat(chatId, chat.title);
          }
        }
        return id;
      },

      patchMessage: (chatId, messageId, patch) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...patch } : msg
                  ),
                }
              : chat
          ),
        }));
      },

      saveMessage: (chatId, messageId) => {
        if (!get().ownerId) return;
        const chat = get().chats.find((c) => c.id === chatId);
        const msg = chat?.messages.find((m) => m.id === messageId);
        if (msg) apiSaveMessage(chatId, msg);
      },

      hydrate: (chats, ownerId, resetActive = false) =>
        set((state) => ({
          chats,
          ownerId,
          // Keep the open chat across refreshes; otherwise start fresh
          // (no auto-jumping into the newest conversation).
          activeChatId:
            !resetActive && chats.some((c) => c.id === state.activeChatId)
              ? state.activeChatId
              : null,
        })),

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      clearAllChats: () =>
        set({ chats: [], activeChatId: null, ownerId: null }),
    }),
    {
      name: "tomaris-chat-storage",
      version: 1,
      migrate: (persisted) => persisted as ChatState,
      merge: (persisted, current) => {
        // Pick known keys only — older persisted versions carry extra fields
        // (e.g. a removed `model` selection) that must not leak into state.
        const p = (persisted ?? {}) as Partial<ChatState>;
        return {
          ...current,
          chats: sanitizeChats(p.chats ?? []),
          activeChatId: p.activeChatId ?? current.activeChatId,
          sidebarOpen: p.sidebarOpen ?? current.sidebarOpen,
          ownerId: p.ownerId ?? null,
        };
      },
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        sidebarOpen: state.sidebarOpen,
        ownerId: state.ownerId,
      }),
    }
  )
);
