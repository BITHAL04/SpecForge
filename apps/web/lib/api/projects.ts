import { apiClient } from "./client";
import type { Project } from "@specforge/shared";

export async function listProjects(): Promise<Project[]> {
  const data = await apiClient<{ items: Project[] }>("/projects");
  return data.items;
}

export async function createProject(idea: string, title?: string): Promise<Project> {
  return apiClient<Project>("/projects", {
    method: "POST",
    body: JSON.stringify({ idea, title }),
  });
}

export async function getProject(id: string): Promise<Project> {
  return apiClient<Project>(`/projects/${id}`);
}

export async function deleteProject(id: string): Promise<void> {
  return apiClient<void>(`/projects/${id}`, { method: "DELETE" });
}

export async function startGeneration(id: string): Promise<void> {
  await apiClient(`/projects/${id}/generate`, { method: "POST" });
}
