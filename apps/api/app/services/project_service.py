from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenError, NotFoundError
from app.crud import project_crud
from app.models import Project, User
from app.schemas import ProjectCreate, ProjectListResponse, ProjectUpdate


async def list_projects(
    db: AsyncSession, user: User, *, skip: int = 0, limit: int = 50
) -> ProjectListResponse:
    items = await project_crud.get_multi_by_user(db, user.id, skip=skip, limit=limit)
    total = await project_crud.count_by_user(db, user.id)
    return ProjectListResponse(items=items, total=total, skip=skip, limit=limit)


async def create_project(db: AsyncSession, user: User, body: ProjectCreate) -> Project:
    return await project_crud.create(
        db,
        user_id=user.id,
        idea=body.idea,
        title=body.title or "Untitled Project",
        metadata=body.metadata,
    )


async def get_project(db: AsyncSession, project_id: UUID, user: User) -> Project:
    return await get_owned_project(db, project_id, user)


async def update_project(
    db: AsyncSession, project_id: UUID, user: User, body: ProjectUpdate
) -> Project:
    project = await get_owned_project(db, project_id, user)
    if body.title is not None:
        project.title = body.title
    if body.metadata is not None:
        project.metadata_ = body.metadata
    return await project_crud.update(db, project)


async def delete_project(db: AsyncSession, project_id: UUID, user: User) -> None:
    project = await get_owned_project(db, project_id, user)
    await project_crud.delete(db, project)


async def get_owned_project(db: AsyncSession, project_id: UUID, user: User) -> Project:
    project = await project_crud.get_by_id(db, project_id)
    if not project:
        raise NotFoundError("Project")
    if project.user_id != user.id:
        raise ForbiddenError()
    return project
