from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Project


class CRUDProject:
    async def get_by_id(self, db: AsyncSession, project_id: UUID) -> Project | None:
        result = await db.execute(select(Project).where(Project.id == project_id))
        return result.scalar_one_or_none()

    async def get_multi_by_user(
        self,
        db: AsyncSession,
        user_id: UUID,
        *,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Project]:
        result = await db.execute(
            select(Project)
            .where(Project.user_id == user_id)
            .order_by(Project.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def count_by_user(self, db: AsyncSession, user_id: UUID) -> int:
        result = await db.execute(
            select(func.count()).select_from(Project).where(Project.user_id == user_id)
        )
        return result.scalar_one()

    async def create(
        self,
        db: AsyncSession,
        *,
        user_id: UUID,
        idea: str,
        title: str,
        metadata: dict | None = None,
    ) -> Project:
        project = Project(user_id=user_id, idea=idea, title=title, metadata_=metadata)
        db.add(project)
        await db.flush()
        await db.refresh(project)
        return project

    async def update(self, db: AsyncSession, project: Project) -> Project:
        await db.flush()
        await db.refresh(project)
        return project

    async def delete(self, db: AsyncSession, project: Project) -> None:
        await db.delete(project)


project_crud = CRUDProject()
