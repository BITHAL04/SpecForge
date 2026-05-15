"""Shared runtime helpers for the LangGraph generation pipeline."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Any, Mapping

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.crud import artifact_crud
from app.graph.prompts.system import BASE_SYSTEM
from app.llm.client import LLMClient
from app.models import Artifact, ArtifactType, ContentFormat, GenerationEvent, GenerationEventType, Project

logger = structlog.get_logger()

LLM_ARTIFACT_TARGET = 9


@dataclass(slots=True)
class ArtifactNodeSpec:
    node_name: str
    agent_name: str
    artifact_type: ArtifactType
    title: str
    system_prompt: str
    content_format: ContentFormat = ContentFormat.MARKDOWN
    step_index: int = 1
    total_steps: int = 1
    prompt_template: str = ""


@dataclass(slots=True)
class GenerationRuntime:
    db: AsyncSession
    project: Project
    llm: LLMClient
    db_lock: asyncio.Lock = field(default_factory=asyncio.Lock)


def get_runtime(config: Mapping[str, Any] | None) -> GenerationRuntime:
    configurable = (config or {}).get("configurable", {})
    runtime = configurable.get("runtime")
    if not isinstance(runtime, GenerationRuntime):
        raise ValueError("LangGraph runtime is missing from the execution config")
    return runtime


def _normalize_text(text: str) -> str:
    return "\n".join(line.rstrip() for line in text.strip().splitlines()).strip()


def _format_previous_context(state: Mapping[str, Any]) -> str:
    artifacts = state.get("artifacts", {}) or {}
    if not artifacts:
        return "None yet."

    lines: list[str] = []
    for artifact_type, artifact_data in artifacts.items():
        title = artifact_data.get("title", artifact_type)
        summary = " ".join(str(artifact_data.get("content", "")).split())
        if len(summary) > 220:
            summary = f"{summary[:217]}..."
        lines.append(f"- {artifact_type}: {title}\n  {summary}")
    return "\n".join(lines)


def _first_heading(content: str) -> str | None:
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            heading = stripped.lstrip("#").strip()
            if heading:
                return heading
    return None


def _fallback_title(idea: str) -> str:
    words = [word.strip(".,:;!?()[]{}") for word in idea.split()]
    words = [word for word in words if word]
    if not words:
        return "SpecForge Project"
    return " ".join(words[:5]).title()


def _output_instructions(content_format: ContentFormat) -> str:
    if content_format == ContentFormat.MERMAID:
        return "Produce valid Mermaid syntax only."
    if content_format == ContentFormat.OPENAPI:
        return "Produce a valid OpenAPI 3.1 YAML document."
    if content_format == ContentFormat.JSON:
        return "Produce valid JSON only."
    return "Produce clean markdown with clear headings and concise bullets."


def build_user_prompt(state: Mapping[str, Any], spec: ArtifactNodeSpec) -> str:
    idea = state.get("idea", "")
    project_title = state.get("title") or "Untitled Project"
    previous_context = _format_previous_context(state)

    return (
        f"Project idea:\n{idea}\n\n"
        f"Project title:\n{project_title}\n\n"
        f"Prior artifacts:\n{previous_context}\n\n"
        f"Generate '{spec.title}' for the {spec.agent_name}.\n"
        f"{_output_instructions(spec.content_format)}\n"
        "Be specific, concise, and implementation-ready."
    )


def _fallback_markdown(spec: ArtifactNodeSpec, state: Mapping[str, Any]) -> str:
    previous = _format_previous_context(state)
    idea = state.get("idea", "")

    if spec.node_name == "requirements":
        heading = _fallback_title(idea)
        return _normalize_text(
            f"""# {heading}

## Problem Statement
{idea}

## Requirements
- Core product scope
- Primary user journeys
- Non-functional constraints
- Risks and assumptions

## Context
{previous}
"""
        )

    if spec.node_name == "stories" or spec.node_name == "product":
        return _normalize_text(
            f"""# User Stories

## Vision
Translate the requirements into an executable product direction.

## User Stories
- As a user, I can accomplish the core workflow end-to-end.
- As an operator, I can monitor and support the system.

## Dependencies
{previous}
"""
        )

    if spec.node_name == "lld":
        return _normalize_text(
            f"""# Low-Level Design

## Component Design
Detailed specifications of the system modules and class designs.

## Class Diagram
- Component relationships and inheritance structures.
- Data structures and helper classes.

## Context
{previous}
"""
        )

    if spec.node_name == "architecture":
        return _normalize_text(
            f"""# Architecture Overview

## Components
- API service
- Workflow engine
- PostgreSQL persistence
- Frontend clients

## Data Flow
{previous}
"""
        )

    if spec.node_name == "security":
        return _normalize_text(
            f"""# Security Review

## Threat Model
- Authentication and authorization
- Data isolation per project
- Secret management

## RBAC
{previous}
"""
        )

    if spec.node_name == "testing":
        return _normalize_text(
            f"""# Testing Strategy

## Coverage
- API contract tests
- Workflow integration tests
- Database persistence tests

## Context
{previous}
"""
        )

    if spec.node_name == "devops":
        return _normalize_text(
            f"""# Deployment Blueprint

## Delivery
- CI pipeline
- Database migrations
- Containerized deployment
- Observability and rollback

## Inputs
{previous}
"""
        )

    if spec.content_format == ContentFormat.MERMAID:
        return _normalize_text(
            """erDiagram
    PROJECTS ||--o{ ARTIFACTS : contains
    PROJECTS ||--o{ GENERATION_EVENTS : emits

    PROJECTS {
        uuid id
        uuid user_id
        string title
        text idea
    }

    ARTIFACTS {
        uuid id
        uuid project_id
        string type
        string title
        text content
    }

    GENERATION_EVENTS {
        uuid id
        uuid project_id
        string event_type
        text message
    }
"""
        )

    if spec.content_format == ContentFormat.OPENAPI:
        return _normalize_text(
            """openapi: 3.1.0
info:
  title: SpecForge API
  version: 1.0.0
paths:
  /projects/{project_id}/generate:
    post:
      summary: Start artifact generation
  /projects/{project_id}/artifacts:
    get:
      summary: List generated artifacts
"""
        )

    return _normalize_text(
        f"""# Master Prompt

Use the generated artifacts below to build the product end to end.

{previous}
"""
    )


async def _generate_content(
    runtime: GenerationRuntime, spec: ArtifactNodeSpec, state: Mapping[str, Any]
) -> str:
    settings = get_settings()
    system_prompt = f"{BASE_SYSTEM}\n\n{spec.system_prompt}"
    user_prompt = build_user_prompt(state, spec)

    from app.llm.client import has_valid_key
    if not has_valid_key():
        return _fallback_markdown(spec, state)

    try:
        return await runtime.llm.generate(system_prompt, user_prompt)
    except Exception as exc:  # pragma: no cover - network/runtime dependent
        logger.warning(
            "generation.llm_fallback",
            project_id=str(runtime.project.id),
            artifact_type=spec.artifact_type.value,
            error=str(exc),
        )
        return _fallback_markdown(spec, state)


async def _save_artifact(
    runtime: GenerationRuntime, spec: ArtifactNodeSpec, content: str, state: Mapping[str, Any]
) -> Artifact:
    existing = await artifact_crud.get_by_type(runtime.db, runtime.project.id, spec.artifact_type)
    structured_content = {
        "agent": spec.agent_name,
        "artifact_type": spec.artifact_type.value,
        "format": spec.content_format.value,
        "source_artifacts": list((state.get("context", {}) or {}).keys()),
    }

    if existing:
        existing.title = spec.title
        existing.content = content
        existing.structured_content = structured_content
        existing.content_format = spec.content_format
        existing.is_generated = True
        existing.version += 1
        return await artifact_crud.update(runtime.db, existing)

    artifact = Artifact(
        project_id=runtime.project.id,
        type=spec.artifact_type,
        title=spec.title,
        content=content,
        structured_content=structured_content,
        content_format=spec.content_format,
        is_generated=True,
    )
    return await artifact_crud.create(runtime.db, artifact)


async def _record_progress(
    runtime: GenerationRuntime,
    spec: ArtifactNodeSpec,
    artifact: Artifact,
    content: str,
) -> None:
    result = await runtime.db.execute(
        select(func.count())
        .select_from(Artifact)
        .where(
            Artifact.project_id == runtime.project.id,
            Artifact.is_generated.is_(True),
        )
    )
    completed = result.scalar_one()
    progress = min(95, round((completed / LLM_ARTIFACT_TARGET) * 100))
    runtime.project.generation_progress = max(runtime.project.generation_progress or 0, progress)
    if spec.node_name == "requirements":
        heading = _first_heading(content)
        if heading:
            runtime.project.title = heading

    await runtime.db.flush()
    runtime.db.add(
        GenerationEvent(
            project_id=runtime.project.id,
            artifact_type=spec.artifact_type,
            event_type=GenerationEventType.PROGRESS,
            message=f"{spec.agent_name} completed",
            payload={
                "progress": progress,
                "artifact_id": str(artifact.id),
                "artifact_type": spec.artifact_type.value,
            },
        )
    )
    await runtime.db.commit()


async def execute_generation_node(
    state: Mapping[str, Any], config: Mapping[str, Any] | None, spec: ArtifactNodeSpec
) -> dict[str, Any]:
    runtime = get_runtime(config)
    content = await _generate_content(runtime, spec, state)

    async with runtime.db_lock:
        artifact = await _save_artifact(runtime, spec, content, state)
        await _record_progress(runtime, spec, artifact, content)

    context = dict(state.get("context", {}) or {})
    context[spec.node_name] = content

    artifacts = dict(state.get("artifacts", {}) or {})
    artifacts[spec.artifact_type.value] = {
        "type": spec.artifact_type.value,
        "title": spec.title,
        "content": content,
        "content_format": spec.content_format.value,
    }

    return {
        "context": context,
        "artifacts": artifacts,
    }