"""Master prompt generation service for SpecForge."""

from __future__ import annotations

from collections.abc import Mapping

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import artifact_crud
from app.graph.prompts.master_prompt import build_master_prompt_bundle, render_master_prompt_markdown
from app.models import Artifact, ArtifactType, ContentFormat, Project


def _normalize_source_artifacts(
    artifacts: list[Artifact] | Mapping[str, dict[str, object]],
) -> dict[str, dict[str, object]]:
    if isinstance(artifacts, Mapping):
        return {key: dict(value) for key, value in artifacts.items() if isinstance(value, Mapping)}

    normalized: dict[str, dict[str, object]] = {}
    for artifact in artifacts:
        normalized[artifact.type.value] = {
            "title": artifact.title,
            "content": artifact.content,
            "content_format": artifact.content_format.value,
            "version": artifact.version,
        }
    return normalized


async def generate_master_prompt_bundle(
    project: Project,
    artifacts: list[Artifact] | Mapping[str, dict[str, object]],
) -> dict[str, object]:
    source_artifacts = _normalize_source_artifacts(artifacts)
    payload = build_master_prompt_bundle(project.title, project.idea, source_artifacts)
    content = render_master_prompt_markdown(payload)
    structured_content = {
        "title": payload["title"],
        "project_title": payload["project_title"],
        "project_idea": payload["project_idea"],
        "prompts": payload["prompts"],
        "missing_sources": payload["missing_sources"],
    }
    return {
        **payload,
        "content": content,
        "structured_content": structured_content,
    }


async def persist_master_prompt_artifact(
    db: AsyncSession,
    project: Project,
    bundle: dict[str, object],
) -> Artifact:
    content = str(bundle["content"])
    structured_content = bundle["structured_content"]

    existing = await artifact_crud.get_by_type(db, project.id, ArtifactType.MASTER_PROMPT)
    if existing:
        existing.title = "Master Prompt Generator"
        existing.content = content
        existing.structured_content = structured_content
        existing.content_format = ContentFormat.MARKDOWN
        existing.is_generated = True
        existing.version += 1
        return await artifact_crud.update(db, existing)

    artifact = Artifact(
        project_id=project.id,
        type=ArtifactType.MASTER_PROMPT,
        title="Master Prompt Generator",
        content=content,
        structured_content=structured_content,
        content_format=ContentFormat.MARKDOWN,
        is_generated=True,
    )
    return await artifact_crud.create(db, artifact)


def get_missing_sources(bundle: dict[str, object]) -> list[str]:
    return list(bundle.get("missing_sources", []))


def get_platform_prompts(bundle: dict[str, object]) -> list[dict[str, object]]:
    return list(bundle.get("prompts", []))
