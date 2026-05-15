import pytest
from sqlalchemy import select
from uuid import UUID

from app.graph.runner import run_generation
from app.models import Artifact, ArtifactType, Project, ProjectStatus


@pytest.mark.asyncio
async def test_generation_workflow_persists_all_artifacts(
    client,
    auth_headers: dict,
    project_id: str,
    monkeypatch,
    test_session_factory,
):
    async def fake_generate(self, system: str, user: str, response_format=None):
        if "OpenAPI" in system or "OpenAPI" in user:
            return "openapi: 3.1.0\ninfo:\n  title: SpecForge API\n  version: 1.0.0\npaths: {}\n"
        if "Mermaid" in system or "Mermaid" in user or "diagram" in user.lower():
            return (
                "erDiagram\n"
                "    PROJECTS ||--o{ ARTIFACTS : contains\n"
                "    PROJECTS ||--o{ GENERATION_EVENTS : emits\n"
            )
        return "# Generated Artifact\n\nContent generated for the pipeline."

    monkeypatch.setattr("app.llm.client.LLMClient.generate", fake_generate)

    await run_generation(project_id, session_factory=test_session_factory)

    project_uuid = UUID(project_id)

    async with test_session_factory() as session:
        project_result = await session.execute(select(Project).where(Project.id == project_uuid))
        project = project_result.scalar_one()
        assert project.status == ProjectStatus.COMPLETED
        assert project.generation_progress == 100

        artifact_result = await session.execute(
            select(Artifact).where(Artifact.project_id == project.id).order_by(Artifact.created_at.asc())
        )
        artifacts = list(artifact_result.scalars().all())
        assert len(artifacts) == 10
        assert {artifact.type for artifact in artifacts} == {
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
        }