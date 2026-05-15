import type { ArtifactType, ProjectStatus } from "./artifact-types";

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  idea: string;
  status: ProjectStatus;
  generation_progress: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ArtifactSection {
  id: string;
  title: string;
  content: string;
  format: "markdown" | "mermaid" | "openapi" | "json";
}

export interface StructuredContent {
  sections: ArtifactSection[];
  metadata?: Record<string, unknown>;
}

export interface Artifact {
  id: string;
  project_id: string;
  type: ArtifactType;
  title: string;
  content: string;
  structured_content?: StructuredContent;
  content_format: "markdown" | "mermaid" | "openapi" | "json";
  version: number;
  is_generated: boolean;
  created_at: string;
  updated_at: string;
}
