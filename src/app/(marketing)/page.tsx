import type { Metadata } from "next";
import HomeClient from "./home-client";

// The marketing landing lives at the site root so tomaris.ai itself is the
// indexable, rankable homepage (title/description inherited from the root
// layout default). Logged-in users are NOT auto-redirected to /app — they
// reach it via the navbar CTA.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeClient />;
}
