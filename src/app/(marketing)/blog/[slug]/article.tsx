"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";
import type { BlogBlock, BlogPost } from "@/lib/blog";

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-10 text-xl font-semibold tracking-tight sm:text-2xl">{block.text}</h2>;
    case "ul":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-primary pl-5 text-lg font-medium leading-relaxed text-ink">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="mt-5 leading-relaxed text-muted-foreground">{block.text}</p>;
  }
}

// The article chrome translates (back link, read time, byline, CTA). The
// article body itself is authored in English in lib/blog.ts.
export function BlogArticle({ post }: { post: BlogPost }) {
  const { t } = useI18n();

  return (
    <main id="main" className="pt-16">
      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t.nav.blog}
          </Link>

          <header className="mt-8">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {post.readTime} {t.blog.readTime}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {post.date} · {t.blog.byline}
            </p>
          </header>

          <div className="mt-4 border-t border-border">
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <footer className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{t.blog.liveCta}</p>
            <Link
              href={process.env.NODE_ENV === "development" ? "/app" : "https://chat.tomaris.ai"}
              className="btn-lift mt-4 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-on-primary transition-all duration-150 hover:bg-primary-deep"
            >
              {t.nav.tryTomaris}
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}
