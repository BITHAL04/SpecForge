from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import ArtifactType, User
from app.schemas import ArtifactResponse, ArtifactUpdate, ArtifactUpsert, ArtifactRegenerateRequest
from app.services import artifact_service

router = APIRouter()


@router.get("/{project_id}/artifacts", response_model=list[ArtifactResponse], summary="List project artifacts")
async def list_artifacts(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await artifact_service.list_artifacts(db, project_id, current_user)


@router.get(
    "/{project_id}/artifacts/{artifact_type}",
    response_model=ArtifactResponse,
    summary="Get artifact by type",
)
async def get_artifact(
    project_id: UUID,
    artifact_type: ArtifactType,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await artifact_service.get_artifact(db, project_id, artifact_type, current_user)


@router.put(
    "/{project_id}/artifacts/{artifact_type}",
    response_model=ArtifactResponse,
    summary="Create or replace artifact",
)
async def upsert_artifact(
    project_id: UUID,
    artifact_type: ArtifactType,
    body: ArtifactUpsert,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await artifact_service.upsert_artifact(
        db, project_id, artifact_type, current_user, body
    )


@router.patch(
    "/{project_id}/artifacts/{artifact_type}",
    response_model=ArtifactResponse,
    summary="Partially update artifact",
)
async def update_artifact(
    project_id: UUID,
    artifact_type: ArtifactType,
    body: ArtifactUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await artifact_service.update_artifact(
        db, project_id, artifact_type, current_user, body
    )


@router.delete(
    "/{project_id}/artifacts/{artifact_type}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete artifact",
)
async def delete_artifact(
    project_id: UUID,
    artifact_type: ArtifactType,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await artifact_service.delete_artifact(db, project_id, artifact_type, current_user)


@router.post(
    "/{project_id}/artifacts/{artifact_type}/regenerate",
    response_model=ArtifactResponse,
    summary="Regenerate a specific artifact with feedback",
)
async def regenerate_artifact(
    project_id: UUID,
    artifact_type: ArtifactType,
    body: ArtifactRegenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await artifact_service.regenerate_artifact(
        db, project_id, artifact_type, current_user, body.feedback
    )
