"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Link from "next/link";

/* ------------------------------ motion ------------------------------ */

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------- layout bits --------------------------- */

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 ${className}`}>{children}</div>;
}

export function Eyebrow({
  children,
  dark = false,
  index,
}: {
  children: ReactNode;
  dark?: boolean;
  index?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${dark ? "text-ink/55" : "text-gold"}`}>
      {index ? <span className="eyebrow opacity-60">{index}</span> : null}
      <span className={`h-px w-10 ${dark ? "bg-ink/25" : "bg-gold/50"}`} />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

/* ------------------------------- logo -------------------------------- */

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid size-8 place-items-center rounded-full border ${
          inverted ? "border-gold/40" : "border-brass/40"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={inverted ? "text-gold" : "text-brass"}>
          <path
            d="M12 2L22 12L12 22L2 12L12 2Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M12 5L15.5 12L12 19L8.5 12L12 5Z" fill="currentColor" />
        </svg>
      </span>
      <span className={`font-display text-[1.35rem] leading-none tracking-tight ${inverted ? "text-bone" : "text-ink"}`}>
        Pilot<span className="italic">44</span>
      </span>
    </span>
  );
}

/* ------------------------------ buttons ------------------------------ */

export function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PillButton({
  children,
  href,
  variant = "gold",
  className = "",
  onClick,
  type,
}: {
  children: ReactNode;
  href?: string;
  variant?: "gold" | "ghost" | "ink";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const base =
    "group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[0.8125rem] font-semibold tracking-wide transition-all duration-500";
  const styles = {
    gold: "bg-gold text-ink hover:bg-gold-soft",
    ghost:
      "border border-bone/25 text-bone hover:border-gold hover:text-gold bg-bone/[0.02] backdrop-blur-sm",
    ink: "bg-ink text-bone hover:bg-carbon",
  } as const;
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* ------------------------------ marquee ------------------------------ */

export function Marquee({ children, slow = false }: { children: ReactNode; slow?: boolean }) {
  return (
    <div className="marquee-paused relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={`flex w-max shrink-0 items-center ${slow ? "animate-marquee-slow" : "animate-marquee"}`}>
        {children}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ dividers ----------------------------- */

export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" className={className}>
      <rect x="1.2" y="1.2" width="5.6" height="5.6" transform="rotate(45 4 4)" fill="currentColor" />
    </svg>
  );
}

export function ScrollCue({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`eyebrow ${dark ? "text-ink/50" : "text-mist"}`}>Scroll</span>
      <span className={`relative h-10 w-px overflow-hidden ${dark ? "bg-ink/15" : "bg-bone/15"}`}>
        <motion.span
          className={`absolute left-0 top-0 h-4 w-px ${dark ? "bg-ink" : "bg-gold"}`}
          animate={{ y: [-16, 40] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </div>
  );
}
