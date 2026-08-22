import { NextResponse } from "next/server";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-server";
import { orderTranscript } from "@/lib/message-order";

// GET /api/chats — every chat (with its messages) belonging to the logged-in
// user. This is what the app loads on startup to restore your conversations.
export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, user.id))
    .orderBy(asc(chats.createdAt));

  const ids = userChats.map((c) => c.id);
  const msgs = ids.length
    ? await db
        .select()
        .from(messages)
        .where(inArray(messages.chatId, ids))
        .orderBy(asc(messages.createdAt))
    : [];

  const byChat: Record<string, typeof msgs> = {};
  for (const m of msgs) (byChat[m.chatId] ??= []).push(m);

  const result = userChats.map((c) => ({
    ...c,
    messages: orderTranscript(byChat[c.id] ?? []),
  }));

  return NextResponse.json({ chats: result });
}

// POST /api/chats — create one chat owned by the logged-in user.
export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db
    .insert(chats)
    .values({ id, userId: user.id, title: title ?? "New Chat" })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}

// DELETE /api/chats — wipe ALL of the logged-in user's chats (messages
// cascade). Used by Settings → "Clear all chats".
export async function DELETE() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(chats).where(eq(chats.userId, user.id));
  return NextResponse.json({ ok: true });
}
