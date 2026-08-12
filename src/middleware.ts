import { NextRequest, NextResponse } from "next/server";

// CSRF defense-in-depth: reject state-changing API requests that carry a
// foreign Origin. Same-origin browser requests always send a matching Origin;
// cross-site attack requests carry the attacker's. Origin-less requests are
// allowed (the SameSite=Lax session cookie already blocks cross-site sends).
const ALLOWED_ORIGINS = new Set([
  "https://tomaris.ai",
  "https://www.tomaris.ai",
  "https://chat.tomaris.ai",
]);

function originAllowed(origin: string, host: string | null): boolean {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Same-host (covers Vercel preview deployments) and localhost dev.
  if (host && (origin === `https://${host}` || origin === `http://${host}`)) return true;
  if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // Subdomain routing for chat interface
  if (hostname === "chat.tomaris.ai") {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/app", req.url));
    }
  } else if (hostname === "tomaris.ai" || hostname === "www.tomaris.ai") {
    // Redirect main domain /app paths to the chat subdomain
    if (url.pathname.startsWith("/app")) {
      // Remove /app from the path when redirecting, so /app goes to root of chat.tomaris.ai
      const newPath = url.pathname.replace(/^\/app/, "");
      // newPath might be empty string which is fine, URL constructor handles it
      const newUrl = new URL(newPath || "/", "https://chat.tomaris.ai");
      return NextResponse.redirect(newUrl);
    }
  }

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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};
