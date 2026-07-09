import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { posts, getPost, type BlogBlock } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main id="main" className="pt-16">
      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Blog
          </Link>

          <header className="mt-8">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {post.readTime} min read
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {post.date} · Tomaris Team
            </p>
          </header>

          <div className="mt-4 border-t border-border">
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <footer className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Tomaris is live — chat with the first Uzbek-native AI model.
            </p>
            <Link
              href="/app"
              className="btn-lift mt-4 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-on-primary transition-all duration-150 hover:bg-primary-deep"
            >
              Try Tomaris
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}
