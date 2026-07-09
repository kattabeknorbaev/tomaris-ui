import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-server";

// PATCH /api/chats/[id] — rename a chat (only if you own it).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title } = await req.json();

  await db
    .update(chats)
    .set({ title, updatedAt: new Date() })
    // The userId check is the security boundary: you can only touch your rows.
    .where(and(eq(chats.id, id), eq(chats.userId, user.id)));

  return NextResponse.json({ ok: true });
}

// DELETE /api/chats/[id] — delete a chat (cascades to its messages).
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(chats).where(and(eq(chats.id, id), eq(chats.userId, user.id)));

  return NextResponse.json({ ok: true });
}
