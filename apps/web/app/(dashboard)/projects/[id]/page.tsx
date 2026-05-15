import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <WorkspaceShell projectId={id} />;
}
