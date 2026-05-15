import type { ArtifactType } from "./artifact-types";

export enum GenerationEventType {
  STARTED = "started",
  PROGRESS = "progress",
  COMPLETED = "completed",
  ERROR = "error",
}

export interface GenerationEvent {
  id: string;
  project_id: string;
  artifact_type: ArtifactType | null;
  event_type: GenerationEventType;
  message: string;
  payload?: Record<string, unknown>;
  created_at: string;
}
