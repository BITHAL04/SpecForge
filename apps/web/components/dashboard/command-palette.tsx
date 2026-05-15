"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Settings, FolderOpen } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUIStore } from "@/lib/stores/ui-store";
import { useProjects } from "@/lib/hooks/use-projects";
import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPE_ORDER } from "@specforge/shared";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { data: projects } = useProjects();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  function run(action: () => void) {
    setCommandPaletteOpen(false);
    action();
  }

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Search projects, artifacts, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => router.push("/projects/new"))}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/dashboard"))}>
            <FolderOpen className="mr-2 h-4 w-4" /> All Projects
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </CommandItem>
        </CommandGroup>

        {projects && projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.map((p) => (
                <CommandItem key={p.id} onSelect={() => run(() => router.push(`/projects/${p.id}`))}>
                  <FileText className="mr-2 h-4 w-4" />
                  {p.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Artifacts">
          {ARTIFACT_TYPE_ORDER.map((type) => (
            <CommandItem key={type} disabled>
              <FileText className="mr-2 h-4 w-4 opacity-50" />
              {ARTIFACT_TYPE_LABELS[type]}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
