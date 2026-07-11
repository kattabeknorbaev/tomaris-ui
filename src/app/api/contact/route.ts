import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

// Where contact/waitlist submissions land. Defaults to the founder inbox;
// override with CONTACT_EMAIL once a team mailbox exists.
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "norboyevkattabek@gmail.com";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Tomaris <onboarding@resend.dev>";

const MAX_FIELD = 2000;

// POST /api/contact — real delivery for the contact and waitlist forms:
// the submission is emailed to the team via Resend.
export async function POST(req: Request) {
  try {
    // Public endpoint that sends real email — cap to 5 per IP per 10 minutes.
    const limit = rateLimit(`contact:${clientIp(req)}`, 5, 600_000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const body = await req.json();
    const kind = body.kind === "waitlist" ? "waitlist" : "contact";
    const email = String(body.email ?? "").slice(0, 320);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const fields: Record<string, string> = {};
    for (const key of ["name", "organization", "useCase", "message"]) {
      const v = body[key];
      if (typeof v === "string" && v.trim()) fields[key] = v.trim().slice(0, MAX_FIELD);
    }

    const lines = [
      `Type: ${kind}`,
      `Email: ${email}`,
      ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`),
    ].join("\n");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: kind === "waitlist" ? `Waitlist signup: ${email}` : `Contact form: ${email}`,
      text: lines,
    });
    if (error) {
      console.error("contact email failed:", error);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
