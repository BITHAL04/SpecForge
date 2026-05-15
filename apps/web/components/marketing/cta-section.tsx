import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.08] py-32 bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5E6AD2]/10 to-transparent" />
      <div className="container relative mx-auto px-4 text-center">
        <h2 className="font-display text-3xl tracking-tight text-white md:text-5xl">Ready to forge your spec?</h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] text-zinc-400">
          Join builders who ship faster with complete engineering blueprints.
        </p>
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Start free — no credit card
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
