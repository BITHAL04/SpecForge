import { API_URL, apiClient } from "./client";
import type { GenerationEvent } from "@specforge/shared";

export async function listProjectEvents(projectId: string): Promise<GenerationEvent[]> {
  return apiClient<GenerationEvent[]>(`/projects/${projectId}/events`);
}

export function getGenerationStreamUrl(projectId: string, token: string): string {
  return `${API_URL}/projects/${projectId}/generate/stream?token=${encodeURIComponent(token)}`;
}
