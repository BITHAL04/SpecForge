from uuid import UUID

import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.core.exceptions import NotFoundError
from app.crud import artifact_crud
from app.models import Artifact, ArtifactType, User, ContentFormat
from app.schemas import ArtifactUpdate, ArtifactUpsert
from app.services.project_service import get_owned_project
from app.llm.client import LLMClient
from app.graph.prompts.system import get_prompt_spec, BASE_SYSTEM
from app.graph.runtime import _output_instructions

logger = structlog.get_logger()


def _serialize_structured(content: ArtifactUpsert | ArtifactUpdate) -> dict | None:
    sc = content.structured_content
    if sc is None:
        return None
    return sc.model_dump() if hasattr(sc, "model_dump") else sc


async def list_artifacts(db: AsyncSession, project_id: UUID, user: User) -> list[Artifact]:
    await get_owned_project(db, project_id, user)
    return await artifact_crud.get_multi_by_project(db, project_id)


async def get_artifact(
    db: AsyncSession, project_id: UUID, artifact_type: ArtifactType, user: User
) -> Artifact:
    await get_owned_project(db, project_id, user)
    artifact = await artifact_crud.get_by_type(db, project_id, artifact_type)
    if not artifact:
        raise NotFoundError("Artifact")
    return artifact


async def upsert_artifact(
    db: AsyncSession,
    project_id: UUID,
    artifact_type: ArtifactType,
    user: User,
    body: ArtifactUpsert,
) -> Artifact:
    await get_owned_project(db, project_id, user)
    artifact = await artifact_crud.get_by_type(db, project_id, artifact_type)
    structured = _serialize_structured(body)

    if artifact:
        artifact.title = body.title
        artifact.content = body.content
        artifact.structured_content = structured
        artifact.content_format = body.content_format
        artifact.is_generated = body.is_generated
        artifact.version += 1
        return await artifact_crud.update(db, artifact)

    new_artifact = Artifact(
        project_id=project_id,
        type=artifact_type,
        title=body.title,
        content=body.content,
        structured_content=structured,
        content_format=body.content_format,
        is_generated=body.is_generated,
    )
    return await artifact_crud.create(db, new_artifact)


async def update_artifact(
    db: AsyncSession,
    project_id: UUID,
    artifact_type: ArtifactType,
    user: User,
    body: ArtifactUpdate,
) -> Artifact:
    artifact = await get_artifact(db, project_id, artifact_type, user)

    if body.title is not None:
        artifact.title = body.title
    if body.content is not None:
        artifact.content = body.content
    if body.structured_content is not None:
        artifact.structured_content = _serialize_structured(body)

    artifact.version += 1
    artifact.is_generated = False
    return await artifact_crud.update(db, artifact)


async def delete_artifact(
    db: AsyncSession, project_id: UUID, artifact_type: ArtifactType, user: User
) -> None:
    artifact = await get_artifact(db, project_id, artifact_type, user)
    await artifact_crud.delete(db, artifact)


def _get_mock_regenerated_content(current_content: str, content_format: ContentFormat, feedback: str) -> str:
    feedback_clean = feedback.strip().replace("\n", " ")
    if content_format == ContentFormat.MERMAID:
        return current_content + f"\n\n%% Applied feedback: {feedback_clean}\n"
    elif content_format == ContentFormat.OPENAPI or content_format == ContentFormat.JSON:
        if current_content.strip().startswith("openapi:"):
            return current_content + f"\n# Applied feedback: {feedback_clean}\n"
        else:
            return current_content + f"\n/* Applied feedback: {feedback_clean} */\n"
    else:
        return current_content + f"\n\n---\n*Regenerated: Applied user feedback - \"{feedback_clean}\"*\n"


async def regenerate_artifact(
    db: AsyncSession,
    project_id: UUID,
    artifact_type: ArtifactType,
    user: User,
    feedback: str | None = None,
) -> Artifact:
    logger.info("artifact.regenerate", project_id=str(project_id), artifact_type=artifact_type.value)
    # 1. Get owned project
    project = await get_owned_project(db, project_id, user)
    
    # 2. Get existing artifact
    artifact = await artifact_crud.get_by_type(db, project_id, artifact_type)
    if not artifact:
        raise NotFoundError("Artifact")
        
    # 3. Retrieve all other artifacts for this project
    all_artifacts = await artifact_crud.get_multi_by_project(db, project_id)
    
    # Map them for context, excluding the one we are regenerating
    other_artifacts_dict = {}
    for a in all_artifacts:
        if a.type != artifact_type:
            other_artifacts_dict[a.type.value] = {
                "title": a.title,
                "content": a.content,
            }
            
    # Format the other artifacts for the previous context block
    context_lines = []
    for type_val, data in other_artifacts_dict.items():
        title = data.get("title", type_val)
        summary = " ".join(str(data.get("content", "")).split())
        if len(summary) > 220:
            summary = f"{summary[:217]}..."
        context_lines.append(f"- {type_val}: {title}\n  {summary}")
    previous_context = "\n".join(context_lines) if context_lines else "None yet."
    
    # 4. Lookup the prompt specification
    TYPE_TO_NODE_NAME = {
        ArtifactType.PRD: "requirements",
        ArtifactType.STORIES: "product",
        ArtifactType.HLD: "architecture",
        ArtifactType.LLD: "lld",
        ArtifactType.ERD: "database",
        ArtifactType.API_SPEC: "api",
        ArtifactType.SECURITY: "security",
        ArtifactType.TESTING: "testing",
        ArtifactType.DEPLOYMENT: "devops",
        ArtifactType.MASTER_PROMPT: "master_prompt",
    }
    
    node_name = TYPE_TO_NODE_NAME.get(artifact_type, "requirements")
    prompt_spec = get_prompt_spec(node_name)
    
    # 5. Construct prompts
    system_prompt = (
        f"{BASE_SYSTEM}\n\n"
        f"{prompt_spec.system_prompt}\n\n"
        "CRITICAL: You are updating/regenerating an existing artifact based on user feedback. "
        "Do NOT generate a brand new document from scratch unless requested. "
        "Carefully modify the current artifact content to address the user's feedback, "
        "while preserving all other existing structures, sections, details, and context. "
        "Maintain the exact format requirements requested."
    )
    
    clean_feedback = feedback or "Regenerate to improve clarity, detail, and correctness."
    output_instr = _output_instructions(prompt_spec.content_format)
    
    user_prompt = (
        f"Project Idea: {project.idea}\n\n"
        f"Current Project Title: {project.title}\n\n"
        f"Previous Context (Other Artifacts):\n{previous_context}\n\n"
        f"Current '{prompt_spec.title}' Content:\n\"\"\"\n{artifact.content}\n\"\"\"\n\n"
        f"User Feedback for Regeneration:\n\"\"\"\n{clean_feedback}\n\"\"\"\n\n"
        f"Please regenerate and update the '{prompt_spec.title}' artifact incorporating the feedback. "
        f"Ensure the output conforms to: {output_instr}\n"
        "Ground the output in the accumulated product context and keep it implementation-ready."
    )
    
    # 6. Generate content via LLM or fallback
    from app.llm.client import has_valid_key
    new_content = ""
    if has_valid_key():
        try:
            llm = LLMClient()
            new_content = await llm.generate(system_prompt, user_prompt)
        except Exception as exc:
            logger.warning("regeneration.llm_fallback", error=str(exc))
            new_content = _get_mock_regenerated_content(artifact.content, prompt_spec.content_format, clean_feedback)
    else:
        new_content = _get_mock_regenerated_content(artifact.content, prompt_spec.content_format, clean_feedback)
        
    # 7. Update artifact in database
    artifact.content = new_content
    artifact.version += 1
    artifact.is_generated = True
    
    if artifact.structured_content is None:
         artifact.structured_content = {}
    artifact.structured_content["regenerated_with_feedback"] = clean_feedback
    
    return await artifact_crud.update(db, artifact)
