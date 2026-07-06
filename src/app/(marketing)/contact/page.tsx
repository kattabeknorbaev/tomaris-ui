import type { Metadata } from "next";
import ContactClient from "./page-client";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Tomaris team — support, enterprise inquiries, and partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
