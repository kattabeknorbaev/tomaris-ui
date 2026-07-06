import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, Message, ModelType } from "@/types";
import { generateId } from "@/lib/utils";

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
  model: ModelType;

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
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setModel: (model: ModelType) => void;
  clearAllChats: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      sidebarOpen: true,
      model: "tomaris-27b",

      createChat: () => {
        const id = generateId();
        const newChat: Chat = {
          id,
          title: DEFAULT_CHAT_TITLE,
          messages: [],
          createdAt: now(),
          updatedAt: now(),
          model: get().model,
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: id,
        }));
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
      },

      renameChat: (id: string, title: string) => {
        set((state) => ({
          chats: state.chats.map((c) => (c.id === id ? { ...c, title } : c)),
        }));
      },

      setActiveChat: (id: string) => set({ activeChatId: id }),

      addMessage: (chatId, message) => {
        const id = generateId();
        const msg: Message = { ...message, id, timestamp: now() };
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, msg],
                  updatedAt: now(),
                  // Derive a title from the first user message, but never
                  // overwrite an explicit title (rename, agent launch).
                  title:
                    chat.messages.length === 0 &&
                    message.role === "user" &&
                    chat.title === DEFAULT_CHAT_TITLE
                      ? message.content.slice(0, CHAT_TITLE_MAX_LENGTH)
                      : chat.title,
                }
              : chat
          ),
        }));
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

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setModel: (model: ModelType) => set({ model }),

      clearAllChats: () => set({ chats: [], activeChatId: null }),
    }),
    {
      name: "tomaris-chat-storage",
      version: 1,
      migrate: (persisted) => persisted as ChatState,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ChatState>;
        return { ...current, ...p, chats: sanitizeChats(p.chats ?? []) };
      },
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        model: state.model,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
