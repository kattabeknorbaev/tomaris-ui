"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Sparkles, ExternalLink, Globe } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const mockResults = [
  {
    title: "O'zbekiston Respublikasi Konstitutsiyasi",
    url: "https://gov.uz/constitution",
    source: "gov.uz",
    snippet:
      "O'zbekiston Respublikasining Konstitutsiyasi mamlakatning asosiy qonuni hisoblanadi. U 1992-yil 8-dekabrda qabul qilingan.",
  },
  {
    title: "History of Uzbekistan — Wikipedia",
    url: "https://en.wikipedia.org/wiki/History_of_Uzbekistan",
    source: "wikipedia.org",
    snippet:
      "The history of Uzbekistan encompasses the history of the area now known as Uzbekistan from prehistoric times to the present day.",
  },
  {
    title: "O'zbek tili — Til va adabiyot",
    url: "https://uz.wikipedia.org/wiki/O%27zbek_tili",
    source: "uz.wikipedia.org",
    snippet:
      "O'zbek tili — turkiy tillar oilasiga mansub. O'zbekiston Respublikasining davlat tili hisoblanadi.",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const { t } = useI18n();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {!searched ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center pt-24"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SearchIcon className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-2xl font-bold">{t.searchPage.title}</h1>
            <p className="mt-2 text-muted-foreground text-center max-w-md">
              {t.searchPage.subtitle}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) setSearched(true);
              }}
              className="mt-8 w-full max-w-lg"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 transition-all focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/5">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPage.placeholder}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  <Sparkles className="h-3 w-3" />
                  {t.searchPage.search}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mb-8"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  <Sparkles className="h-3 w-3" />
                  {t.searchPage.search}
                </button>
              </div>
            </form>

            {/* AI Answer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{t.searchPage.aiAnswer}</span>
              </div>
              <p className="text-sm leading-relaxed">
                O&apos;zbekiston Markaziy Osiyoning markazida joylashgan davlat bo&apos;lib,
                poytaxti Toshkent shahri. Mamlakat 1991-yilda mustaqillikka erishgan.
                O&apos;zbek tili davlat tili hisoblanadi. Aholisi 36 milliondan ortiq.
              </p>
            </motion.div>

            {/* Sources */}
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground">{t.searchPage.sources}</h2>
            <div className="space-y-3">
              {mockResults.map((result, i) => (
                <motion.a
                  key={i}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {result.source}
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </div>
                  <h3 className="mt-1.5 text-sm font-medium text-primary">
                    {result.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {result.snippet}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
