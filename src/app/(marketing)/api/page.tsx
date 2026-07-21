import type { Metadata } from "next";
import ApiClient from "./page-client";

export const metadata: Metadata = {
  title: "API & Pricing",
  description:
    "The Tomaris API — Uzbek-native intelligence through an OpenAI-compatible endpoint, hosted in-region. Early-access pricing for developers, businesses, and sovereign deployments.",
  alternates: { canonical: "/api" },
};

export default function ApiPage() {
  return <ApiClient />;
}
