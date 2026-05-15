from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models import ProjectStatus


class ProjectCreate(BaseModel):
    idea: str = Field(min_length=10, max_length=10000)
    title: str | None = Field(default=None, max_length=255)
    metadata: dict | None = None


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    metadata: dict | None = None


class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    idea: str
    status: ProjectStatus
    generation_progress: int
    metadata: dict | None = Field(default=None, validation_alias="metadata_")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}


class ProjectListResponse(BaseModel):
    items: list[ProjectResponse]
    total: int
    skip: int
    limit: int
