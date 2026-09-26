import type { Metadata } from "next";
import { defaultContent } from "@/data/content";
import { ResourcePage } from "@/components/resources/ResourcePage";

export function generateStaticParams() {
  return defaultContent.resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = defaultContent.resources.find((r) => r.slug === slug);
  return { title: resource ? resource.title : "Resources", description: resource?.description };
}

export default async function ResourceRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ResourcePage slug={slug} />;
}
