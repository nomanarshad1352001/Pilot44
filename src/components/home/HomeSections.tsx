"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Eyebrow, Reveal, Stagger, StaggerItem } from "@/components/ui";

/* ------------------------------ mission ------------------------------ */

export function Mission() {
  const { content } = useContent();
  return (
    <section className="bg-bone text-ink">
      <Container className="py-24 md:py-36">
        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-24">
          <Reveal>
            <Eyebrow dark index="01">
              {content.home.missionLabel}
            </Eyebrow>
          </Reveal>
          <div className="max-w-4xl">
            {content.home.mission.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <p
                  className={`font-display font-light leading-[1.35] tracking-[-0.01em] ${
                    i === 0 ? "text-[clamp(1.7rem,3vw,2.6rem)]" : "mt-10 text-[clamp(1.25rem,2.1vw,1.75rem)] text-ink/65"
                  }`}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Stagger className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 lg:grid-cols-4">
          {content.home.stats.map((s) => (
            <StaggerItem key={s.label} className="bg-bone px-8 py-10 transition-colors duration-500 hover:bg-sand">
              <p className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-light text-ink">{s.value}</p>
              <p className="mt-3 text-[0.72rem] font-medium uppercase leading-snug tracking-[0.14em] text-ink/50">
                {s.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

/* ---------------------------- capabilities tabs ----------------------- */

export function CapabilityTabs() {
  const { content } = useContent();
  const [active, setActive] = useState(content.home.tabs[0]?.id ?? "");
  const tab = content.home.tabs.find((t) => t.id === active) ?? content.home.tabs[0];

  if (!tab) return null;

  return (
    <section id="capabilities" className="relative overflow-hidden bg-paper">
      <div
        className="pointer-events-none absolute right-[-15%] top-[-10%] h-[55vh] w-[55vh] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(176,138,62,0.18), transparent 62%)" }}
      />
      <Container className="relative py-24 md:py-36">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow dark index="02">Capabilities</Eyebrow>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,4.4vw,3.9rem)] font-light leading-[1.06] tracking-[-0.015em] text-ink">
              An integrated studio, <em className="italic text-brass">end to end</em>
            </h2>
          </Reveal>
        </div>

        {/* tab bar */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap gap-2 border-b border-ink/10 pb-px">
            {content.home.tabs.map((t) => {
              const isActive = t.id === tab.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`relative px-5 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ${
                    isActive ? "text-brass" : "text-ink/45 hover:text-ink"
                  }`}
                >
                  {t.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-3 -bottom-px h-[2px] bg-brass"
                      transition={{ duration: 0.55, ease: EASE }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20"
          >
            <div>
              <p className="eyebrow text-brass">{tab.kicker}</p>
              <h3 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,3rem)] font-light leading-tight text-ink">
                {tab.title}
              </h3>
              <p className="mt-6 max-w-xl text-[0.95rem] font-light leading-relaxed text-ink/60">
                {tab.description}
              </p>
              <ul className="mt-9 space-y-4">
                {tab.bullets.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                    className="flex items-start gap-3.5 text-sm text-ink/75"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-brass/50 text-brass">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {b}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="img-frame aspect-[4/3] rounded-2xl border border-ink/10">
                <img src={tab.image} alt={tab.label} className="img-duotone size-full object-cover" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/85 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-7">
                  <div>
                    <p className="font-display text-4xl font-light text-gold-soft">{tab.stat.value}</p>
                    <p className="mt-1.5 max-w-[16rem] text-[0.72rem] leading-relaxed text-white/80">{tab.stat.label}</p>
                  </div>
                  <span className="eyebrow !text-[0.58rem] text-white/60">{tab.label}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

/* ------------------------------- services ----------------------------- */

export function Services() {
  const { content } = useContent();
  return (
    <section className="bg-parchment text-ink">
      <Container className="py-24 md:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow dark index="03">
              What We Do
            </Eyebrow>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,4.4vw,3.9rem)] font-light leading-[1.06] tracking-[-0.015em]">
              Three practices. One outcome: <em className="italic text-brass">growth you can measure.</em>
            </h2>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-6 lg:grid-cols-3">
          {content.home.services.map((block) => (
            <StaggerItem key={block.index}>
              <div className="lift group flex h-full flex-col rounded-2xl border border-ink/10 bg-bone p-9">
                <div className="flex items-start justify-between">
                  <span className="font-mono2 text-sm text-brass">{block.index}</span>
                  <span className="grid size-10 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-bone">
                    <Plus size={16} />
                  </span>
                </div>
                <h3 className="mt-10 font-display text-[1.75rem] font-light leading-tight">{block.title}</h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-ink/60">{block.intro}</p>
                <ul className="mt-8 space-y-3.5 border-t border-ink/10 pt-7">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-center justify-between text-[0.83rem] text-ink/75">
                      {item}
                      <span className="size-1 rounded-full bg-brass/60 transition-all duration-300 group-hover:bg-brass" />
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
