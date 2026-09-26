import { defaultContent } from "@/data/content";

/**
 * GET /llms.txt — generated from the same content collections that drive the
 * site, giving AI crawlers a concise map of who Pilot44 is and what lives here.
 */
export function GET() {
  const c = defaultContent;
  const posts = [...c.posts]
    .filter((p) => p.status === "published")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const lines: string[] = [
    "# Pilot44",
    "",
    `> ${c.home.headline}. ${c.general.tagline}`,
    "",
    `Pilot44 is a consumer brand innovation and venture building studio. Part research lab, part venture builder, part digital accelerator, working with the world's leading consumer companies. Headquarters: ${c.general.address}. Contact: ${c.general.contactEmail}.`,
    "",
    "## Site structure",
    "",
    `- Home: / — ${c.home.eyebrow}`,
    "- About: /about — Modern innovation studio for the enterprise",
    "- Case Studies: /case-studies — evidence from client engagements",
    "- Insights: /insights — articles on brand innovation, venture building, AI, retail and CPG strategy",
    "- Careers: /careers — open roles at the studio",
    "- Contact: /contact — get in touch (purpose options include RFP, partnership, career, PR & media)",
    "",
    "## Insights (articles)",
    "",
    ...posts.map(
      (p) =>
        `- [${p.title}](/insights/${p.slug}) — ${p.category}, by ${p.author} (${p.authorRole}), ${p.date}. ${p.excerpt}`
    ),
    "",
    "## Case studies",
    "",
    ...c.caseStudies.map(
      (cs) =>
        `- [${cs.headline}](/case-studies/${cs.slug}) — ${cs.industry}; services: ${cs.services.join(", ")}. Outcome: ${cs.outcome}`
    ),
    "",
    "## Resources (gated landing pages — summaries are public)",
    "",
    ...c.resources.map((r) => `- [${r.title}](/resources/${r.slug}) — ${r.type}; ${r.description}`),
    "",
    "## Authors",
    "",
    ...c.authors.map((a) => `- [${a.name}](/authors/${a.slug}) — ${a.role}. ${a.bio}`),
    "",
    "## Careers (open roles)",
    "",
    ...c.jobs
      .filter((j) => j.status === "open")
      .map((j) => `- ${j.title} — ${j.team}, ${j.location}, ${j.type}. Apply: ${j.applyEmail}`),
    "",
    "## Contact",
    "",
    `- Email: ${c.general.contactEmail}`,
    `- Phone: ${c.general.phone}`,
    `- Address: ${c.general.address}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
