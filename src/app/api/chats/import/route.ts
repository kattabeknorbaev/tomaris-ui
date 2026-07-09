import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth-server";

type IncomingMessage = {
  id: string;
  role: string;
  content: string;
  reasoning?: string | null;
  timestamp?: string;
};
type IncomingChat = {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  messages: IncomingMessage[];
};

// POST /api/chats/import — one-time migration of a guest's browser (localStorage)
// chats into their account the first time they log in. Existing ids are skipped
// (onConflictDoNothing), so running it twice is harmless.
export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chats: incoming } = (await req.json()) as { chats: IncomingChat[] };
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  let imported = 0;
  for (const c of incoming) {
    if (!c?.id) continue;
    await db
      .insert(chats)
      .values({
        id: c.id,
        userId: user.id,
        title: c.title ?? "New Chat",
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      })
      .onConflictDoNothing();

    for (const m of c.messages ?? []) {
      if (!m?.id) continue;
      await db
        .insert(messages)
        .values({
          id: m.id,
          chatId: c.id,
          role: m.role,
          content: m.content ?? "",
          reasoning: m.reasoning ?? null,
          createdAt: m.timestamp ? new Date(m.timestamp) : new Date(),
        })
        .onConflictDoNothing();
    }
    imported++;
  }

  return NextResponse.json({ imported });
}
