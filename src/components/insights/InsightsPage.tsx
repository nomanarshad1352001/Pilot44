"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight, Plus } from "lucide-react";
import { useContent } from "@/lib/store";
import { categoriesInUse, publicPosts } from "@/data/content";
import { Container, EASE, Eyebrow, Reveal } from "@/components/ui";
import { PostCard, ArticleRow, ResourceCard } from "@/components/site/cards";
import { NewsletterForm } from "@/components/site/forms";

const PAGE_SIZE = 6;

export function InsightsPage() {
  const { content } = useContent();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const posts = useMemo(() => publicPosts(content.posts), [content.posts]);
  const categories = useMemo(() => categoriesInUse(posts), [posts]);
  const searching = query.trim().length > 0;
  const filtering = category !== "all" || searching;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const inCategory = category === "all" || p.category === category;
      const inQuery =
        !q ||
        [p.title, p.excerpt, p.category, p.author].some((f) => f.toLowerCase().includes(q));
      return inCategory && inQuery;
    });
  }, [posts, category, query]);

  const matchedResources = useMemo(() => {
    if (!searching) return [];
    const q = query.trim().toLowerCase();
    return content.resources.filter((r) =>
      [r.title, r.description, r.type].some((f) => f.toLowerCase().includes(q))
    );
  }, [content.resources, query, searching]);

  const featured = useMemo(() => posts.filter((p) => p.featured).slice(0, 3), [posts]);
  const recent = filtered;
  const shown = recent.slice(0, visible);
  const hasMore = visible < recent.length;

  return (
    <>
      {/* hero */}
      <section className="bg-bone text-ink">
        <Container className="pb-14 pt-40 md:pt-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          >
            <Eyebrow dark>Insights</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.3 }}
            className="mt-8 max-w-4xl font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-light leading-[1.05] tracking-[-0.015em]"
          >
            Bold thinking for brand innovators and <em className="italic text-brass">business builders</em>
          </motion.h1>

          {/* search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            className="mt-12 flex max-w-2xl items-center gap-4 border-b-2 border-ink/70 pb-4 transition-colors focus-within:border-brass"
          >
            <Search size={20} className="shrink-0 text-ink/50" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search articles, reports, and resources…"
              className="w-full bg-transparent text-lg font-light text-ink outline-none placeholder:text-ink/35"
            />
            {searching && (
              <button
                onClick={() => setQuery("")}
                className="text-[0.68rem] font-semibold tracking-[0.14em] text-ink/50 uppercase hover:text-ink"
              >
                Clear
              </button>
            )}
          </motion.div>
        </Container>

        {/* filter bar */}
        <div className="border-t border-ink/10">
          <Container className="flex flex-wrap items-center gap-x-2 gap-y-2 py-5">
            <FilterPill
              active={category === "all"}
              onClick={() => {
                setCategory("all");
                setVisible(PAGE_SIZE);
              }}
            >
              Show all
            </FilterPill>
            {categories.map((c) => (
              <FilterPill
                key={c}
                active={category === c}
                onClick={() => {
                  setCategory(c);
                  setVisible(PAGE_SIZE);
                }}
              >
                {c}
              </FilterPill>
            ))}
          </Container>
        </div>
      </section>

      {/* filtered/search mode */}
      {filtering ? (
        <section className="bg-bone pb-28 pt-14 text-ink">
          <Container>
            <p className="eyebrow text-ink/50">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {searching ? ` for “${query.trim()}”` : ""}
              {category !== "all" ? ` in ${category}` : ""}
            </p>
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 && matchedResources.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-14 max-w-md font-display text-2xl font-light text-ink/60"
                >
                  Nothing matched. Try another term or browse all insights.
                </motion.p>
              ) : (
                <motion.div key="grid" className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <PostCard key={p.slug} post={p} tone="light" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {searching && matchedResources.length > 0 && (
              <div className="mt-20">
                <p className="eyebrow text-ink/50">Matching resources</p>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {matchedResources.map((r) => (
                    <ResourceCard key={r.slug} resource={r} dark />
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
      ) : (
        <>
          {/* featured */}
          <section className="bg-bone pb-8 pt-16 text-ink">
            <Container>
              <Reveal>
                <div className="mb-10 flex items-center gap-4">
                  <span className="eyebrow text-brass">Featured</span>
                  <span className="h-px flex-1 bg-ink/10" />
                </div>
              </Reveal>
              <div className="grid gap-x-8 gap-y-14 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {featured[0] && <PostCard post={featured[0]} large tone="light" />}
                </div>
                <div className="grid content-start gap-14">
                  {featured.slice(1).map((p) => (
                    <PostCard key={p.slug} post={p} tone="light" />
                  ))}
                </div>
              </div>
            </Container>
          </section>

          {/* resources */}
          <section className="bg-parchment py-24 text-ink md:py-28">
            <Container>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <Reveal>
                  <Eyebrow dark>Resources</Eyebrow>
                  <h2 className="mt-5 max-w-xl font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-light leading-tight">
                    Recent resources for <em className="italic text-brass">download</em>
                  </h2>
                </Reveal>
              </div>
              <div className="mt-14 grid gap-6 md:grid-cols-3">
                {content.resources.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 0.08}>
                    <ResourceCard resource={r} dark />
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>

          {/* newsletter band */}
          <section className="border-b border-ink/10 bg-sand py-16 text-ink">
            <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <Reveal>
                <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-snug">
                  The Briefing — one considered dispatch <em className="italic text-brass">per month.</em>
                </p>
              </Reveal>
              <Reveal delay={0.1} className="w-full max-w-xl">
                <NewsletterForm dark />
              </Reveal>
            </Container>
          </section>

          {/* recent articles */}
          <section className="bg-bone pb-28 pt-16 text-ink">
            <Container>
              <Reveal>
                <div className="mb-4 flex items-center gap-4">
                  <span className="eyebrow text-brass">Recent Articles</span>
                  <span className="h-px flex-1 bg-ink/10" />
                  <span className="text-[0.7rem] text-ink/40">{recent.length} stories</span>
                </div>
              </Reveal>
              <AnimatePresence mode="popLayout">
                <div>
                  {shown.map((p, i) => (
                    <ArticleRow key={p.slug} post={p} index={i} />
                  ))}
                </div>
              </AnimatePresence>

              <div className="mt-12 flex flex-col items-center gap-6">
                {hasMore ? (
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="group inline-flex items-center gap-3 rounded-full border border-ink/25 px-8 py-4 text-[0.78rem] font-semibold text-ink transition-all duration-500 hover:bg-ink hover:text-bone"
                  >
                    <Plus size={14} className="transition-transform duration-500 group-hover:rotate-90" />
                    Load more posts
                  </button>
                ) : (
                  <p className="text-[0.72rem] tracking-[0.14em] text-ink/40 uppercase">
                    You&apos;re all caught up
                  </p>
                )}
                <a
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-[0.75rem] font-semibold text-brass"
                >
                  Looking for something specific? Ask the studio
                  <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" />
                </a>
              </div>
            </Container>
          </section>
        </>
      )}
    </>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[0.7rem] font-semibold tracking-[0.1em] transition-all duration-300 ${
        active
          ? "border-ink bg-ink text-bone"
          : "border-ink/20 text-ink/55 hover:border-ink/60 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
