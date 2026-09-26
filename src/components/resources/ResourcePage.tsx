"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Play, Download, BookOpen } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Reveal, Eyebrow } from "@/components/ui";
import { GatedForm } from "@/components/site/forms";
import { ResourceCard } from "@/components/site/cards";

const typeIcons = { webinar: Play, report: Download, guide: BookOpen } as const;
const typeLabels = { webinar: "On-Demand Webinar", report: "Foresight Report", guide: "Strategic Guide" } as const;

const defaultIncludes: Record<string, string[]> = {
  webinar: [
    "The operating models separating portfolios from pilot theater",
    "Tranche-based funding mechanics that actually work in enterprises",
    "Live Q&A with our studio partners on 2026 priorities",
  ],
  report: [
    "Eight consumer shifts quantified across 20 markets",
    "Category-by-category implications for CPG portfolios",
    "Signals dashboards and momentum scoring methodology",
  ],
  guide: [
    "Full venture studio operating model, end to end",
    "Governance, evidence ladders and kill criteria templates",
    "Spin-in pathways and success metrics that survive scrutiny",
  ],
};

export function ResourcePage({ slug }: { slug: string }) {
  const { content } = useContent();
  const resource = content.resources.find((r) => r.slug === slug);
  const others = content.resources.filter((r) => r.slug !== slug).slice(0, 2);

  if (!resource) {
    return (
      <section className="flex min-h-[70vh] items-center bg-ink pt-32">
        <Container className="py-24 text-center">
          <p className="eyebrow text-gold">404</p>
          <h1 className="mt-6 font-display text-4xl font-light text-bone md:text-6xl">Resource not found.</h1>
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

  const Icon = typeIcons[resource.type];

  return (
    <>
      <section className="relative overflow-hidden bg-paper pt-36 text-ink md:pt-44">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-[44vh] w-[44vh] rounded-full opacity-35"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.2), transparent 62%)" }}
        />
        <Container className="relative pb-24 md:pb-32">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
            <Link
              href="/insights"
              className="group inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/50 hover:text-brass"
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-1" />
              All resources
            </Link>
          </motion.div>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                className="flex flex-wrap items-center gap-4"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/5 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brass">
                  <Icon size={11} />
                  {typeLabels[resource.type]}
                </span>
                <span className="text-[0.72rem] text-mist">{resource.meta}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                className="mt-7 font-display text-[clamp(2rem,4.2vw,3.6rem)] font-light leading-[1.06] tracking-[-0.01em]"
              >
                {resource.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.32 }}
                className="mt-6 max-w-xl text-[0.98rem] font-light leading-relaxed text-ink/60"
              >
                {resource.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}
                className="mt-10"
              >
                <p className="eyebrow text-mist">What&apos;s inside</p>
                <ul className="mt-5 space-y-3.5">
                  {defaultIncludes[resource.type].map((item) => (
                    <li key={item} className="flex items-start gap-3.5 text-sm text-ink/75">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-brass/50 text-brass">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                className="img-frame mt-12 aspect-[16/9] rounded-2xl border border-ink/10"
              >
                <img src={resource.image} alt={resource.title} className="img-duotone size-full object-cover" />
              </motion.div>
            </div>

            {/* gate */}
            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
              className="rounded-2xl border border-ink/10 bg-white p-8 shadow-xl shadow-ink/[0.04] lg:sticky lg:top-28"
            >
              <p className="eyebrow text-brass">{resource.ctaLabel}</p>
              <h2 className="mt-4 font-display text-xl font-light leading-snug text-ink">
                Enter your details to access this {resource.type === "webinar" ? "webinar" : resource.type}.
              </h2>
              <div className="mt-8">
                <GatedForm
                  ctaLabel={resource.ctaLabel}
                  resourceType={resource.type}
                  title={resource.title}
                  assetUrl={resource.assetUrl}
                  gated={resource.gated}
                />
              </div>
            </motion.aside>
          </div>
        </Container>
      </section>

      {/* more resources */}
      <section className="border-t border-ink/10 bg-parchment pb-28 text-ink">
        <Container className="pt-16">
          <Reveal>
            <Eyebrow dark>More Resources</Eyebrow>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {others.map((r) => (
              <ResourceCard key={r.slug} resource={r} dark />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
