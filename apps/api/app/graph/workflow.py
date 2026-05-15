"""LangGraph workflow definition for the SpecForge generation pipeline."""

from langgraph.graph import END, StateGraph

from app.graph.nodes.analyze import requirements_node
from app.graph.nodes.api_spec import api_node
from app.graph.nodes.deployment import devops_node
from app.graph.nodes.erd import database_node
from app.graph.nodes.hld import architecture_node
from app.graph.nodes.lld import lld_node
from app.graph.nodes.master_prompt import master_prompt_node
from app.graph.nodes.security import security_node
from app.graph.nodes.stories import stories_node
from app.graph.nodes.testing import testing_node
from app.graph.state import GenerationState

PARALLEL_NODES = (
    "stories",
    "architecture",
    "lld",
    "database",
    "api",
    "security",
    "testing",
    "devops",
)


def build_workflow():
    graph = StateGraph(GenerationState)

    graph.add_node("requirements", requirements_node)
    graph.add_node("stories", stories_node)
    graph.add_node("architecture", architecture_node)
    graph.add_node("lld", lld_node)
    graph.add_node("database", database_node)
    graph.add_node("api", api_node)
    graph.add_node("security", security_node)
    graph.add_node("testing", testing_node)
    graph.add_node("devops", devops_node)
    graph.add_node("master_prompt", master_prompt_node)

    graph.set_entry_point("requirements")

    for node_name in PARALLEL_NODES:
        graph.add_edge("requirements", node_name)
        graph.add_edge(node_name, "master_prompt")

    graph.add_edge("master_prompt", END)
    return graph.compile()
