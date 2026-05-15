"""Async generation runner with DB persistence and SSE events."""

from __future__ import annotations

import structlog
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.db.session import AsyncSessionLocal
from app.graph.runtime import GenerationRuntime
from app.graph.workflow import build_workflow
from app.llm.client import LLMClient
from app.models import GenerationEvent, GenerationEventType, Project, ProjectStatus

logger = structlog.get_logger()


async def run_generation(
    project_id: str,
    session_factory: async_sessionmaker[AsyncSession] = AsyncSessionLocal,
) -> None:
    project_uuid = UUID(project_id) if isinstance(project_id, str) else project_id

    async with session_factory() as db:
        result = await db.execute(select(Project).where(Project.id == project_uuid))
        project = result.scalar_one_or_none()
        if not project:
            return

        project.status = ProjectStatus.GENERATING
        project.generation_progress = 0
        db.add(
            GenerationEvent(
                project_id=project.id,
                event_type=GenerationEventType.STARTED,
                message="Generation pipeline started",
            )
        )
        await db.commit()

        try:
            runtime = GenerationRuntime(db=db, project=project, llm=LLMClient())
            workflow = build_workflow()
            await workflow.ainvoke(
                {
                    "project_id": str(project.id),
                    "idea": project.idea,
                    "title": project.title,
                    "context": {},
                    "artifacts": {},
                    "errors": [],
                },
                config={"configurable": {"runtime": runtime}},
            )
            logger.info("generation.complete", project_id=project_id)
            project.status = ProjectStatus.COMPLETED
            project.generation_progress = 100
            db.add(
                GenerationEvent(
                    project_id=project.id,
                    event_type=GenerationEventType.COMPLETED,
                    message="All artifacts generated successfully",
                )
            )
            await db.commit()
        except Exception as exc:
            logger.exception("generation.failed", project_id=project_id)
            project.status = ProjectStatus.FAILED
            db.add(
                GenerationEvent(
                    project_id=project.id,
                    event_type=GenerationEventType.ERROR,
                    message=str(exc),
                    payload={"project_id": project_id},
                )
            )
            await db.commit()
