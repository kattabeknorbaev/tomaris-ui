import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/auth-server";

const VAST_API_URL = process.env.VAST_API_URL || "http://localhost:8000";

// GET /api/admin/stats — real platform numbers for the admin dashboard.
// Everything here comes from the database or a live model-server ping;
// nothing is mocked.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sql = neon(process.env.DATABASE_URL!);

  const [totals] = await sql`
    SELECT
      (SELECT count(*)::int FROM "user")   AS users,
      (SELECT count(*)::int FROM chats)    AS chats,
      (SELECT count(*)::int FROM messages) AS messages,
      (SELECT count(*)::int FROM feedback) AS feedback,
      (SELECT count(*)::int FROM session WHERE expires_at > now()) AS active_sessions
  `;

  // Last 7 days, day by day (includes empty days so the chart has 7 bars).
  const daily = await sql`
    SELECT
      d.day::date AS day,
      (SELECT count(*)::int FROM "user" u WHERE u.created_at::date = d.day::date)   AS new_users,
      (SELECT count(*)::int FROM messages m WHERE m.created_at::date = d.day::date) AS messages
    FROM generate_series(now()::date - interval '6 days', now()::date, interval '1 day') AS d(day)
    ORDER BY d.day
  `;

  const recentUsers = await sql`
    SELECT
      u.email,
      u.created_at,
      (SELECT count(*)::int FROM chats c WHERE c.user_id = u.id)   AS chats,
      (SELECT count(*)::int FROM messages m JOIN chats c ON m.chat_id = c.id WHERE c.user_id = u.id) AS messages
    FROM "user" u
    ORDER BY u.created_at DESC
    LIMIT 8
  `;

  const recentFeedback = await sql`
    SELECT email, sentiment, message, page, created_at
    FROM feedback
    ORDER BY created_at DESC
    LIMIT 8
  `;

  // Live model-server ping with real measured latency.
  let model: { ok: boolean; latencyMs: number | null } = { ok: false, latencyMs: null };
  try {
    const started = Date.now();
    const res = await fetch(`${VAST_API_URL}/v1/models`, {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    model = { ok: res.ok, latencyMs: Date.now() - started };
  } catch {
    model = { ok: false, latencyMs: null };
  }

  return NextResponse.json({ totals, daily, recentUsers, recentFeedback, model });
}
