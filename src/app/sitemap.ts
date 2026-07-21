import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/api",
    "/blog",
    "/changelog",
    "/contact",
    "/enterprise",
    "/help",
    "/pricing",
    "/security",
    "/waitlist",
  ];

  return [
    ...routes.map((route) => ({
      url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
