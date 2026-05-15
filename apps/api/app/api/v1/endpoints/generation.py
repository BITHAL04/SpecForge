import asyncio
import json
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_current_user_sse
from app.db.session import AsyncSessionLocal, get_db
from app.models import Artifact, GenerationEvent, GenerationEventType, Project, ProjectStatus, User
from app.schemas import GenerationEventResponse, MasterPromptResponse
from app.services import project_service
from app.services.generation_service import run_generation
from app.services.master_prompt_service import generate_master_prompt_bundle, persist_master_prompt_artifact

router = APIRouter()


@router.post("/{project_id}/generate", status_code=202)
async def start_generation(
    project_id: UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.get_owned_project(db, project_id, current_user)
    if project.status == ProjectStatus.GENERATING:
        return {"message": "Generation already in progress", "project_id": str(project_id)}

    project.status = ProjectStatus.GENERATING
    project.generation_progress = 0
    await db.flush()
    await db.commit()
    background_tasks.add_task(run_generation, str(project_id))
    return {"message": "Generation started", "project_id": str(project_id)}


@router.get("/{project_id}/generate/stream")
async def stream_generation(
    project_id: UUID,
    current_user: User = Depends(get_current_user_sse),
    db: AsyncSession = Depends(get_db),
):
    await project_service.get_owned_project(db, project_id, current_user)

    async def event_generator():
        sent_ids: set[UUID] = set()
        while True:
            async with AsyncSessionLocal() as session:
                project_result = await session.execute(select(Project).where(Project.id == project_id))
                project = project_result.scalar_one_or_none()
                if project is None:
                    return

                result = await session.execute(
                    select(GenerationEvent)
                    .where(GenerationEvent.project_id == project_id)
                    .order_by(GenerationEvent.created_at.asc())
                )
                events = result.scalars().all()

            for event in events:
                if event.id in sent_ids:
                    continue
                sent_ids.add(event.id)
                data = GenerationEventResponse.model_validate(event).model_dump_json()
                yield f"event: generation\ndata: {data}\n\n"

                if event.event_type in (GenerationEventType.COMPLETED, GenerationEventType.ERROR):
                    return

            if project.status in (ProjectStatus.COMPLETED, ProjectStatus.FAILED):
                return

            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/{project_id}/events", response_model=list[GenerationEventResponse])
async def list_events(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await project_service.get_owned_project(db, project_id, current_user)
    result = await db.execute(
        select(GenerationEvent)
        .where(GenerationEvent.project_id == project_id)
        .order_by(GenerationEvent.created_at.asc())
    )
    return result.scalars().all()


@router.post("/{project_id}/master-prompt", response_model=MasterPromptResponse)
async def generate_master_prompt(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = await project_service.get_owned_project(db, project_id, current_user)
    result = await db.execute(
        select(Artifact).where(Artifact.project_id == project_id).order_by(Artifact.created_at.asc())
    )
    artifacts = list(result.scalars().all())

    bundle = await generate_master_prompt_bundle(project, artifacts)
    artifact = await persist_master_prompt_artifact(db, project, bundle)
    await db.commit()

    return MasterPromptResponse(
        project_id=project.id,
        artifact_id=artifact.id,
        title=str(bundle["title"]),
        content=str(bundle["content"]),
        prompts=list(bundle["prompts"]),
        missing_sources=list(bundle["missing_sources"]),
        structured_content=bundle["structured_content"],
    )
