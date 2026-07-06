import type { Metadata } from "next";
import PricingClient from "./page-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for individuals, professionals, and enterprises. Start free with Tomaris.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <PricingClient />;
}
