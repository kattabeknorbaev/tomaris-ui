import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { I18nProvider } from "@/components/shared/i18n-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Warm editorial serif for the personal greeting. Cyrillic for Russian,
// latin-ext for Uzbek diacritics.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tomaris — The Future of Uzbek AI",
    template: "%s · Tomaris",
  },
  description:
    "Tomaris is a 27B parameter LLM natively optimized for Uzbek language, culture, and context. Chat with the first world-class AI built for Uzbekistan and Central Asia — in Uzbek, Russian, or English.",
  applicationName: "Tomaris",
  authors: [{ name: "Tomaris AI" }],
  creator: "Tomaris AI",
  publisher: "Tomaris AI",
  category: "technology",
  keywords: [
    "Tomaris",
    "Tomaris AI",
    "Uzbek AI",
    "Uzbek ChatGPT",
    "O'zbek sun'iy intellekt",
    "sun'iy intellekt",
    "o'zbek tili AI",
    "Uzbek language model",
    "Uzbek LLM",
    "Central Asia AI",
    "AI Uzbekistan",
    "узбекский ИИ",
    "искусственный интеллект Узбекистан",
    "LLM",
    "chatbot",
  ],
  openGraph: {
    type: "website",
    siteName: "Tomaris",
    locale: "en_US",
    alternateLocale: ["uz_UZ", "ru_RU"],
    title: "Tomaris — The Future of Uzbek AI",
    description:
      "The first world-class AI built natively for Uzbek language, culture, and context.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tomaris — The Future of Uzbek AI",
    description:
      "The first world-class AI built natively for Uzbek language, culture, and context.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Browser-tab and Apple touch icons come from src/app/icon.png and
  // src/app/apple-icon.png (Next.js convention files, generated from the logo).
  // Add your Google Search Console token here once verified, e.g.:
  // verification: { google: "xxxxxxxx" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Organization + WebSite structured data for Google entity/knowledge
            graph and the sitelinks search box. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
