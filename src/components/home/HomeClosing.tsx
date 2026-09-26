"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useContent } from "@/lib/store";
import { publicPosts } from "@/data/content";
import { Container, EASE, Eyebrow, Reveal } from "@/components/ui";
import { PostCard } from "@/components/site/cards";
import { LeadForm } from "@/components/site/forms";

/* ------------------------------ testimonial --------------------------- */

export function Testimonial() {
  const { content } = useContent();
  const [index, setIndex] = useState(0);
  const items = content.testimonials;
  if (items.length === 0) return null;
  const t = items[Math.min(index, items.length - 1)];

  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, rgba(210,171,102,0.22), transparent 60%)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 left-8 select-none font-display text-[16rem] leading-none text-bone/[0.05]"
      >
        &ldquo;
      </span>
      <Container className="relative py-28 md:py-40">
        <Reveal>
          <Eyebrow index="04">Client Voices</Eyebrow>
        </Reveal>

        <div className="mt-10 min-h-[16rem] md:min-h-[15rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <blockquote className="max-w-5xl font-display text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-[1.3] text-bone">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-5">
                <span className="grid size-12 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-bone">{t.name}</span>
                  <span className="mt-0.5 block text-xs text-bone/50">
                    {t.title} · {t.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="mt-12 flex items-center gap-3">
            <button
              aria-label="Previous testimonial"
              onClick={() => setIndex((index - 1 + items.length) % items.length)}
              className="grid size-11 place-items-center rounded-full border border-bone/20 text-bone/70 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={() => setIndex((index + 1) % items.length)}
              className="grid size-11 place-items-center rounded-full border border-bone/20 text-bone/70 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <ArrowRight size={15} />
            </button>
            <div className="ml-3 flex gap-2">
              {items.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-gold" : "w-3 bg-bone/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ---------------------------- insights teaser -------------------------- */

export function InsightsTeaser() {
  const { content } = useContent();
  const latest = publicPosts(content.posts).slice(0, 3);

  return (
    <section className="bg-bone text-ink">
      <Container className="py-24 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow dark index="05">
              Insights
            </Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-light leading-[1.06] tracking-[-0.015em]">
              The latest from the <em className="italic text-brass">studio floor</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2.5 rounded-full border border-ink/25 px-6 py-3 text-[0.78rem] font-semibold text-ink transition-all duration-500 hover:bg-ink hover:text-bone"
            >
              View all insights
              <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {latest.map((post) => (
            <Reveal key={post.slug} delay={0.08}>
              <PostCard post={post} tone="light" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* --------------------------------- CTA --------------------------------- */

export function CTASection() {
  const { content } = useContent();
  return (
    <section id="contact" className="relative overflow-hidden bg-parchment text-ink">
      <div
        className="pointer-events-none absolute -left-32 bottom-[-30%] h-[36rem] w-[36rem] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.2), transparent 62%)" }}
      />
      <Container className="relative py-28 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <Eyebrow dark index="06">Get Started</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-light leading-[1.04] tracking-[-0.015em]">
              {content.home.ctaHeading.split(" ").map((w, i) =>
                /started/i.test(w) ? (
                  <em key={i} className="italic text-brass">
                    {w}{" "}
                  </em>
                ) : (
                  <span key={i}>{w} </span>
                )
              )}
            </h2>
            <p className="mt-7 max-w-md text-[0.95rem] font-light leading-relaxed text-ink/60">
              {content.home.ctaSub}
            </p>
            <div className="mt-12 hidden gap-10 lg:flex">
              <div>
                <p className="eyebrow text-ink/50">Response</p>
                <p className="mt-2 font-display text-xl">Within 24 hours</p>
              </div>
              <div>
                <p className="eyebrow text-ink/50">First step</p>
                <p className="mt-2 font-display text-xl">Discovery call</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <LeadForm dark />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
