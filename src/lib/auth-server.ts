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

/**
 * Server-side: is the request from an admin? Admins are the emails listed in
 * the ADMIN_EMAILS env var (comma-separated). Returns the user or null.
 */
export async function requireAdmin() {
  const user = await requireUser();
  if (!user?.email) return null;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(user.email.toLowerCase()) ? user : null;
}
