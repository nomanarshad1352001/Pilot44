import type { Metadata } from "next";
import { CaseStudiesPage } from "@/components/case-studies/CaseStudiesPage";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Selected engagements from the Pilot44 studio — the challenges, the builds, and the numbers that decided what happened next.",
};

export default function CaseStudies() {
  return <CaseStudiesPage />;
}
