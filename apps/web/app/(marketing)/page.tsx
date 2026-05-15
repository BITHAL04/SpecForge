import { HeroSection } from "@/components/marketing/hero-section";
import { FloatingCards } from "@/components/marketing/floating-cards";
import { DemoSection } from "@/components/marketing/demo-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FloatingCards />
      <DemoSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
