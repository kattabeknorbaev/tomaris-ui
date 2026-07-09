import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomaris-ui.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/home",
    "/about",
    "/blog",
    "/contact",
    "/pricing",
    "/security",
    "/waitlist",
  ];

  return [
    ...routes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "/home" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "/home" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
