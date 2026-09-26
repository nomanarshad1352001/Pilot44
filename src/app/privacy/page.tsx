"use client";

import { useContent } from "@/lib/store";
import { LegalPage } from "@/components/legal/LegalPage";

export default function Privacy() {
  const { content } = useContent();
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="Last updated January 2026"
      sections={content.legal.privacy}
    />
  );
}
