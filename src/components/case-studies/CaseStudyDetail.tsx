"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Eyebrow, Reveal } from "@/components/ui";
import { LeadForm } from "@/components/site/forms";

const sections = [
  { key: "challenge", label: "The Challenge", index: "01" },
  { key: "approach", label: "The Approach", index: "02" },
  { key: "outcome", label: "The Outcome", index: "03" },
] as const;

/* Count-up for metric values like "12 wks", "+24%", "-39%", "1,200" */
function CountUpValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^([^\d~-]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match || !inView) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const hasComma = numStr.includes(",");
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const current = target * eased;
      const formatted = hasComma
        ? Math.round(current).toLocaleString("en-US")
        : Number.isInteger(target)
          ? String(Math.round(current))
          : current.toFixed(1);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export function CaseStudyDetail({ slug }: { slug: string }) {
  const { content } = useContent();
  const cs = content.caseStudies.find((c) => c.slug === slug);
  const others = content.caseStudies.filter((c) => c.slug !== slug).slice(0, 2);

  if (!cs) {
    return (
      <section className="flex min-h-[70vh] items-center bg-ink pt-32">
        <Container className="py-24 text-center">
          <p className="eyebrow text-gold">404</p>
          <h1 className="mt-6 font-display text-4xl font-light text-bone md:text-6xl">Case study not found.</h1>
          <Link
            href="/case-studies"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink hover:bg-gold-soft"
          >
            <ArrowLeft size={14} /> All case studies
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-36 text-ink md:pt-44">
        <Container className="relative">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <Link
              href="/case-studies"
              className="group inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/50 hover:text-brass"
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-1" />
              All case studies
            </Link>
          </motion.div>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
                className="flex flex-wrap items-center gap-3"
              >
                <span className="rounded-full border border-brass/40 bg-brass/5 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brass">
                  {cs.industry}
                </span>
                {cs.services.map((s) => (
                  <span key={s} className="rounded-full border border-ink/20 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/60">
                    {s}
                  </span>
                ))}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.22 }}
                className="mt-7 max-w-3xl font-display text-[clamp(2.1rem,4.4vw,3.8rem)] font-light leading-[1.06] tracking-[-0.01em]"
              >
                {cs.headline}
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
              className="rounded-2xl border border-ink/10 bg-white p-7"
            >
              <p className="eyebrow text-mist">Client</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="grid size-13 h-13 w-13 place-items-center rounded-full border border-brass/40 font-display text-lg text-brass">
                  {cs.clientLogo}
                </span>
                <p className="font-display text-xl">{cs.client}</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.4 }}
            className="img-frame mt-14 aspect-[21/9] rounded-t-2xl border border-b-0 border-ink/10"
          >
            <img src={cs.heroImage} alt={cs.headline} className="img-duotone size-full object-cover" />
          </motion.div>
        </Container>
      </section>

      {/* metrics */}
      <section className="border-b border-ink/10 bg-bone text-ink">
        <Container className="border-x border-ink/10 bg-parchment">
          <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
            {cs.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08} className="bg-parchment px-10 py-12 text-center">
                <p className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-light text-brass">
                  <CountUpValue value={m.value} />
                </p>
                <p className="mx-auto mt-3 max-w-[13rem] text-[0.72rem] font-medium uppercase leading-snug tracking-[0.12em] text-ink/55">
                  {m.label}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* narrative */}
      <section className="bg-bone text-ink">
        <Container className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl space-y-20">
            {sections.map((s) => (
              <Reveal key={s.key}>
                <div className="flex items-baseline gap-5">
                  <span className="font-mono2 text-sm text-brass">{s.index}</span>
                  <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-light">{s.label}</h2>
                </div>
                <p className="mt-6 text-[1.03rem] font-light leading-[1.9] text-ink/75">{cs[s.key]}</p>
              </Reveal>
            ))}

            {cs.testimonial && (
              <Reveal>
                <figure className="rounded-2xl border border-ink/10 bg-parchment p-10">
                  <span aria-hidden className="block font-display text-6xl leading-none text-brass/40">&ldquo;</span>
                  <blockquote className="mt-2 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-light leading-[1.4]">
                    {cs.testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-8 text-sm">
                    <span className="font-semibold">{cs.testimonial.name}</span>
                    <span className="mt-0.5 block text-ink/55">{cs.testimonial.title}</span>
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* more + cta */}
      <section className="border-t border-ink/10 bg-paper py-24 text-ink">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <Eyebrow dark>More Evidence</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-light">
                Other <em className="italic text-brass">engagements</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/case-studies"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-[0.75rem] font-semibold transition-all duration-500 hover:border-brass hover:text-brass"
              >
                All case studies
                <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/case-studies/${o.slug}`}
                className="group flex items-center justify-between gap-6 rounded-2xl border border-ink/10 bg-white p-7 transition-all duration-500 hover:border-brass/40"
              >
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brass">{o.industry}</p>
                  <p className="mt-2.5 font-display text-[1.25rem] font-light leading-snug transition-colors group-hover:text-brass">
                    {o.headline}
                  </p>
                </div>
                <ArrowUpRight size={18} className="shrink-0 text-ink/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-brass" />
              </Link>
            ))}
          </div>

          <Reveal className="mt-24">
            <div className="rounded-3xl border border-brass/25 bg-gradient-to-br from-bone to-transparent p-10 md:p-14">
              <p className="eyebrow text-brass">Get Started</p>
              <p className="mt-4 max-w-xl font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-tight">
                Want results like these? <em className="italic text-brass">Let&apos;s talk.</em>
              </p>
              <div className="mt-10 max-w-3xl">
                <LeadForm dark />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
