"""LangGraph node: security agent."""

from app.graph.prompts.system import get_prompt_spec
from app.graph.runtime import ArtifactNodeSpec, execute_generation_node

NODE_SPEC_BASE = get_prompt_spec("security")

NODE_SPEC = ArtifactNodeSpec(
	node_name="security",
	agent_name=NODE_SPEC_BASE.agent_name,
	artifact_type=NODE_SPEC_BASE.artifact_type,
	title=NODE_SPEC_BASE.title,
	system_prompt=NODE_SPEC_BASE.system_prompt,
	content_format=NODE_SPEC_BASE.content_format,
	step_index=6,
	total_steps=9,
	prompt_template=NODE_SPEC_BASE.system_prompt,
)


async def security_node(state, config):
	return await execute_generation_node(state, config, NODE_SPEC)
