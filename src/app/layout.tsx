import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { I18nProvider } from "@/components/shared/i18n-provider";
import { Toaster } from "@/components/ui/sonner";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomaris-ui.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tomaris — The Future of Uzbek AI",
    template: "%s · Tomaris",
  },
  description:
    "Tomaris is a 27B parameter LLM natively optimized for Uzbek language, culture, and context. The leading AI platform for Uzbekistan and Central Asia.",
  keywords: [
    "Uzbek AI",
    "LLM",
    "Tomaris",
    "Uzbek language",
    "Central Asia AI",
  ],
  openGraph: {
    type: "website",
    siteName: "Tomaris",
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
  // Browser-tab and Apple touch icons come from src/app/icon.png and
  // src/app/apple-icon.png (Next.js convention files, generated from the logo).
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
