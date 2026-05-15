"""LangGraph node: requirements agent."""

from app.graph.prompts.system import get_prompt_spec
from app.graph.runtime import ArtifactNodeSpec, execute_generation_node

NODE_SPEC_BASE = get_prompt_spec("requirements")

NODE_SPEC = ArtifactNodeSpec(
	node_name="requirements",
	agent_name=NODE_SPEC_BASE.agent_name,
	artifact_type=NODE_SPEC_BASE.artifact_type,
	title=NODE_SPEC_BASE.title,
	system_prompt=NODE_SPEC_BASE.system_prompt,
	content_format=NODE_SPEC_BASE.content_format,
	step_index=1,
	total_steps=10,
	prompt_template=NODE_SPEC_BASE.system_prompt,
)


async def requirements_node(state, config):
	return await execute_generation_node(state, config, NODE_SPEC)
