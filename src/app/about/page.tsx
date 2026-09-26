import type { Metadata } from "next";
import { defaultContent } from "@/data/content";
import { AboutPage } from "@/components/about/AboutPage";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Pilot44 is a modern innovation studio for the enterprise — part research lab, part venture builder, part digital accelerator.",
};

export default function About() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: defaultContent.about.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <AboutPage />
    </>
  );
}
