"use client";

import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPE_ORDER, type ArtifactType } from "@specforge/shared";
import { ARTIFACT_ICONS } from "@/lib/constants/artifacts";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils/cn";

interface ArtifactSidebarProps {
  availableTypes?: ArtifactType[];
}

export function ArtifactSidebar({ availableTypes }: ArtifactSidebarProps) {
  const { activeTab, setActiveTab } = useWorkspaceStore();
  const current = activeTab ?? ARTIFACT_TYPE_ORDER[0];

  return (
    <aside className="hidden md:flex w-52 flex-col border-r border-white/[0.08] bg-background shrink-0">
      <div className="h-12 flex items-center border-b border-white/[0.08] px-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Artifacts</p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-1.5 space-y-0.5">
          {ARTIFACT_TYPE_ORDER.map((type) => {
            const Icon = ARTIFACT_ICONS[type];
            const hasContent = !availableTypes || availableTypes.includes(type);
            const active = current === type;

            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] transition-colors",
                  active
                    ? "bg-white/[0.08] text-foreground font-medium"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  !hasContent && "opacity-40",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{ARTIFACT_TYPE_LABELS[type]}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
