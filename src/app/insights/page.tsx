import type { Metadata } from "next";
import { InsightsPage } from "@/components/insights/InsightsPage";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Bold thinking for brand innovators and business builders — research, venture building, AI, retail and CPG strategy from the Pilot44 studio.",
};

export default function Insights() {
  return <InsightsPage />;
}
