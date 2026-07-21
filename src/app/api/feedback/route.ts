import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

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
    const limit = rateLimit(`feedback:${clientIp(req)}`, 5, 600_000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const body = await req.json();
    const message = String(body.message ?? "").trim().slice(0, MAX_MESSAGE);
    if (message.length < 2) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const sentiment = SENTIMENTS.has(body.sentiment) ? (body.sentiment as string) : "";
    const email = typeof body.email === "string" ? body.email.slice(0, 320) : "";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const page = typeof body.page === "string" ? body.page.trim().slice(0, 300) : "";

    const header = [
      sentiment ? `Sentiment: ${sentiment}` : null,
      emailValid ? `From: ${email}` : "From: (anonymous)",
      page ? `Page: ${page}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: FEEDBACK_EMAIL,
      replyTo: emailValid ? email : undefined,
      subject: `Feedback${sentiment ? ` (${sentiment})` : ""}${emailValid ? `: ${email}` : ""}`,
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
