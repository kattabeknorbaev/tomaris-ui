import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-server";

type IncomingMessage = {
  id: string;
  role: string;
  content: string;
  reasoning?: string | null;
  fileText?: string | null;
  timestamp?: string;
};
type IncomingChat = {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  messages: IncomingMessage[];
};

// Bounds so a crafted body can't trigger thousands of serial DB writes.
const MAX_CHATS = 200;
const MAX_MESSAGES_PER_CHAT = 500;

function safeDate(v?: string): Date {
  if (!v) return new Date();
  const d = new Date(v);
  return isNaN(d.getTime()) ? new Date() : d;
}

// POST /api/chats/import — one-time migration of a guest's browser (localStorage)
// chats into their account on first login. Idempotent (existing ids skipped).
export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chats: incoming } = (await req.json()) as { chats: IncomingChat[] };
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  let imported = 0;
  for (const c of incoming.slice(0, MAX_CHATS)) {
    if (!c?.id) continue;

    await db
      .insert(chats)
      .values({
        id: c.id,
        userId: user.id,
        title: (c.title ?? "New Chat").slice(0, 200),
        createdAt: safeDate(c.createdAt),
        updatedAt: safeDate(c.updatedAt),
      })
      .onConflictDoNothing();

    // Only import messages if THIS chat is owned by the caller. Without this,
    // a body reusing another user's chat id would inject messages into their
    // conversation (the chat insert above is a no-op on conflict).
    const [owned] = await db
      .select({ id: chats.id })
      .from(chats)
      .where(and(eq(chats.id, c.id), eq(chats.userId, user.id)));
    if (!owned) continue;

    for (const m of (c.messages ?? []).slice(0, MAX_MESSAGES_PER_CHAT)) {
      if (!m?.id) continue;
      await db
        .insert(messages)
        .values({
          id: m.id,
          chatId: c.id,
          role: m.role === "assistant" ? "assistant" : "user",
          content: typeof m.content === "string" ? m.content.slice(0, 200_000) : "",
          reasoning: typeof m.reasoning === "string" ? m.reasoning.slice(0, 200_000) : null,
          fileContext: typeof m.fileText === "string" ? m.fileText.slice(0, 200_000) : null,
          createdAt: safeDate(m.timestamp),
        })
        .onConflictDoNothing();
    }
    imported++;
  }

  return NextResponse.json({ imported });
}
