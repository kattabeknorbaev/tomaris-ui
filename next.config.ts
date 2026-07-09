import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
