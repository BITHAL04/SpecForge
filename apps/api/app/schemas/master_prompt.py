from uuid import UUID

from pydantic import BaseModel


class MasterPromptItem(BaseModel):
    platform: str
    title: str
    prompt: str


class MasterPromptResponse(BaseModel):
    project_id: UUID
    artifact_id: UUID | None = None
    title: str
    content: str
    prompts: list[MasterPromptItem]
    missing_sources: list[str] = []
    structured_content: dict | None = None

    model_config = {"from_attributes": True}