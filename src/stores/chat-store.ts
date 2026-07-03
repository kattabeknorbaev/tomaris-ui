import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, Message, ModelType } from "@/types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
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
  addMessage: (chatId: string, message: Omit<Message, "id" | "timestamp">) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  updateMessageReasoning: (chatId: string, messageId: string, reasoning: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setModel: (model: ModelType) => void;
  getActiveChat: () => Chat | undefined;
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
          title: "New Chat",
          messages: [],
          createdAt: new Date().toISOString() as unknown as Date,
          updatedAt: new Date().toISOString() as unknown as Date,
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
          chats: state.chats.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }));
      },

      setActiveChat: (id: string) => set({ activeChatId: id }),

      addMessage: (chatId, message) => {
        const msg: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date().toISOString() as unknown as Date,
        };
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, msg],
                  updatedAt: new Date().toISOString() as unknown as Date,
                  title:
                    chat.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 50)
                      : chat.title,
                }
              : chat
          ),
        }));
      },

      updateMessage: (chatId, messageId, content) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content } : msg
                  ),
                }
              : chat
          ),
        }));
      },

      updateMessageReasoning: (chatId, messageId, reasoning) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, reasoning } : msg
                  ),
                }
              : chat
          ),
        }));
      },

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setModel: (model: ModelType) => set({ model }),

      getActiveChat: () => {
        const state = get();
        return state.chats.find((c) => c.id === state.activeChatId);
      },

      clearAllChats: () => set({ chats: [], activeChatId: null }),
    }),
    {
      name: "tomaris-chat-storage",
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        model: state.model,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
