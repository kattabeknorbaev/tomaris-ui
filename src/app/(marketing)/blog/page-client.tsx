"use client";

import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/components/shared/i18n-provider";
import { posts } from "@/lib/blog";

export default function BlogPage() {
  const { t } = useI18n();

  return (
    <>
      <main id="main" className="pt-16">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.h1
                variants={fadeUp}
                custom={0}
                className="text-4xl font-bold tracking-tight sm:text-5xl"
              >
                {t.blog.title}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              >
                {t.blog.subtitle}
              </motion.p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="card-lift group rounded-2xl border border-border bg-card"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="h-48 rounded-t-2xl bg-gradient-to-br from-primary/20 via-muted to-gold/20" />
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.readTime} {t.blog.readTime}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          {t.blog.readMore}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
