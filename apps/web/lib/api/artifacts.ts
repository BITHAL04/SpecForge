import { apiClient } from "./client";
import type { Artifact, ArtifactType } from "@specforge/shared";

export async function listArtifacts(projectId: string): Promise<Artifact[]> {
  return apiClient<Artifact[]>(`/projects/${projectId}/artifacts`);
}

export async function getArtifact(projectId: string, type: ArtifactType): Promise<Artifact> {
  return apiClient<Artifact>(`/projects/${projectId}/artifacts/${type}`);
}

export async function updateArtifact(
  projectId: string,
  type: ArtifactType,
  content: string,
): Promise<Artifact> {
  return apiClient<Artifact>(`/projects/${projectId}/artifacts/${type}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}

export async function regenerateArtifact(
  projectId: string,
  type: ArtifactType,
  feedback?: string,
): Promise<Artifact> {
  return apiClient<Artifact>(`/projects/${projectId}/artifacts/${type}/regenerate`, {
    method: "POST",
    body: JSON.stringify({ feedback }),
  });
}

