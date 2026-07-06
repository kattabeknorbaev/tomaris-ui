import type { Metadata } from "next";
import SecurityClient from "./page-client";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Tomaris protects your data — encryption, data sovereignty in Uzbekistan, and responsible AI practices.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return <SecurityClient />;
}
