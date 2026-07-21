import type { Metadata } from "next";
import ChangelogClient from "./page-client";

export const metadata: Metadata = {
  title: "Release Notes",
  description:
    "What's new in Tomaris — the latest features and improvements to the Uzbek-native AI assistant. We ship often, and in the open.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
