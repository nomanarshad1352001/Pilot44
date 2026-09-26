import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/lib/store";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plexmono",
});

export const metadata: Metadata = {
  title: {
    default: "Pilot44 — Consumer Brand Innovation & Venture Building Studio",
    template: "%s — Pilot44",
  },
  description:
    "Pilot44 is today's most advanced and integrated consumer brand innovation and venture building studio. We build new brands, products, and businesses, and grow existing ones.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="grain bg-ink text-bone antialiased">
        {/* Site-wide Organization structured data for AI-search readiness */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pilot44",
            url: "https://pilot44.com",
            description:
              "Today's most advanced and integrated consumer brand innovation and venture building studio. We build new brands, products, and businesses, and grow existing ones.",
            email: "hello@pilot44.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "44 Tehama Street",
              addressLocality: "San Francisco",
              addressRegion: "CA",
              postalCode: "94105",
              addressCountry: "US",
            },
            sameAs: [
              "https://www.linkedin.com/company/pilot44",
              "https://x.com/pilot44",
              "https://www.instagram.com/pilot44",
            ],
          }}
        />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
