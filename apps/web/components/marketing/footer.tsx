import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-12 bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <Link href="/" className="flex items-center gap-2 text-[13px] font-medium text-white hover:text-white/90">
          <Sparkles className="h-4 w-4 text-[#8B9DFF]" />
          SpecForge
        </Link>
        <div className="flex gap-8 text-[13px] text-zinc-400">
          <Link href="#pricing" className="transition-colors hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="transition-colors hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="transition-colors hover:text-white">
            Sign up
          </Link>
        </div>
        <p className="text-[13px] text-zinc-500">© 2026 SpecForge</p>
      </div>
    </footer>
  );
}
