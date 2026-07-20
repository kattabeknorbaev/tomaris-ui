import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-server";

// DELETE /api/chats/[id]/messages  body: { ids: string[] }
// Removes the given messages from a chat — used when a message is edited or a
// response is regenerated, which truncates everything after that point. Scoped
// to the owning user's chat so ids from other chats/users can't be touched.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: chatId } = await params;

  const [chat] = await db
    .select({ id: chats.id })
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)));
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body.ids)
    ? body.ids.filter((x: unknown): x is string => typeof x === "string").slice(0, 1000)
    : [];
  if (ids.length === 0) return NextResponse.json({ ok: true });

  await db
    .delete(messages)
    .where(and(eq(messages.chatId, chatId), inArray(messages.id, ids)));

  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, chatId));

  return NextResponse.json({ ok: true });
}
