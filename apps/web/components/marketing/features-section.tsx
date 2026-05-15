import { FileText, Layers, Shield, TestTube, Rocket, Sparkles } from "lucide-react";

const features = [
  { icon: FileText, title: "PRD & Personas", desc: "Complete product requirements with detailed user personas." },
  { icon: Layers, title: "Architecture", desc: "HLD, LLD, and Mermaid system diagrams ready to share." },
  { icon: Shield, title: "Security", desc: "STRIDE threat model, security audit, and RBAC matrix." },
  { icon: TestTube, title: "Testing", desc: "Test strategy, pyramid, and comprehensive test cases." },
  { icon: Rocket, title: "Deployment", desc: "CI/CD pipeline design and cloud deployment blueprint." },
  { icon: Sparkles, title: "Master Prompt", desc: "AI-ready prompt to scaffold your entire codebase." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-white/[0.04] py-32 bg-background">
      <div className="container mx-auto px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-full max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(139,157,255,0.08)_0%,transparent_70%)]" />
        <div className="mx-auto mb-20 max-w-2xl text-center relative z-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Features</p>
          <h2 className="font-sans text-4xl font-semibold tracking-tighter text-white md:text-5xl">10 artifacts, one idea</h2>
          <p className="mt-6 text-lg font-medium text-zinc-400">
            Everything your engineering team needs — generated in a single pipeline.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative rounded-3xl bg-[#0a0a0a] p-6 shadow-linear-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.15)]"
            >
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06] group-hover:ring-white/[0.1] transition-all duration-300" />
              <div className="mb-6 inline-flex rounded-2xl bg-white/[0.03] p-3 shadow-inner-border ring-1 ring-white/[0.04]">
                <Icon className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-white" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
