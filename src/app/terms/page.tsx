"use client";

import { useContent } from "@/lib/store";
import { LegalPage } from "@/components/legal/LegalPage";

export default function Terms() {
  const { content } = useContent();
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="Last updated January 2026"
      sections={content.legal.terms}
    />
  );
}
