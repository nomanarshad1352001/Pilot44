import type { Metadata } from "next";
import { defaultContent } from "@/data/content";
import { AuthorPage } from "@/components/authors/AuthorPage";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return defaultContent.authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = defaultContent.authors.find((a) => a.slug === slug);
  return { title: author ? `${author.name} — ${author.role}` : "Authors", description: author?.bio };
}

export default async function AuthorRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = defaultContent.authors.find((a) => a.slug === slug);

  return (
    <>
      {author && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: author.name,
            jobTitle: author.role,
            description: author.bio,
            url: `https://pilot44.com/authors/${author.slug}`,
            ...(author.avatar ? { image: author.avatar } : {}),
            worksFor: {
              "@type": "Organization",
              name: "Pilot44",
              url: "https://pilot44.com",
            },
          }}
        />
      )}
      <AuthorPage slug={slug} />
    </>
  );
}
