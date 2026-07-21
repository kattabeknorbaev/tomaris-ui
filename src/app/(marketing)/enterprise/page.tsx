import type { Metadata } from "next";
import EnterpriseClient from "./page-client";

export const metadata: Metadata = {
  title: "Enterprise — Sovereign Uzbek AI",
  description:
    "Sovereign, Uzbek-native AI for banks, government, healthcare, and universities. Hosted in-country — your data never crosses a border. Flat pricing, native quality.",
  alternates: { canonical: "/enterprise" },
};

export default function EnterprisePage() {
  return <EnterpriseClient />;
}
