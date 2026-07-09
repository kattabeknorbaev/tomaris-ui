import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-server";

// PUT /api/chats/[id]/messages/[messageId] — save a message (insert if new,
// update if it already exists). We "upsert" because a streaming assistant
// reply is saved once when it starts and again with its final text when it
// finishes — same id both times.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: chatId, messageId } = await params;

  // Confirm the chat belongs to this user before touching its messages.
  const [chat] = await db
    .select({ id: chats.id })
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)));
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { role, content, reasoning } = await req.json();

  await db
    .insert(messages)
    .values({
      id: messageId,
      chatId,
      role,
      content: content ?? "",
      reasoning: reasoning ?? null,
    })
    .onConflictDoUpdate({
      target: messages.id,
      set: { content: content ?? "", reasoning: reasoning ?? null },
    });

  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));

  return NextResponse.json({ ok: true });
}
