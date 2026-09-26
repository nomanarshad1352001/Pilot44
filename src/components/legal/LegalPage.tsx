"use client";

import { Container, Eyebrow, Reveal } from "@/components/ui";

interface Section {
  heading: string;
  body: string;
}

export function LegalPage({ eyebrow, title, updated, sections }: { eyebrow: string; title: string; updated: string; sections: Section[] }) {
  return (
    <section className="bg-bone text-ink">
      <Container className="pb-28 pt-40 md:pt-48">
        <Reveal>
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="mt-8 max-w-3xl font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.05]">
            {title}
          </h1>
          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.16em] text-ink/40">{updated}</p>
        </Reveal>

        <div className="mx-auto mt-16 max-w-3xl space-y-12 border-t border-ink/10 pt-12">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={0.03 * i}>
              <h2 className="font-display text-2xl font-light">
                <span className="mr-3 font-mono2 text-sm text-brass">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <p className="mt-4 text-[0.95rem] font-light leading-[1.85] text-ink/65">{s.body}</p>
            </Reveal>
          ))}
          <Reveal>
            <p className="border-t border-ink/10 pt-10 text-sm text-ink/50">
              Questions about this document? Contact{" "}
              <a href="mailto:hello@pilot44.com" className="font-semibold text-brass underline underline-offset-4">
                hello@pilot44.com
              </a>
              .
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
