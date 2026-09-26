import type { Metadata } from "next";
import { defaultContent } from "@/data/content";
import { CaseStudyDetail } from "@/components/case-studies/CaseStudyDetail";

export function generateStaticParams() {
  return defaultContent.caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = defaultContent.caseStudies.find((c) => c.slug === slug);
  return { title: cs ? `${cs.headline} — Case Study` : "Case Study", description: cs?.challenge.slice(0, 160) };
}

export default async function CaseStudyRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CaseStudyDetail slug={slug} />;
}
