// Canonical production origin. www is canonical (apex 308-redirects to www at
// the Cloudflare edge), so every canonical tag, sitemap entry, robots ref, and
// OpenGraph URL must resolve here — NOT the tomaris-ui.vercel.app deploy domain,
// which would split ranking signal across two hosts.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.tomaris.ai";

export const SITE_NAME = "Tomaris";

// Founder Telegram profiles double as authoritative sameAs links for the
// Organization knowledge graph.
const SAME_AS = [
  "https://t.me/NorbayevKattabek",
  "https://t.me/javohir_matniyazov",
];

// Organization + WebSite structured data, injected once in the root layout.
// Drives Google's entity understanding (knowledge panel eligibility) and the
// sitelinks search box.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: "Tomaris AI",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description:
          "Tomaris builds the first world-class AI model native to the Uzbek language, culture, and context.",
        foundingDate: "2025",
        founders: [
          { "@type": "Person", name: "Kattabek Norbayev" },
          { "@type": "Person", name: "Javohir Matniyazov" },
        ],
        areaServed: ["Uzbekistan", "Central Asia"],
        sameAs: SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["uz", "ru", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

// Per-article structured data for blog posts (rich-result eligibility).
export function articleJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    inLanguage: "en",
    image: `${SITE_URL}/opengraph-image`,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };
}
