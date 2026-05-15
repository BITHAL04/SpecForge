from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models import ArtifactType, ContentFormat, GenerationEventType


class ArtifactSection(BaseModel):
    id: str
    title: str
    content: str
    format: ContentFormat = ContentFormat.MARKDOWN


class StructuredContent(BaseModel):
    sections: list[ArtifactSection] = []
    metadata: dict | None = None


class ArtifactResponse(BaseModel):
    id: UUID
    project_id: UUID
    type: ArtifactType
    title: str
    content: str
    structured_content: StructuredContent | dict | None = None
    content_format: ContentFormat
    version: int
    is_generated: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ArtifactUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    content: str | None = None
    structured_content: StructuredContent | dict | None = None


class ArtifactUpsert(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = ""
    structured_content: StructuredContent | dict | None = None
    content_format: ContentFormat = ContentFormat.MARKDOWN
    is_generated: bool = False


class ArtifactRegenerateRequest(BaseModel):
    feedback: str | None = None



class GenerationEventResponse(BaseModel):
    id: UUID
    project_id: UUID
    artifact_type: ArtifactType | None
    event_type: GenerationEventType
    message: str
    payload: dict | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
