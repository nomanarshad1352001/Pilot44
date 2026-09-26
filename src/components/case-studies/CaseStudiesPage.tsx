"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Eyebrow, Reveal } from "@/components/ui";
import { CaseStudyCard } from "@/components/site/cards";

export function CaseStudiesPage() {
  const { content } = useContent();
  const [industry, setIndustry] = useState("all");
  const [service, setService] = useState("all");

  const industries = useMemo(() => Array.from(new Set(content.caseStudies.map((c) => c.industry))).sort(), [content.caseStudies]);
  const services = useMemo(
    () => Array.from(new Set(content.caseStudies.flatMap((c) => c.services))).sort(),
    [content.caseStudies]
  );

  const filtered = content.caseStudies.filter(
    (c) =>
      (industry === "all" || c.industry === industry) &&
      (service === "all" || c.services.includes(service))
  );

  return (
    <>
      <section className="bg-paper pt-40 text-ink md:pt-48">
        <Container className="pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}>
            <Eyebrow dark>Case Studies</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.3 }}
            className="mt-8 max-w-4xl font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-light leading-[1.05] tracking-[-0.015em]"
          >
            Evidence, not <em className="italic text-brass">adjectives</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
            className="mt-7 max-w-xl text-[1rem] font-light leading-relaxed text-ink/60"
          >
            Selected engagements from the studio floor — what the client was up against, what we built
            together, and the numbers that decided what happened next.
          </motion.p>

          {/* filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            className="mt-14 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-3 !text-[0.58rem] text-mist">Industry</span>
              <FilterPill active={industry === "all"} onClick={() => setIndustry("all")}>All industries</FilterPill>
              {industries.map((i) => (
                <FilterPill key={i} active={industry === i} onClick={() => setIndustry(i)}>{i}</FilterPill>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-3 !text-[0.58rem] text-mist">Service</span>
              <FilterPill active={service === "all"} onClick={() => setService("all")}>All services</FilterPill>
              {services.map((s) => (
                <FilterPill key={s} active={service === s} onClick={() => setService(s)}>{s}</FilterPill>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-paper pb-28 text-ink">
        <Container>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div key="grid" className="grid gap-8 md:grid-cols-2">
                {filtered.map((cs) => (
                  <CaseStudyCard key={cs.slug} cs={cs} />
                ))}
              </motion.div>
            ) : (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center font-display text-2xl font-light text-ink/50">
                No case studies match those filters.
              </motion.p>
            )}
          </AnimatePresence>

          <Reveal className="mt-24">
            <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-brass/25 bg-gradient-to-br from-bone to-transparent p-10 md:flex-row md:items-center md:p-14">
              <div>
                <p className="eyebrow text-brass">Your turn</p>
                <p className="mt-4 max-w-lg font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-tight">
                  The next case study could be <em className="italic text-brass">yours.</em>
                </p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink py-4 pl-7 pr-5 text-sm font-semibold text-bone transition-all duration-500 hover:bg-brass"
              >
                Start a conversation
                <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function FilterPill({ children, active, onClick }: { children: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[0.68rem] font-semibold tracking-[0.08em] transition-all duration-300 ${
        active ? "border-ink bg-ink text-bone" : "border-ink/20 text-ink/55 hover:border-ink/60 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
