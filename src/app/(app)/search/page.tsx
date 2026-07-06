"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Sparkles, ExternalLink, Globe, ArrowLeft, Loader2 } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const SEARCH_DELAY_MS = 900;

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
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "done">("idle");
  const { t } = useI18n();

  const runSearch = (q: string) => {
    if (!q.trim()) return;
    setSubmittedQuery(q.trim());
    setStatus("searching");
    // Demo: canned results after a realistic delay — no search backend yet.
    setTimeout(() => setStatus("done"), SEARCH_DELAY_MS);
  };

  const reset = () => {
    setStatus("idle");
    setQuery("");
    setSubmittedQuery("");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {status === "idle" ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center pt-24"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SearchIcon className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-bold">{t.searchPage.title}</h1>
            <p className="mt-2 text-muted-foreground text-center max-w-md">
              {t.searchPage.subtitle}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runSearch(query);
              }}
              className="mt-8 w-full max-w-lg"
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 transition-all focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/5">
                <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPage.placeholder}
                  aria-label={t.searchPage.title}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-deep active:scale-[0.98] transition-all"
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {t.searchPage.search}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={reset}
                aria-label={t.common.back}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-ink hover:bg-surface-2 transition-colors duration-150"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch(query);
                }}
                className="flex-1"
              >
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                  <SearchIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label={t.searchPage.title}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-deep active:scale-[0.98] transition-all"
                  >
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {t.searchPage.search}
                  </button>
                </div>
              </form>
            </div>

            {status === "searching" ? (
              <div className="space-y-4" role="status" aria-label={t.common.loading}>
                <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                  {t.common.loading}
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4">
                    <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
                    <div className="mt-2.5 h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-surface-2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* AI Answer */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-primary">{t.searchPage.aiAnswer}</span>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">&ldquo;{submittedQuery}&rdquo;</p>
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
                      key={result.url}
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.25 }}
                      className="block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" aria-hidden="true" />
                        {result.source}
                        <ExternalLink className="ml-auto h-3 w-3" aria-hidden="true" />
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
