import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { I18nProvider } from "@/components/shared/i18n-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
