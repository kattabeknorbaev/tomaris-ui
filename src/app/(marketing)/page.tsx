import type { Metadata } from "next";
import HomeClient from "./home-client";
import { LoggedInRedirect } from "@/components/shared/logged-in-redirect";

// The marketing landing lives at the site root so tomaris.ai itself is the
// indexable, rankable homepage (title/description inherited from the root
// layout default).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <LoggedInRedirect />
      <HomeClient />
    </>
  );
}
