"use client";

import { fadeUp } from "@/lib/motion";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";


const posts = [
  {
    title: "Introducing Tomaris: The First Uzbek-Native AI",
    excerpt:
      "Today we're announcing Tomaris, a 27B parameter language model built from the ground up for Uzbek.",
    date: "June 15, 2025",
    category: "Announcement",
    readTime: "5",
    slug: "introducing-tomaris",
  },
  {
    title: "Why Low-Resource Languages Need Dedicated AI",
    excerpt:
      "Generic AI models fail at Uzbek. Here's why dedicated models are the future of language technology.",
    date: "June 10, 2025",
    category: "Research",
    readTime: "8",
    slug: "low-resource-languages",
  },
  {
    title: "Building the Uzbek Training Corpus",
    excerpt:
      "How we curated 227 million words of high-quality Uzbek text data for training Tomaris.",
    date: "June 5, 2025",
    category: "Engineering",
    readTime: "12",
    slug: "training-corpus",
  },
  {
    title: "Tomaris vs GPT-4: Uzbek Language Benchmark",
    excerpt:
      "We benchmarked Tomaris against leading AI models on Uzbek language tasks. The results speak for themselves.",
    date: "May 28, 2025",
    category: "Research",
    readTime: "6",
    slug: "benchmark-results",
  },
  {
    title: "Agentic AI in Uzbek: A New Paradigm",
    excerpt:
      "How Tomaris enables autonomous AI agents that can plan and execute tasks in Uzbek.",
    date: "May 20, 2025",
    category: "Product",
    readTime: "7",
    slug: "agentic-ai",
  },
  {
    title: "Data Sovereignty and AI in Central Asia",
    excerpt:
      "Why data residency matters and how Tomaris ensures compliance with local regulations.",
    date: "May 15, 2025",
    category: "Policy",
    readTime: "5",
    slug: "data-sovereignty",
  },
];

export default function BlogPage() {
  const { t } = useI18n();

  return (
    <>
      <main className="pt-16">
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
                  className="group rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  {/* Image placeholder */}
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
                      <Link
                        href="#"
                        className="flex items-center gap-1 text-sm font-medium text-primary"
                      >
                        {t.blog.readMore}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
