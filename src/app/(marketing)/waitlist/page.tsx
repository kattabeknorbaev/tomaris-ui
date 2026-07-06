import type { Metadata } from "next";
import WaitlistClient from "./page-client";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description:
    "Get early access to Tomaris — the first world-class AI built natively for the Uzbek language.",
  alternates: { canonical: "/waitlist" },
};

export default function WaitlistPage() {
  return <WaitlistClient />;
}
