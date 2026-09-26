"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Layers, Cpu, Sparkles, ArrowUpRight, Plus } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Eyebrow, Reveal, Stagger, StaggerItem } from "@/components/ui";

export const valueIcons: Record<string, typeof Rocket> = {
  rocket: Rocket,
  layers: Layers,
  cpu: Cpu,
  sparkles: Sparkles,
};

const aboutImages = [
  "https://images.pexels.com/photos/9852966/pexels-photo-9852966.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/8546590/pexels-photo-8546590.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "https://images.pexels.com/photos/7674643/pexels-photo-7674643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
];

export function AboutPage() {
  const { content } = useContent();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-ink pt-40 md:pt-52">
        <div
          className="pointer-events-none absolute -right-32 top-[-10%] h-[50vh] w-[50vh] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(210,171,102,0.3), transparent 62%)" }}
        />
        <Container className="relative pb-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          >
            <Eyebrow>{content.about.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="mt-8 max-w-5xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-light leading-[1.03] tracking-[-0.015em] text-bone"
          >
            {content.about.headline.split(" ").map((w, i) =>
              /studio|enterprise/i.test(w) ? (
                <em key={i} className="italic text-gold">
                  {w}{" "}
                </em>
              ) : (
                <span key={i}>{w} </span>
              )
            )}
          </motion.h1>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {aboutImages.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.45 + i * 0.12 }}
                className={`img-frame rounded-2xl border border-bone/10 ${i === 1 ? "aspect-[4/3] md:mt-12" : "aspect-[4/3]"}`}
              >
                <img src={src} alt="Inside the Pilot44 studio" className="img-duotone size-full object-cover" />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* body */}
      <section className="bg-bone text-ink">
        <Container className="py-24 md:py-36">
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-24">
            <Reveal>
              <Eyebrow dark index="01">
                Who We Are
              </Eyebrow>
            </Reveal>
            <div className="max-w-3xl space-y-9">
              {content.about.body.map((p, i) => (
                <Reveal key={i} delay={0.08 + i * 0.08}>
                  <p
                    className={
                      i === 0
                        ? "font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-[1.35]"
                        : "text-[1.05rem] font-light leading-relaxed text-ink/65"
                    }
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* values */}
      <section className="bg-parchment text-ink">
        <Container className="py-24 md:py-32">
          <Reveal>
            <Eyebrow dark index="02">
              How We Work
            </Eyebrow>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.06]">
              Built different, <em className="italic text-brass">on purpose</em>
            </h2>
          </Reveal>

          <Stagger className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-2 xl:grid-cols-4">
            {content.about.values.map((v, i) => {
              const Icon = valueIcons[v.icon] ?? Sparkles;
              return (
                <StaggerItem key={v.title} className="group bg-parchment p-9 transition-colors duration-500 hover:bg-bone">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-gold">
                      <Icon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="font-mono2 text-xs text-ink/30">0{i + 1}</span>
                  </div>
                  <h3 className="mt-16 font-display text-[1.4rem] font-light leading-tight">{v.title}</h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-ink/60">{v.description}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* faq */}
      <section className="bg-bone text-ink">
        <Container className="py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
            <Reveal>
              <Eyebrow dark index="03">
                Questions
              </Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.06]">
                Straight <em className="italic text-brass">answers</em>
              </h2>
            </Reveal>
            <div>
              {content.about.faq.map((f, i) => {
                const open = openFaq === i;
                return (
                  <Reveal key={i} delay={Math.min(i * 0.06, 0.24)}>
                    <div className="border-t border-ink/10 last:border-b">
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                      >
                        <span className="font-display text-[1.2rem] font-light leading-snug transition-colors group-hover:text-brass md:text-[1.4rem]">
                          {f.q}
                        </span>
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                            open ? "rotate-45 border-ink bg-ink text-bone" : "border-ink/20 group-hover:border-ink"
                          }`}
                        >
                          <Plus size={14} />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-2xl pb-7 text-[0.95rem] font-light leading-[1.85] text-ink/65">
                              {f.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* cta band */}
      <section className="bg-ink">
        <Container className="py-24 md:py-32">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <Reveal>
              <p className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-light leading-tight text-bone">
                Let&apos;s build what&apos;s next, <em className="italic text-gold">together.</em>
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gold py-4 pl-7 pr-5 text-sm font-semibold text-ink transition-all duration-500 hover:bg-gold-soft"
              >
                Contact the studio
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
