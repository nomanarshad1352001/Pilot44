"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent } from "@/lib/store";
import { Container, Logo, Reveal, Diamond } from "@/components/ui";
import { NewsletterForm } from "@/components/site/forms";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const { content } = useContent();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="hairline-t relative overflow-hidden bg-ink">
      {/* glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 opacity-25"
        style={{ background: "radial-gradient(ellipse at center, rgba(210,171,102,0.25), transparent 65%)" }}
      />
      <Container className="relative py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <Reveal>
            <Link href="/">
              <Logo inverted />
            </Link>
            <p className="mt-8 max-w-sm font-display text-[1.65rem] font-light leading-snug text-bone/90">
              {content.general.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {content.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-bone/15 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bone/60 transition-all duration-300 hover:border-gold hover:text-gold"
                >
                  {s.label}
                  <ArrowUpRight size={11} className="transition-transform duration-300 group-hover:rotate-45" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="eyebrow text-gold">Company</h3>
            <ul className="mt-7 space-y-3.5">
              {content.footerCompany.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="gold-underline text-sm text-bone/65 hover:text-bone">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <h3 className="eyebrow text-gold">Resources</h3>
            <ul className="mt-7 space-y-3.5">
              {content.footerResources.map((l) => (
                <li key={l.href + l.label} className="text-sm leading-relaxed text-bone/65">
                  <Link href={l.href} className="gold-underline hover:text-bone">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="eyebrow text-gold">The Briefing</h3>
            <p className="mt-7 text-sm leading-relaxed text-bone/55">
              One considered dispatch per month — evidence, ventures, and signals worth watching. No noise.
            </p>
            <div className="mt-6">
              <NewsletterForm compact />
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-bone/[0.08] pt-8 md:flex-row md:items-center">
          <p className="text-xs text-bone/40">
            © 2026 {content.general.brandName}, LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-bone/40 transition-colors hover:text-bone">
              Terms of Service
            </Link>
            <Diamond className="text-gold/50" />
            <Link href="/privacy" className="text-xs text-bone/40 transition-colors hover:text-bone">
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>

      {/* giant watermark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="font-display -mb-[0.23em] whitespace-nowrap text-center text-[13.5vw] font-light leading-none tracking-tight text-bone/[0.045]">
          Pilot44 Studio
        </p>
      </div>
    </footer>
  );
}
