import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 text-[13px] font-medium">
      <Sparkles className="h-4 w-4 text-[#5E6AD2]" />
      <span>SpecForge</span>
    </Link>
  );
}
