"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPin, Clock, X, Check, Compass, Handshake, FlaskConical, Gem } from "lucide-react";
import { useContent, useSubmissions } from "@/lib/store";
import { Container, EASE, Eyebrow, Reveal, Stagger, StaggerItem } from "@/components/ui";

const perks = [
  { icon: Compass, title: "Real Ownership", text: "You ship ventures, not decks. Every team member owns outcomes end-to-end — with a share in what they build." },
  { icon: FlaskConical, title: "Learning Budget", text: "An annual stipend for courses, conferences and experiments. Curiosity is a job requirement, funded accordingly." },
  { icon: Handshake, title: "Hybrid by Design", text: "Hubs in San Francisco, New York and Chicago, built for deep work and deliberate togetherness — not badge counts." },
  { icon: Gem, title: "Craft Standards", text: "Small senior teams, direct client access, and the expectation that everything you ship is something you'd sign." },
];

export function CareersPage() {
  const { content } = useContent();
  const { recordSubmission } = useSubmissions();
  const [applying, setApplying] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const openJobs = content.jobs.filter((j) => j.status === "open");

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-paper pt-40 text-ink md:pt-52">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6248963/pexels-photo-6248963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
            alt="The Pilot44 team at work"
            className="img-duotone size-full object-cover opacity-[0.16]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper/60 via-paper/40 to-paper" />
        </div>
        <Container className="relative pb-28 md:pb-36">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}>
            <Eyebrow dark>Careers</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="mt-8 max-w-4xl font-display text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.03] tracking-[-0.015em]"
          >
            Build the next generation of <em className="italic text-brass">consumer brands</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="mt-8 max-w-xl text-[1rem] font-light leading-relaxed text-ink/60"
          >
            We&apos;re a studio of researchers, strategists, designers, engineers and operators who left
            bigger stages to build real things. If you&apos;d rather ship a venture than attend a meeting
            about one, we should talk.
          </motion.p>
        </Container>
      </section>

      {/* perks */}
      <section className="bg-bone text-ink">
        <Container className="py-24 md:py-32">
          <Reveal>
            <Eyebrow dark index="01">
              Why Pilot44
            </Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.06]">
              Small studio, <em className="italic text-brass">outsized canvas</em>
            </h2>
          </Reveal>
          <Stagger className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {perks.map((p) => (
              <StaggerItem key={p.title}>
                <div className="lift h-full rounded-2xl border border-ink/10 bg-parchment p-8">
                  <span className="grid size-12 place-items-center rounded-full bg-ink text-gold">
                    <p.icon size={18} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-8 font-display text-xl">{p.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-ink/60">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* open roles */}
      <section id="openings" className="bg-parchment pb-28 text-ink">
        <Container>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="eyebrow text-brass">Current Openings</span>
              <span className="h-px flex-1 bg-ink/10" />
              <span className="text-[0.7rem] text-ink/40">{openJobs.length} open {openJobs.length === 1 ? "role" : "roles"}</span>
            </div>
          </Reveal>

          {openJobs.length === 0 ? (
            <Reveal>
              <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-bone p-14 text-center">
                <p className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light leading-snug text-ink/70">
                  Currently, we have no job openings.
                </p>
                <p className="mt-3 text-sm text-ink/50">Please check back later.</p>
              </div>
            </Reveal>
          ) : (
            <div className="mt-6">
              {openJobs.map((job, i) => (
                <Reveal key={job.id} delay={Math.min(i * 0.06, 0.3)}>
                  <div className="border-t border-ink/10">
                    <button
                      onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                      className="group grid w-full gap-3 py-8 text-left transition-colors hover:bg-ink/[0.03] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:px-4"
                    >
                      <span className="font-mono2 text-xs text-ink/30">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="font-display text-2xl font-light transition-colors duration-300 group-hover:text-brass md:text-[1.8rem]">
                          {job.title}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.75rem] text-ink/50">
                          <span className="font-semibold uppercase tracking-[0.1em] text-brass">{job.team}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={12} /> {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={12} /> {job.type}
                          </span>
                        </span>
                      </span>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300 group-hover:border-ink">
                        {expanded === job.id ? "Close" : "Details"}
                        <ArrowUpRight size={13} className={`transition-transform duration-300 ${expanded === job.id ? "rotate-90" : ""}`} />
                      </span>
                    </button>
                    <AnimatePresence>
                      {expanded === job.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-8 pb-10 md:grid-cols-[auto_1fr] md:gap-10 md:px-4">
                            <span className="hidden w-6 md:block" />
                            <div className="max-w-3xl">
                              <p className="text-[0.95rem] font-light leading-[1.85] text-ink/70">{job.description}</p>
                              <div className="mt-7 flex flex-wrap gap-4">
                                <button
                                  onClick={() => {
                                    setApplying(job.title);
                                    setDone(false);
                                  }}
                                  className="group inline-flex items-center gap-2.5 rounded-full bg-ink py-3.5 pl-6 pr-4 text-[0.78rem] font-semibold text-bone transition-all duration-400 hover:bg-brass"
                                >
                                  Apply for this role
                                  <ArrowUpRight size={14} className="transition-transform duration-400 group-hover:rotate-45" />
                                </button>
                                <a
                                  href={job.applyUrl || `mailto:${job.applyEmail}?subject=Application — ${encodeURIComponent(job.title)}`}
                                  className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3.5 text-[0.78rem] font-semibold text-ink transition-colors hover:border-ink"
                                >
                                  {job.applyEmail}
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              ))}
              <div className="border-t border-ink/10" />
            </div>
          )}

          <p className="mt-12 text-sm text-ink/50">
            Don&apos;t see your role? We hire builders year-round —{" "}
            <a href="/contact" className="font-semibold text-brass underline underline-offset-4">
              introduce yourself
            </a>
            .
          </p>
        </Container>
      </section>

      {/* apply modal */}
      <AnimatePresence>
        {applying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/70 p-4 backdrop-blur-md sm:items-center"
            onClick={() => setApplying(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-ink/10 bg-white p-8 shadow-2xl shadow-ink/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow text-brass">Application</p>
                  <h3 className="mt-3 font-display text-2xl font-light text-ink">{applying}</h3>
                </div>
                <button
                  onClick={() => setApplying(null)}
                  className="grid size-9 place-items-center rounded-full border border-ink/15 text-ink/60 hover:border-brass hover:text-brass"
                >
                  <X size={15} />
                </button>
              </div>

              {done ? (
                <div className="mt-8 rounded-xl border border-brass/30 bg-bone p-6 text-center">
                  <span className="mx-auto grid size-11 place-items-center rounded-full bg-ink text-bone">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                  <p className="mt-4 font-display text-lg text-ink">Application received.</p>
                  <p className="mt-1.5 text-sm text-ink/50">Our talent team reviews every submission personally.</p>
                </div>
              ) : (
                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    recordSubmission({
                      type: "career",
                      purpose: applying,
                      email: String(data.get("email") ?? ""),
                      summary: `${String(data.get("name") ?? "")} — applied for ${applying}`,
                      detail: { role: applying, portfolio: String(data.get("portfolio") ?? "") },
                    });
                    setDone(true);
                  }}
                >
                  {[
                    { label: "Full name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Portfolio / LinkedIn URL", name: "portfolio", type: "text" },
                  ].map((f) => (
                    <label key={f.name} className="block">
                      <span className="eyebrow !text-[0.6rem] text-mist">{f.label}</span>
                      <input
                        name={f.name}
                        type={f.type}
                        required
                        className="mt-1 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-sm text-ink outline-none transition-colors focus:border-brass"
                      />
                    </label>
                  ))}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-ink py-4 text-sm font-semibold text-bone transition-colors hover:bg-brass"
                  >
                    Submit application
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
