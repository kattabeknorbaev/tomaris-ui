import type { NextConfig } from "next";

// Security headers applied to every response. We use frame-ancestors (not a
// full content CSP) so anti-clickjacking is enforced without risking breakage
// of Next.js inline scripts / OAuth redirects; a nonce-based CSP is a future
// hardening step.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      // Typing the bare domain opens the live app. The marketing landing
      // page stays reachable at /home (logo + footer links point there).
      // Temporary (307) so it isn't hard-cached by browsers and can be
      // reverted cleanly.
      {
        source: "/",
        destination: "/app",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
