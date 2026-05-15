"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ARTIFACT_TYPE_ORDER } from "@specforge/shared";
import { listArtifacts } from "@/lib/api/artifacts";
import { useProject } from "@/lib/hooks/use-project";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { ArtifactSidebar } from "./artifact-sidebar";
import { ArtifactPanel } from "./artifact-panel";
import { WorkspaceHeader } from "./workspace-header";
import { GenerationTimeline } from "./generation-timeline";

export function WorkspaceShell({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { setActiveTab, setEditMode, activeTab } = useWorkspaceStore();
  const { data: project } = useProject(projectId);

  const { data: artifacts } = useQuery({
    queryKey: ["artifacts", projectId],
    queryFn: () => listArtifacts(projectId),
    retry: false,
    refetchInterval: project?.status === "generating" ? 1500 : false,
  });

  useEffect(() => {
    setActiveTab(ARTIFACT_TYPE_ORDER[0]);
    setEditMode(false);
  }, [projectId, setActiveTab, setEditMode]);

  useEffect(() => {
    if (!activeTab) setActiveTab(ARTIFACT_TYPE_ORDER[0]);
  }, [activeTab, setActiveTab]);

  useEffect(() => {
    if (project?.status === "completed" || project?.status === "failed") {
      queryClient.invalidateQueries({ queryKey: ["artifacts", projectId] });
      queryClient.invalidateQueries({ queryKey: ["artifact", projectId] });
    }
  }, [project?.status, projectId, queryClient]);

  const isGenerating = project?.status === "generating";
  const availableTypes = artifacts?.map((a) => a.type);

  return (
    <div className="flex h-full flex-col bg-background">
      <WorkspaceHeader projectId={projectId} />
      <div className="flex flex-1 overflow-hidden">
        <ArtifactSidebar availableTypes={availableTypes} />
        <main className="flex-1 overflow-hidden min-w-0">
          <ArtifactPanel projectId={projectId} isGenerating={isGenerating} />
        </main>
        <GenerationTimeline
          projectId={projectId}
          enabled={isGenerating || project?.status === "completed" || project?.status === "failed"}
        />
      </div>
    </div>
  );
}
