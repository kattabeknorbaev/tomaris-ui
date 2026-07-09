import type { Metadata } from "next";
import HomeClient from "../home-client";

export const metadata: Metadata = {
  title: "Tomaris — The Future of Uzbek AI",
  description:
    "Tomaris is a 27B parameter LLM natively optimized for Uzbek language, culture, and context. The leading AI platform for Uzbekistan and Central Asia.",
  alternates: { canonical: "/home" },
};

export default function HomePage() {
  return <HomeClient />;
}
