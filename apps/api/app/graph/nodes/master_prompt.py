"""LangGraph node: master prompt agent."""

from app.graph.runtime import get_runtime
from app.graph.prompts.system import get_prompt_spec
from app.models import ArtifactType, GenerationEvent, GenerationEventType
from app.services.master_prompt_service import generate_master_prompt_bundle, persist_master_prompt_artifact

NODE_SPEC_BASE = get_prompt_spec("master_prompt")


async def master_prompt_node(state, config):
	runtime = get_runtime(config)
	bundle = await generate_master_prompt_bundle(runtime.project, state.get("artifacts", {}))

	async with runtime.db_lock:
		artifact = await persist_master_prompt_artifact(runtime.db, runtime.project, bundle)

		runtime.project.generation_progress = 100
		await runtime.db.flush()
		runtime.db.add(
			GenerationEvent(
				project_id=runtime.project.id,
				artifact_type=ArtifactType.MASTER_PROMPT,
				event_type=GenerationEventType.PROGRESS,
				message=f"{NODE_SPEC_BASE.agent_name} completed",
				payload={
					"progress": 100,
					"artifact_id": str(artifact.id),
					"platforms": len(bundle["prompts"]),
				},
			),
		)
		await runtime.db.commit()

	context = dict(state.get("context", {}) or {})
	context[ArtifactType.MASTER_PROMPT.value.lower()] = str(bundle["content"])

	artifacts = dict(state.get("artifacts", {}) or {})
	artifacts[ArtifactType.MASTER_PROMPT.value] = {
		"type": ArtifactType.MASTER_PROMPT.value,
		"title": str(bundle["title"]),
		"content": str(bundle["content"]),
		"content_format": "markdown",
	}

	return {
		"context": context,
		"artifacts": artifacts,
		"current_artifact": ArtifactType.MASTER_PROMPT,
		"progress": 100,
		"current_output": {
			"title": bundle["title"],
			"content": bundle["content"],
			"structured_content": bundle["structured_content"],
		},
	}
