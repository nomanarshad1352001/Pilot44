"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Clock, Calendar } from "lucide-react";
import { useContent } from "@/lib/store";
import { authorSlugByName, formatDate, publicPosts } from "@/data/content";
import { Container, EASE, Eyebrow, Reveal } from "@/components/ui";
import { PostCard, categoryColor } from "@/components/site/cards";
import { NewsletterForm } from "@/components/site/forms";

/* Body lines starting with "## "/### " render as semantic H2/H3. */
function BodyBlock({ line, index }: { line: string; index: number }) {
  if (line.startsWith("### ")) {
    return (
      <Reveal delay={0.05}>
        <h3 className="font-display text-[1.4rem] font-light leading-snug text-ink md:text-[1.55rem]">
          {line.slice(4)}
        </h3>
      </Reveal>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <Reveal delay={0.05}>
        <h2 className="border-t border-ink/10 pt-10 font-display text-[1.75rem] font-light leading-snug text-ink md:text-[2rem]">
          {line.slice(3)}
        </h2>
      </Reveal>
    );
  }
  return (
    <Reveal delay={0.05}>
      <p className="text-[1.02rem] font-light leading-[1.85] text-ink/75 first:md:text-[1.08rem]">{line}</p>
    </Reveal>
  );
}

export function ArticlePage({ slug }: { slug: string }) {
  const { content } = useContent();
  const post = content.posts.find((p) => p.slug === slug);
  const livePosts = publicPosts(content.posts);
  const author = post
    ? content.authors.find((a) => a.name === post.author) ?? null
    : null;
  const authorUrl = post ? `/authors/${authorSlugByName(content.authors, post.author)}` : "#";
  const related = post
    ? livePosts
        .filter((p) => p.slug !== slug && p.category === post.category)
        .concat(livePosts.filter((p) => p.slug !== slug && p.category !== post.category))
        .slice(0, 3)
    : [];

  if (!post) {
    return (
      <section className="flex min-h-[70vh] items-center bg-ink pt-32">
        <Container className="py-24 text-center">
          <p className="eyebrow text-gold">404</p>
          <h1 className="mt-6 font-display text-4xl font-light text-bone md:text-6xl">
            This story isn&apos;t live.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-bone/50">
            It may have been unpublished from the admin panel, or the link is out of date.
          </p>
          <Link
            href="/insights"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
          >
            <ArrowLeft size={14} /> Back to insights
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-36 md:pt-44">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-[40vh] w-[40vh] rounded-full opacity-35"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.2), transparent 62%)" }}
        />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
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

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <span
              className="rounded-full border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em]"
              style={{
                color: categoryColor(post.category),
                borderColor: `${categoryColor(post.category)}55`,
                backgroundColor: `${categoryColor(post.category)}0d`,
              }}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-2 text-[0.72rem] text-mist">
              <Calendar size={12} /> {formatDate(post.date)}
              {post.updatedDate && post.updatedDate !== post.date && (
                <span className="text-brass">· Updated {formatDate(post.updatedDate)}</span>
              )}
            </span>
            <span className="flex items-center gap-2 text-[0.72rem] text-mist">
              <Clock size={12} /> {post.readTime} read
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.22 }}
            className="mt-8 max-w-4xl font-display text-[clamp(2.1rem,4.6vw,4rem)] font-light leading-[1.08] tracking-[-0.01em] text-ink"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-10 pb-14"
          >
            <Link href={authorUrl} className="group inline-flex items-center gap-4">
              {author?.avatar ? (
                <img src={author.avatar} alt={post.author} className="size-12 rounded-full border border-brass/40 object-cover" />
              ) : (
                <span className="grid size-12 place-items-center rounded-full border border-brass/40 font-display text-lg text-brass transition-colors group-hover:bg-brass group-hover:text-white">
                  {post.author.charAt(0)}
                </span>
              )}
              <span>
                <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-brass">
                  {post.author}
                </span>
                <span className="mt-0.5 block text-xs text-ink/50">{post.authorRole}</span>
              </span>
            </Link>
          </motion.div>
        </Container>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        >
          <Container>
            <div className="img-frame aspect-[21/10] rounded-t-2xl border border-b-0 border-ink/10">
              <img src={post.image} alt={post.title} className="img-duotone size-full object-cover" />
            </div>
          </Container>
        </motion.div>
      </section>

      {/* body */}
      <section className="bg-bone text-ink">
        <Container className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="border-l-2 border-brass pl-6 font-display text-[1.35rem] font-light leading-relaxed text-ink/80 md:text-[1.5rem]">
                {post.excerpt}
              </p>
            </Reveal>
            <div className="mt-14 space-y-8">
              {post.body.map((para, i) => (
                <BodyBlock key={i} line={para} index={i} />
              ))}
            </div>

            {/* author bio card */}
            <Reveal className="mt-20">
              <Link
                href={authorUrl}
                className="group flex flex-col gap-6 rounded-2xl border border-ink/10 bg-parchment p-8 transition-all duration-500 hover:border-ink/30 sm:flex-row sm:items-center"
              >
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={post.author}
                    className="size-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-16 shrink-0 place-items-center rounded-full bg-ink font-display text-2xl text-gold transition-transform duration-500 group-hover:scale-105">
                    {post.author.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-display text-xl transition-colors group-hover:text-brass">{post.author}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    {author?.role ?? post.authorRole}, Pilot44
                  </p>
                  <p className="mt-3 text-sm font-light leading-relaxed text-ink/60">
                    {author?.bio ??
                      "Part of the studio team building new brands, ventures and capabilities for the world's leading consumer companies."}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brass">
                    All articles by {post.author.split(" ")[0]}
                    <ArrowUpRight size={12} className="transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* related */}
      <section className="border-t border-ink/10 bg-bone pb-28 text-ink">
        <Container>
          <div className="flex flex-col justify-between gap-6 pt-16 md:flex-row md:items-end">
            <Reveal>
              <Eyebrow dark>Keep Reading</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-light">
                Related <em className="italic text-brass">thinking</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/insights"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-[0.75rem] font-semibold text-ink transition-all duration-500 hover:bg-ink hover:text-bone"
              >
                All insights
                <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} tone="light" />
            ))}
          </div>
        </Container>
      </section>

      {/* newsletter */}
      <section className="bg-sand py-20 text-ink">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-snug">
              Enjoyed this? Get the next one <em className="italic text-brass">in your inbox.</em>
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
