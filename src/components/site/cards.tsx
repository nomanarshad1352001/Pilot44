"use client";

import Link from "next/link";
import { ArrowUpRight, Download, Play, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate, type CaseStudy, type Post, type Resource } from "@/data/content";
import { EASE } from "@/components/ui";

/* color-coded category accents (inline styles keep every hue bundle-safe) */
export const categoryColors: Record<string, string> = {
  "Venture Building": "#b08a3e",
  AI: "#7c3aed",
  Retail: "#0f766e",
  Advertising: "#c2410c",
  Sustainability: "#4d7c0f",
  Trends: "#0369a1",
  CPG: "#b45309",
  DTC: "#be185d",
  Ecommerce: "#4338ca",
  "Consumer Behavior": "#0d9488",
  Branding: "#a21caf",
  "Consumer Engagement": "#db2777",
  "Customer Experience": "#ca8a04",
  "Supply Chain": "#57534e",
  "Disruptive Technology": "#dc2626",
  "Digital Technology": "#2563eb",
  "Digital Marketing": "#0891b2",
  "Incubation & Growth": "#65a30d",
  "Best Practices": "#6d28d9",
};

export function categoryColor(category: string): string {
  return categoryColors[category] ?? "#b08a3e";
}

/* ------------------------------ post card ---------------------------- */

export function PostCard({
  post,
  large = false,
  tone = "dark",
}: {
  post: Post;
  large?: boolean;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="group"
    >
      <Link href={`/insights/${post.slug}`} className="block">
        <div className={`img-frame rounded-xl ${light ? "bg-sand" : "bg-carbon"} ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1.1s]"
          />
          <span
            className="absolute left-4 top-4 rounded-full border bg-ink/60 px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] backdrop-blur-md"
            style={{
              color: categoryColor(post.category),
              borderColor: `${categoryColor(post.category)}55`,
            }}
          >
            {post.category}
          </span>
        </div>
        <div className={`mt-5 flex items-center gap-3 text-[0.7rem] tracking-wide ${light ? "text-ink/45" : "text-mist"}`}>
          <span>{post.author}</span>
          <span className={`size-0.5 rounded-full ${light ? "bg-ink/35" : "bg-mist"}`} />
          <span>{post.readTime} read</span>
          <span className={`size-0.5 rounded-full ${light ? "bg-ink/35" : "bg-mist"}`} />
          <span>{formatDate(post.date)}</span>
        </div>
        <h3
          className={`mt-3 font-display font-light leading-tight transition-colors duration-300 ${
            light ? "text-ink group-hover:text-brass" : "text-bone group-hover:text-gold"
          } ${large ? "text-2xl md:text-[2rem]" : "text-xl md:text-[1.4rem]"}`}
        >
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-2 text-sm leading-relaxed ${light ? "text-ink/50" : "text-bone/50"}`}>
          {post.excerpt}
        </p>
        <span
          className={`mt-4 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase ${
            light ? "text-brass" : "text-gold"
          }`}
        >
          Start Reading
          <ArrowUpRight size={13} className="transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </Link>
    </motion.article>
  );
}

/* ----------------------------- article row --------------------------- */

export function ArticleRow({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/insights/${post.slug}`}
        className="group grid gap-4 border-t border-ink/10 py-7 transition-colors hover:bg-ink/[0.03] md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-8 md:px-4"
      >
        <span className="font-mono2 text-xs text-ink/35">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
            <span style={{ color: categoryColor(post.category) }}>{post.category}</span>
            <span className="font-normal normal-case tracking-normal text-ink/40">
              {post.author} · {post.readTime} read
            </span>
          </div>
          <h3 className="mt-2.5 max-w-3xl font-display text-xl font-light leading-snug text-ink transition-colors duration-300 group-hover:text-brass md:text-[1.55rem]">
            {post.title}
          </h3>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.14em] text-ink uppercase transition-all duration-400 group-hover:border-ink group-hover:bg-ink group-hover:text-bone">
          Start Reading <ArrowUpRight size={12} />
        </span>
      </Link>
    </motion.div>
  );
}

/* ---------------------------- resource card -------------------------- */

const typeIcons = { webinar: Play, report: Download, guide: BookOpen } as const;
const typeLabels = { webinar: "On-Demand Webinar", report: "Foresight Report", guide: "Strategic Guide" } as const;

/* --------------------------- case study card -------------------------- */

export function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="group"
    >
      <Link href={`/case-studies/${cs.slug}`} className="block h-full">
        <div className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-500 hover:border-brass/40">
          <div className="img-frame relative aspect-[16/10]">
            <img src={cs.heroImage} alt={cs.headline} loading="lazy" className="img-duotone size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute left-5 top-5 grid size-11 place-items-center rounded-full border border-white/30 bg-ink/60 font-display text-sm text-gold-soft backdrop-blur-md">
              {cs.clientLogo}
            </span>
            <div className="absolute bottom-4 left-5 right-5 flex flex-wrap gap-2">
              {cs.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/25 bg-ink/55 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-7">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brass">{cs.industry}</p>
            <h3 className="mt-3 font-display text-[1.45rem] font-light leading-snug text-ink transition-colors duration-300 group-hover:text-brass">
              {cs.headline}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm font-light leading-relaxed text-ink/50">{cs.challenge}</p>
            <div className="mt-auto flex items-center justify-between pt-6">
              <span className="text-[0.7rem] text-ink/45">{cs.client}</span>
              <span className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brass">
                Read case <ArrowUpRight size={12} className="transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function ResourceCard({ resource, dark = false }: { resource: Resource; dark?: boolean }) {
  const Icon = typeIcons[resource.type];
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border p-7 transition-all duration-500 ${
        dark
          ? "border-ink/12 bg-white/60 hover:border-ink/30 lift"
          : "border-bone/10 bg-carbon hover:border-gold/40"
      }`}
    >
      <div className={`img-frame -mx-7 -mt-7 aspect-[16/9] ${dark ? "" : "opacity-90"}`}>
        <img
          src={resource.image}
          alt={resource.title}
          loading="lazy"
          className="img-duotone size-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-bone/25 bg-ink/55 px-3.5 py-1.5 text-[0.62rem] font-semibold tracking-[0.18em] text-bone uppercase backdrop-blur-md">
          <Icon size={11} />
          {typeLabels[resource.type]}
        </span>
      </div>
      <h4 className={`mt-6 font-display text-[1.35rem] font-light leading-snug ${dark ? "text-ink" : "text-bone"}`}>
        {resource.title}
      </h4>
      <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${dark ? "text-ink/55" : "text-bone/50"}`}>
        {resource.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className={`text-[0.7rem] tracking-wide ${dark ? "text-ink/45" : "text-mist"}`}>{resource.meta}</span>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-all duration-400 ${
            dark ? "bg-ink text-bone group-hover:bg-brass" : "bg-gold text-ink group-hover:bg-gold-soft"
          }`}
        >
          {resource.ctaLabel} <Icon size={12} />
        </span>
      </div>
    </Link>
  );
}
