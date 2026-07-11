import { NextRequest, NextResponse } from "next/server";

// CSRF defense-in-depth: reject state-changing API requests that carry a
// foreign Origin. Same-origin browser requests always send a matching Origin;
// cross-site attack requests carry the attacker's. Origin-less requests are
// allowed (the SameSite=Lax session cookie already blocks cross-site sends).
const ALLOWED_ORIGINS = new Set([
  "https://tomaris.ai",
  "https://www.tomaris.ai",
]);

function originAllowed(origin: string, host: string | null): boolean {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Same-host (covers Vercel preview deployments) and localhost dev.
  if (host && (origin === `https://${host}` || origin === `http://${host}`)) return true;
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const method = req.method;
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return NextResponse.next();
  }

  const origin = req.headers.get("origin");
  if (origin && !originAllowed(origin, req.headers.get("host"))) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
