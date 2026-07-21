import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";
import { requireUser } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";

// Feedback lands in the same inbox as contact/waitlist. Override with
// CONTACT_EMAIL once a team mailbox exists.
const FEEDBACK_EMAIL = process.env.CONTACT_EMAIL ?? "norboyevkattabek@gmail.com";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Tomaris <onboarding@resend.dev>";

const MAX_MESSAGE = 4000;
const SENTIMENTS = new Set(["positive", "neutral", "negative"]);

// POST /api/feedback — in-app feedback delivered to the team via Resend.
// Public + rate-limited, mirroring /api/contact. The user's email (when signed
// in) and current page are attached as context so replies are possible.
export async function POST(req: Request) {
  try {
    // Layered limits: burst window + daily per-IP cap + a global daily
    // circuit-breaker so a distributed flood can't turn Resend into a
    // firehose at the team inbox. (In-memory: per-instance, best-effort.)
    const ip = clientIp(req);
    const limit = rateLimit(`feedback:${ip}`, 5, 600_000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter);
    const daily = rateLimit(`feedback-day:${ip}`, 20, 86_400_000);
    if (!daily.ok) return tooManyRequests(daily.retryAfter);
    const global = rateLimit("feedback-global-day", 300, 86_400_000);
    if (!global.ok) return tooManyRequests(global.retryAfter);

    const body = await req.json();
    const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE);
    if (message.length < 2) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const sentiment = SENTIMENTS.has(body.sentiment) ? (body.sentiment as string) : "";
    // Only accept an in-app relative path — anything else is dropped.
    const rawPage = typeof body.page === "string" ? body.page.trim().slice(0, 300) : "";
    const page = rawPage.startsWith("/") && !rawPage.startsWith("//") ? rawPage : "";

    // Trust the session over the client-supplied email when signed in. An
    // anonymous submitter can claim any address, so those are tagged
    // [unverified] in the email — never trust that identity when replying.
    const user = await requireUser();
    const email = (user?.email ?? (typeof body.email === "string" ? body.email : "")).slice(0, 320);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const verified = !!user?.email;

    // Persist for the admin dashboard — best effort, never blocks delivery.
    try {
      // Only session-verified emails are stored — the dashboard must never
      // present an unverified claimed address as the sender's identity.
      await db.insert(feedback).values({
        id: crypto.randomUUID(),
        userId: user?.id ?? null,
        email: verified && emailValid ? email : null,
        sentiment: sentiment || null,
        message,
        page: page || null,
      });
    } catch (e) {
      console.error("feedback persist failed:", e);
    }

    const fromLine = emailValid
      ? `From: ${email}${verified ? "" : " [unverified — claimed by an anonymous submitter]"}`
      : "From: (anonymous)";
    const header = [
      sentiment ? `Sentiment: ${sentiment}` : null,
      fromLine,
      page ? `Page: ${page}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: FEEDBACK_EMAIL,
      replyTo: emailValid ? email : undefined,
      subject: `Feedback${sentiment ? ` (${sentiment})` : ""}${emailValid ? `: ${verified ? email : `[unverified] ${email}`}` : ""}`,
      text: `${header}\n\n${message}`,
    });
    if (error) {
      console.error("feedback email failed:", error);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
