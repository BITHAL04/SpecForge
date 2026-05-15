import Link from "next/link";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying SpecForge",
    features: ["3 projects / month", "All 10 artifact types", "Markdown export", "Community support"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious builders",
    features: ["Unlimited projects", "Priority generation", "ZIP export", "Version history", "Custom stack hints"],
    cta: "Start Pro trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams at scale",
    features: ["Team workspaces", "SSO & SAML", "Custom prompts", "Dedicated support", "SLA guarantee"],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-white/[0.08] py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Pricing</p>
          <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-[15px] text-zinc-400">Start free. Upgrade when you need more.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 shadow-xl backdrop-blur-sm transition-all duration-200 ${
                tier.highlighted
                  ? "border-[#8B9DFF]/40 bg-zinc-900/60 shadow-2xl scale-[1.02] linear-glow"
                  : "border-white/[0.08] bg-zinc-900/20 hover:border-white/20"
              }`}
            >
              <h3 className="text-[15px] font-medium text-white">{tier.name}</h3>
              <p className="mt-1 text-[13px] text-zinc-400">{tier.description}</p>
              <div className="pt-4">
                <span className="font-display text-4xl text-white">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-[13px] text-zinc-500">/month</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-zinc-400">
                    <Check className="h-4 w-4 shrink-0 text-[#8B9DFF]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "border border-white/[0.08] text-white hover:bg-white/[0.04]"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
