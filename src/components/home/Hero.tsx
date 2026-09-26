"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Eyebrow, Marquee, ScrollCue, Diamond } from "@/components/ui";

/* Words rendered in italic gold within the editable headline. */
const accentWords = new Set(["Innovation", "Innovation,", "Venture", "Building", "Studio"]);

const wordmarkStyles = [
  "font-display italic",
  "font-sans font-bold tracking-tight",
  "font-mono2 tracking-[0.25em] uppercase",
  "font-display font-light",
  "font-sans font-semibold tracking-[0.12em] uppercase",
];

export function Hero() {
  const { content } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroImg =
    "https://images.pexels.com/photos/7495318/pexels-photo-7495318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
  const heroImg2 =
    "https://images.pexels.com/photos/13186049/pexels-photo-13186049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

  return (
    <section ref={ref} className="relative overflow-hidden bg-paper">
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute -left-40 top-[-20%] h-[60vh] w-[60vh] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.22), transparent 62%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-[30%] h-[70vh] w-[70vh] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.16), transparent 60%)" }}
      />
      {/* vertical hairlines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1400px] justify-between px-10 lg:flex">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-full w-px bg-ink/[0.05]" />
        ))}
      </div>

      <Container className="relative">
        <div className="grid items-end gap-14 pb-14 pt-40 md:pt-48 lg:grid-cols-[1.5fr_1fr] lg:pb-20">
          <motion.div style={{ opacity: fade }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            >
              <Eyebrow>{content.home.eyebrow}</Eyebrow>
            </motion.div>

            <h1 className="mt-8 font-display text-[clamp(2.6rem,5.6vw,5.1rem)] font-light leading-[1.04] tracking-[-0.015em] text-ink">
              {content.home.headline.split(" ").map((word, wi) => (
                <motion.span
                  key={wi}
                  className="inline-block overflow-hidden pb-1 align-bottom"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0 } } }}
                >
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25 + wi * 0.045, ease: EASE }}
                    className={`inline-block ${accentWords.has(word) ? "italic text-gold" : ""}`}
                  >
                    {word}
                    {"\u00A0"}
                  </motion.span>
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              className="mt-8 max-w-xl text-[1.05rem] font-light leading-relaxed text-ink/60"
            >
              {content.home.subhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink py-4 pl-7 pr-5 text-sm font-semibold text-bone transition-all duration-500 hover:bg-brass"
              >
                Start a conversation
                <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <a
                href="#capabilities"
                className="group inline-flex items-center gap-2.5 rounded-full border border-ink/25 py-4 pl-7 pr-5 text-sm font-semibold text-ink transition-all duration-500 hover:border-brass hover:text-brass"
              >
                Explore the studio
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-16 hidden lg:block"
            >
              <ScrollCue dark />
            </motion.div>
          </motion.div>

          {/* image composition */}
          <div className="relative hidden h-[34rem] lg:block">
            <motion.div style={{ y: yImg }} className="absolute right-4 top-0 aspect-[3/4] w-[68%]">
              <motion.div
                initial={{ opacity: 0, y: 60, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                className="img-frame h-full rounded-2xl border border-bone/10"
              >
                <img src={heroImg} alt="Pilot44 studio team collaborating" className="img-duotone size-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/70 to-transparent" />
                <p className="absolute bottom-5 left-5 max-w-[15rem] text-[0.72rem] leading-relaxed text-white/85">
                  Studio session — venture sprint, week six.
                </p>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: yCard }} className="absolute bottom-10 left-0 w-[46%]">
              <motion.div
                initial={{ opacity: 0, y: 60, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -4 }}
                transition={{ duration: 1.2, delay: 0.75, ease: EASE }}
                className="img-frame aspect-square rounded-2xl border border-bone/10"
              >
                <img src={heroImg2} alt="New brand venture by Pilot44" className="img-duotone size-full object-cover" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
              className="absolute right-0 top-[54%] rounded-2xl border border-ink/10 bg-white/80 px-6 py-5 shadow-xl shadow-ink/[0.06] backdrop-blur-xl"
            >
              <p className="font-display text-3xl font-light text-brass">{content.home.stats[1]?.value ?? "40+"}</p>
              <p className="mt-1 text-[0.68rem] tracking-wide text-ink/55">
                {content.home.stats[1]?.label ?? "New brands built"}
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* client marquee */}
      <div className="relative border-t border-ink/[0.08] bg-bone/70">
        <Container className="py-9">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-4">
              <Diamond className="text-brass" />
              <p className="eyebrow text-mist">Trusted by the world&apos;s leading consumer companies</p>
            </div>
            <Marquee slow>
              <div className="flex items-center">
                {content.clients.map((c, i) => (
                  <span key={i} className="flex items-center">
                    <span
                      className={`whitespace-nowrap px-10 text-[1.4rem] text-ink/35 transition-colors duration-300 hover:text-brass md:px-14 ${
                        wordmarkStyles[i % wordmarkStyles.length]
                      }`}
                    >
                      {c}
                    </span>
                    <Diamond className="text-ink/15" />
                  </span>
                ))}
              </div>
            </Marquee>
          </div>
        </Container>
      </div>
    </section>
  );
}
