export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data generated from content frontmatter only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
