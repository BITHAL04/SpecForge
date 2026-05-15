export enum ArtifactType {
  PRD = "PRD",
  STORIES = "STORIES",
  HLD = "HLD",
  LLD = "LLD",
  ERD = "ERD",
  API_SPEC = "API_SPEC",
  SECURITY = "SECURITY",
  TESTING = "TESTING",
  DEPLOYMENT = "DEPLOYMENT",
  MASTER_PROMPT = "MASTER_PROMPT",
}

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  [ArtifactType.PRD]: "Product Requirements",
  [ArtifactType.STORIES]: "User Stories",
  [ArtifactType.HLD]: "High Level Design",
  [ArtifactType.LLD]: "Low Level Design",
  [ArtifactType.ERD]: "Database & ER Diagrams",
  [ArtifactType.API_SPEC]: "API Specification",
  [ArtifactType.SECURITY]: "Security & RBAC",
  [ArtifactType.TESTING]: "Testing Strategy",
  [ArtifactType.DEPLOYMENT]: "Deployment & CI/CD",
  [ArtifactType.MASTER_PROMPT]: "Master AI Prompt",
};

export const ARTIFACT_TYPE_ORDER: ArtifactType[] = [
  ArtifactType.PRD,
  ArtifactType.STORIES,
  ArtifactType.HLD,
  ArtifactType.LLD,
  ArtifactType.ERD,
  ArtifactType.API_SPEC,
  ArtifactType.SECURITY,
  ArtifactType.TESTING,
  ArtifactType.DEPLOYMENT,
  ArtifactType.MASTER_PROMPT,
];

export enum ProjectStatus {
  DRAFT = "draft",
  GENERATING = "generating",
  COMPLETED = "completed",
  FAILED = "failed",
}
