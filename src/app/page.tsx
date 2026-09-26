import { Hero } from "@/components/home/Hero";
import { Mission, CapabilityTabs, Services } from "@/components/home/HomeSections";
import { Testimonial, InsightsTeaser, CTASection } from "@/components/home/HomeClosing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Mission />
      <CapabilityTabs />
      <Services />
      <Testimonial />
      <InsightsTeaser />
      <CTASection />
    </>
  );
}
