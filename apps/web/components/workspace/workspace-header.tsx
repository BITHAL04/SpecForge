"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Play,
  Loader2,
  ChevronDown,
  Layers,
} from "lucide-react";
import {
  ARTIFACT_TYPE_LABELS,
  ARTIFACT_TYPE_ORDER,
  type Project,
  ProjectStatus,
  type ArtifactType,
} from "@specforge/shared";
import { startGeneration } from "@/lib/api/projects";
import { downloadProjectExport } from "@/lib/api/export";
import { useProject } from "@/lib/hooks/use-project";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toastError, toastSuccess } from "@/lib/stores/toast-store";
import { ApiError } from "@/lib/api/client";

const statusVariant: Record<string, "default" | "success" | "warning" | "secondary"> = {
  draft: "secondary",
  generating: "warning",
  completed: "success",
  failed: "default",
};

export function WorkspaceHeader({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { data: project } = useProject(projectId);
  const { activeTab, setActiveTab } = useWorkspaceStore();
  const [starting, setStarting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const isGenerating = project?.status === "generating" || starting;
  const currentTab = activeTab ?? ARTIFACT_TYPE_ORDER[0];

  async function handleGenerate() {
    setStarting(true);
    try {
      await startGeneration(projectId);
      queryClient.setQueryData<Project>(["project", projectId], (current) =>
        current ? { ...current, status: ProjectStatus.GENERATING, generation_progress: 0 } : current,
      );
      await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toastSuccess("Generation started");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to start generation";
      toastError("Generation failed", message);
    } finally {
      setStarting(false);
    }
  }

  async function handleExport(format: "zip" | "markdown" | "pdf") {
    setExporting(true);
    try {
      await downloadProjectExport(projectId, format);
      toastSuccess("Export downloaded");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Export failed";
      toastError("Export failed", message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <header className="flex h-auto min-h-12 shrink-0 flex-col gap-2 border-b border-white/[0.08] bg-background/80 px-4 py-2 backdrop-blur-xl md:h-12 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[13px] font-medium">{project?.title ?? "Project"}</h1>
            {project?.status && (
              <Badge
                variant={statusVariant[project.status] ?? "secondary"}
                className="h-4 shrink-0 text-[10px] capitalize"
              >
                {project.status}
              </Badge>
            )}
          </div>
          {project?.status === "generating" && project.generation_progress != null && (
            <p className="text-[10px] text-muted-foreground">{project.generation_progress}% complete</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden">
              <Layers className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate">{ARTIFACT_TYPE_LABELS[currentTab]}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto border-white/[0.08] bg-[#0a0a0a]">
            {ARTIFACT_TYPE_ORDER.map((type: ArtifactType) => (
              <DropdownMenuItem key={type} onClick={() => setActiveTab(type)}>
                {ARTIFACT_TYPE_LABELS[type]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={exporting || isGenerating}>
              {exporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-white/[0.08] bg-[#0a0a0a]">
            <DropdownMenuItem onClick={() => handleExport("zip")}>ZIP archive</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("markdown")}>Markdown</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="hidden sm:inline">Generating...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Generate</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
