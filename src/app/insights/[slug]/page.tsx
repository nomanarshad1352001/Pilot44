import type { Metadata } from "next";
import { authorSlugByName, defaultContent } from "@/data/content";
import { ArticlePage } from "@/components/insights/ArticlePage";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return defaultContent.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = defaultContent.posts.find((p) => p.slug === slug);
  return {
    title: post?.seo?.title ?? (post ? post.title : "Insights"),
    description: post?.seo?.description ?? post?.excerpt,
  };
}

export default async function InsightArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = defaultContent.posts.find((p) => p.slug === slug);

  return (
    <>
      {post && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.seo?.description ?? post.excerpt,
            image: [post.image],
            datePublished: post.date,
            dateModified: post.updatedDate ?? post.date,
            articleSection: post.category,
            wordCount: post.body.join(" ").split(/\s+/).length,
            author: {
              "@type": "Person",
              name: post.author,
              jobTitle: post.authorRole,
              url: `https://pilot44.com/authors/${authorSlugByName(defaultContent.authors, post.author)}`,
            },
            publisher: {
              "@type": "Organization",
              name: "Pilot44",
              url: "https://pilot44.com",
            },
          }}
        />
      )}
      <ArticlePage slug={slug} />
    </>
  );
}
