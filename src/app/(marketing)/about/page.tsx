import type { Metadata } from "next";
import AboutClient from "./page-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tomaris is building the foundational AI platform for Uzbekistan and Central Asia — bringing world-class language AI to 36 million Uzbek speakers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
