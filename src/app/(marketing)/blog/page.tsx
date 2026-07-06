import type { Metadata } from "next";
import BlogClient from "./page-client";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, research, and engineering updates from the team building Uzbekistan's first native AI platform.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogClient />;
}
