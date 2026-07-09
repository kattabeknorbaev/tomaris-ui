import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Server-side: who's making this request? Returns the logged-in user, or null.
 * API routes call this and reject with 401 when it's null, so nobody can read
 * or write another account's chats.
 */
export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
