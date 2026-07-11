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

  const body = await req.json();
  const role = body.role === "assistant" ? "assistant" : "user";
  const content = typeof body.content === "string" ? body.content.slice(0, 200_000) : "";
  const reasoning = typeof body.reasoning === "string" ? body.reasoning.slice(0, 200_000) : null;
  const fileContext =
    typeof body.fileContext === "string" ? body.fileContext.slice(0, 200_000) : null;

  await db
    .insert(messages)
    .values({ id: messageId, chatId, role, content, reasoning, fileContext })
    .onConflictDoUpdate({
      target: messages.id,
      set: { content, reasoning, fileContext },
      // Scope the update to THIS (already-owned) chat. Prevents overwriting a
      // message that belongs to another chat/user via a colliding message id.
      setWhere: eq(messages.chatId, chatId),
    });

  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));

  return NextResponse.json({ ok: true });
}
