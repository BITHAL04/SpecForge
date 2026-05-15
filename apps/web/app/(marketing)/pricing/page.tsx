import { PricingSection } from "@/components/marketing/pricing-section";

export default function PricingPage() {
  return (
    <div className="bg-bg-base pb-16 pt-24">
      <div className="container mx-auto mb-12 px-4 text-center">
        <h1 className="font-display text-4xl tracking-tight text-[#1a1a1a]">Pricing</h1>
        <p className="mt-2 text-[15px] text-[#8e8e8e]">Choose the plan that fits your team</p>
      </div>
      <PricingSection />
    </div>
  );
}
