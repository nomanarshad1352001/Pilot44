"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, EASE, Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/site/forms";

export function ContactPage() {
  const { content } = useContent();

  return (
    <>
      <section className="relative overflow-hidden bg-paper pt-40 text-ink md:pt-52">
        <div
          className="pointer-events-none absolute -left-32 top-[10%] h-[46vh] w-[46vh] rounded-full opacity-35"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.2), transparent 62%)" }}
        />
        <Container className="relative pb-24 md:pb-32">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}>
                <Eyebrow dark>Contact</Eyebrow>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.3 }}
              className="mt-8 font-display text-[clamp(2.5rem,5.4vw,4.8rem)] font-light leading-[1.03] tracking-[-0.015em]"
            >
              Get in <em className="italic text-brass">touch</em>
            </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
                className="mt-7 max-w-md text-[0.98rem] font-light leading-relaxed text-ink/60"
              >
                Tell us where you want to grow. Whether it&apos;s a research question, a venture to build,
                or a capability to install — the first conversation is on us.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
                className="mt-12 space-y-6"
              >
                <a href={`mailto:${content.general.contactEmail}`} className="group flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full border border-ink/15 text-brass transition-all duration-300 group-hover:border-brass">
                    <Mail size={15} />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-mist">Email</span>
                    <span className="mt-0.5 block text-sm transition-colors group-hover:text-brass">
                      {content.general.contactEmail}
                    </span>
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full border border-ink/15 text-brass">
                    <Phone size={15} />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-mist">Phone</span>
                    <span className="mt-0.5 block text-sm">{content.general.phone}</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-full border border-ink/15 text-brass">
                    <MapPin size={15} />
                  </span>
                  <span>
                    <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-mist">Headquarters</span>
                    <span className="mt-0.5 block text-sm">{content.general.address}</span>
                  </span>
                </div>
                <p className="inline-flex items-center gap-1.5 pt-2 text-xs text-ink/40">
                  San Francisco · New York · Chicago
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.45 }}
              className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl shadow-ink/[0.04] md:p-12"
            >
              <p className="eyebrow text-brass">Start the conversation</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
