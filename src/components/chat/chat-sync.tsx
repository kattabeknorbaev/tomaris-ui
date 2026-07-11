"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useChatStore } from "@/stores/chat-store";
import { apiImportChats, apiLoadChats } from "@/lib/chat-api";

/**
 * Renders nothing — it just keeps the local chat store in sync with the
 * logged-in account:
 *   1. If the store holds a different user's chats, drop them.
 *   2. Migrate any genuine guest chats into this account (once).
 *   3. Load this account's chats from the server as the source of truth.
 * Ownership is claimed immediately so edits made during the load still sync.
 */
export function ChatSync() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (isPending || !userId) return;
    let cancelled = false;

    (async () => {
      const state = useChatStore.getState();
      // A change of owner (guest -> user, or user A -> user B) is a fresh
      // login: land on the welcome screen, not in the middle of an old chat.
      const freshLogin = state.ownerId !== userId;
      if (state.ownerId && state.ownerId !== userId) {
        state.clearAllChats();
      }
      const before = useChatStore.getState();
      const guestChats = before.ownerId ? [] : before.chats;

      // Claim ownership now so any chats created mid-load are still synced.
      useChatStore.setState({ ownerId: userId });

      if (guestChats.length > 0) await apiImportChats(guestChats);

      const serverChats = await apiLoadChats();
      if (!cancelled) useChatStore.getState().hydrate(serverChats, userId, freshLogin);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, isPending]);

  return null;
}
