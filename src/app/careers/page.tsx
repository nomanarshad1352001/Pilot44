import type { Metadata } from "next";
import { defaultContent } from "@/data/content";
import { CareersPage } from "@/components/careers/CareersPage";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Pilot44 — a studio of researchers, strategists, designers and operators building the next generation of consumer brands.",
};

export default function Careers() {
  const openJobs = defaultContent.jobs.filter((j) => j.status === "open");

  return (
    <>
      {/* JobPosting structured data — only rendered when open postings exist */}
      {openJobs.length > 0 && (
        <JsonLd
          data={openJobs.map((job) => ({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description,
            datePosted: job.postedDate ?? "2026-01-05",
            employmentType: job.type.toUpperCase().replace("-", "_"),
            hiringOrganization: {
              "@type": "Organization",
              name: "Pilot44",
              sameAs: "https://pilot44.com",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.location.split("·")[0].trim(),
                addressCountry: "US",
              },
            },
          }))}
        />
      )}
      <CareersPage />
    </>
  );
}
