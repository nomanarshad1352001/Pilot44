import type { MetadataRoute } from "next";
import { defaultContent, publicPosts } from "@/data/content";

const BASE = "https://pilot44.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/case-studies", "/insights", "/careers", "/contact", "/terms", "/privacy"].map(
    (p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly" as const })
  );

  const posts = publicPosts(defaultContent.posts).map((p) => ({
    url: `${BASE}/insights/${p.slug}`,
    lastModified: p.updatedDate ?? p.date,
    changeFrequency: "monthly" as const,
  }));

  const authors = defaultContent.authors.map((a) => ({
    url: `${BASE}/authors/${a.slug}`,
    changeFrequency: "monthly" as const,
  }));

  const cases = defaultContent.caseStudies.map((c) => ({
    url: `${BASE}/case-studies/${c.slug}`,
    changeFrequency: "monthly" as const,
  }));

  const resources = defaultContent.resources.map((r) => ({
    url: `${BASE}/resources/${r.slug}`,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...posts, ...authors, ...cases, ...resources];
}
