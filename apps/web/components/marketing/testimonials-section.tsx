import Link from "next/link";
import { Sparkles } from "lucide-react";

const testimonials = [
  {
    quote: "SpecForge cut our discovery phase from 3 weeks to 2 hours. The architecture diagrams alone saved us days of meetings.",
    name: "Sarah Chen",
    role: "CTO, Launchpad",
    initials: "SC",
  },
  {
    quote: "We fed the master prompt into Cursor and had a working MVP scaffold in a day. This is how specs should work.",
    name: "Marcus Webb",
    role: "Founding Engineer, Stackline",
    initials: "MW",
  },
  {
    quote: "The security audit and RBAC design caught issues we'd have missed until production. Enterprise-grade from day one.",
    name: "Elena Rodriguez",
    role: "VP Engineering, NovaFin",
    initials: "ER",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-white/[0.08] py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl">Loved by builders</h2>
          <p className="mt-4 text-[15px] text-zinc-400">Teams ship faster with SpecForge blueprints.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/[0.08] bg-zinc-900/30 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-[13px] leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-zinc-950 text-[11px] font-medium text-[#8B9DFF]">
                   {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white">{t.name}</p>
                  <p className="text-[11px] text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
