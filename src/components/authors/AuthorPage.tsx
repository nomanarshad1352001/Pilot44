"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/store";
import { publicPosts } from "@/data/content";
import { Container, EASE, Eyebrow, Reveal } from "@/components/ui";
import { PostCard } from "@/components/site/cards";
import { NewsletterForm } from "@/components/site/forms";

export function AuthorPage({ slug }: { slug: string }) {
  const { content } = useContent();
  const author = content.authors.find((a) => a.slug === slug);

  if (!author) {
    return (
      <section className="flex min-h-[70vh] items-center bg-ink pt-32">
        <Container className="py-24 text-center">
          <p className="eyebrow text-gold">404</p>
          <h1 className="mt-6 font-display text-4xl font-light text-bone md:text-6xl">Author not found.</h1>
          <Link
            href="/insights"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink hover:bg-gold-soft"
          >
            <ArrowLeft size={14} /> Back to insights
          </Link>
        </Container>
      </section>
    );
  }

  const posts = publicPosts(content.posts).filter((p) => p.author === author.name);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-40 text-ink md:pt-48">
        <div
          className="pointer-events-none absolute -right-24 top-[5%] h-[44vh] w-[44vh] rounded-full opacity-35"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.2), transparent 62%)" }}
        />
        <Container className="relative pb-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/50 hover:text-brass"
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-1" />
              All insights
            </Link>
          </motion.div>

          <div className="mt-12 flex flex-col items-start gap-10 md:flex-row md:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            >
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="size-32 rounded-full border-2 border-brass/40 object-cover md:size-40"
                />
              ) : (
                <span className="grid size-32 place-items-center rounded-full border-2 border-brass/40 bg-ink font-display text-5xl text-gold md:size-40 md:text-6xl">
                  {author.name.charAt(0)}
                </span>
              )}
            </motion.div>
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
              >
                <Eyebrow dark>{author.role}</Eyebrow>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.35 }}
                className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1.03]"
              >
                {author.name.split(" ")[0]} <em className="italic text-brass">{author.name.split(" ").slice(1).join(" ")}</em>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                className="mt-6 text-[0.98rem] font-light leading-relaxed text-ink/60"
              >
                {author.bio}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
                className="mt-6 flex items-center gap-4 text-[0.72rem] text-mist"
              >
                <span className="rounded-full border border-ink/15 px-4 py-1.5">
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
                <span className="rounded-full border border-ink/15 px-4 py-1.5">Pilot44 Studio</span>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* posts */}
      <section className="bg-bone pb-28 pt-20 text-ink">
        <Container>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="eyebrow text-brass">By {author.name.split(" ")[0]}</span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>
          </Reveal>

          {posts.length > 0 ? (
            <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} tone="light" />
              ))}
            </div>
          ) : (
            <p className="mt-16 max-w-md font-display text-2xl font-light text-ink/55">
              No published articles yet — check back soon.
            </p>
          )}

          {/* more studio voices */}
          <div className="mt-24 border-t border-ink/10 pt-14">
            <Reveal>
              <h2 className="font-display text-[1.7rem] font-light">
                More studio <em className="italic text-brass">voices</em>
              </h2>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-3">
              {content.authors
                .filter((a) => a.slug !== author.slug)
                .map((a) => (
                  <Link
                    key={a.slug}
                    href={`/authors/${a.slug}`}
                    className="group inline-flex items-center gap-2.5 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink/70 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-bone"
                  >
                    {a.name}
                    <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:rotate-45" />
                  </Link>
                ))}
            </div>
          </div>
        </Container>
      </section>

      {/* newsletter */}
      <section className="bg-sand py-20 text-ink">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-snug">
              New perspectives, once a month. <em className="italic text-brass">Join The Briefing.</em>
            </p>
          </Reveal>
          <Reveal delay={0.1} className="w-full max-w-xl">
            <NewsletterForm dark />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
