"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ARTIFACT_TYPE_ORDER, type ArtifactType } from "@specforge/shared";
import { getArtifact, updateArtifact } from "@/lib/api/artifacts";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { ArtifactViewer } from "./artifact-viewer";
import { ArtifactEditor } from "./artifact-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Save, Sparkles } from "lucide-react";
import { toastError, toastSuccess } from "@/lib/stores/toast-store";

export function ArtifactPanel({
  projectId,
  isGenerating,
}: {
  projectId: string;
  isGenerating?: boolean;
}) {
  const { activeTab, editMode, setEditMode } = useWorkspaceStore();
  const type = activeTab ?? ARTIFACT_TYPE_ORDER[0];
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const { data: artifact, isLoading, isError } = useQuery({
    queryKey: ["artifact", projectId, type],
    queryFn: () => getArtifact(projectId, type),
    retry: false,
    refetchInterval: isGenerating ? 1500 : false,
  });

  const saveMutation = useMutation({
    mutationFn: (content: string) => updateArtifact(projectId, type, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifact", projectId, type] });
      setEditMode(false);
      toastSuccess("Artifact saved");
    },
    onError: () => toastError("Save failed"),
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-6 w-48 bg-white/10" />
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-3/4 bg-white/10" />
        <Skeleton className="h-64 w-full bg-white/10" />
      </div>
    );
  }

  if (isError || !artifact) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Sparkles className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-[13px] text-muted-foreground">
          {isGenerating ? "Generating this artifact..." : "This artifact hasn't been generated yet."}
        </p>
        {!isGenerating && (
          <p className="text-[11px] text-muted-foreground mt-1">Click Generate in the header to start.</p>
        )}
      </div>
    );
  }

  const content = artifact.content || "";
  const sections = artifact.structured_content?.sections;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-end gap-2 border-b border-white/[0.08] px-4 py-2">
        {editMode ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}>
              <Eye className="mr-2 h-3.5 w-3.5" /> Preview
            </Button>
            <Button size="sm" onClick={() => saveMutation.mutate(draft || content)} disabled={saveMutation.isPending}>
              <Save className="mr-2 h-3.5 w-3.5" />
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDraft(content);
              setEditMode(true);
            }}
          >
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        {editMode ? (
          <ArtifactEditor value={draft || content} onChange={setDraft} />
        ) : (
          <ArtifactViewer title={artifact.title} content={content} sections={sections} format={artifact.content_format} />
        )}
      </div>
    </div>
  );
}
