from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Artifact, ArtifactType


class CRUDArtifact:
    async def get_by_type(
        self, db: AsyncSession, project_id: UUID, artifact_type: ArtifactType
    ) -> Artifact | None:
        result = await db.execute(
            select(Artifact).where(
                Artifact.project_id == project_id,
                Artifact.type == artifact_type,
            )
        )
        return result.scalar_one_or_none()

    async def get_multi_by_project(self, db: AsyncSession, project_id: UUID) -> list[Artifact]:
        result = await db.execute(
            select(Artifact)
            .where(Artifact.project_id == project_id)
            .order_by(Artifact.created_at.asc())
        )
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, artifact: Artifact) -> Artifact:
        db.add(artifact)
        await db.flush()
        await db.refresh(artifact)
        return artifact

    async def update(self, db: AsyncSession, artifact: Artifact) -> Artifact:
        await db.flush()
        await db.refresh(artifact)
        return artifact

    async def delete(self, db: AsyncSession, artifact: Artifact) -> None:
        await db.delete(artifact)


artifact_crud = CRUDArtifact()
