import type { Metadata } from "next";
import HelpClient from "./page-client";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Guides, answers, and keyboard shortcuts to help you get the most out of Tomaris — the Uzbek-native AI assistant.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return <HelpClient />;
}
