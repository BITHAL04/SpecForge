"use client";

import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/lib/stores/ui-store";

export function DashboardHeader({ title, description }: { title: string; description?: string }) {
  const { searchQuery, setSearchQuery, setCommandPaletteOpen } = useUIStore();

  return (
    <header className="sticky top-0 z-10 flex h-12 items-center justify-between gap-4 border-b border-white/[0.08] bg-background/80 px-4 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="text-[15px] font-medium tracking-tight truncate">{title}</h1>
        {description && <p className="text-[11px] text-muted-foreground truncate">{description}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-52 pl-8 text-[13px] bg-white/[0.04] border-white/[0.08] focus-visible:ring-white/20"
          />
        </div>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 text-[11px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition-colors"
        >
          <Command className="h-3 w-3" />
          <span className="hidden sm:inline">Command</span>
          <kbd className="hidden sm:inline rounded border border-white/[0.12] bg-background px-1 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
}
