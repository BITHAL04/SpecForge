import {
  FileText,
  ListTodo,
  Layers,
  Boxes,
  Database,
  Globe,
  Shield,
  TestTube,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ArtifactType } from "@specforge/shared";

export const ARTIFACT_ICONS: Record<ArtifactType, LucideIcon> = {
  PRD: FileText,
  STORIES: ListTodo,
  HLD: Layers,
  LLD: Boxes,
  ERD: Database,
  API_SPEC: Globe,
  SECURITY: Shield,
  TESTING: TestTube,
  DEPLOYMENT: Rocket,
  MASTER_PROMPT: Sparkles,
};
