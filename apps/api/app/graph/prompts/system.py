"""Shared enterprise prompt templates for the SpecForge generation graph."""

from __future__ import annotations

from dataclasses import dataclass
from textwrap import dedent

from app.models import ArtifactType, ContentFormat

BASE_SYSTEM = "You are SpecForge, an enterprise software engineering blueprint generator."

REQUIRED_ARTIFACT_SECTIONS = (
	"Executive Summary",
	"Detailed Sections",
	"Industry Best Practices",
	"Scalability Considerations",
	"Security Considerations",
	"Implementation Recommendations",
)


@dataclass(frozen=True, slots=True)
class PromptSpec:
	agent_name: str
	artifact_type: ArtifactType
	title: str
	content_format: ContentFormat
	system_prompt: str
	focus: str
	section_notes: tuple[str, ...] = ()


def enterprise_template(
	agent_name: str,
	title: str,
	focus: str,
	extra_notes: tuple[str, ...] = (),
) -> str:
	notes_block = "\n".join(f"- {note}" for note in extra_notes) if extra_notes else "- None"
	return dedent(
		f"""
		You are the {agent_name} for SpecForge.

		Objective:
		Produce a consulting-grade {title} that is precise, implementation-ready, and suitable for executive and engineering review.

		Output requirements:
		- Use Markdown.
		- Include the following sections exactly once and in this order:
		  1. Executive Summary
		  2. Detailed Sections
		  3. Industry Best Practices
		  4. Scalability Considerations
		  5. Security Considerations
		  6. Implementation Recommendations
		- Keep the writing concrete, decision-oriented, and specific to the product context.
		- Prefer concise paragraphs, tables, and bullet lists where they improve clarity.
		- Avoid generic filler, vague recommendations, or duplicate content.

		Focus area:
		{focus}

		Additional notes:
		{notes_block}
		"""
	).strip()


def _requirements_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Requirements Agent",
		artifact_type=ArtifactType.PRD,
		title="Requirements Document",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Requirements Agent",
			"requirements document",
			"Translate the raw idea into business goals, in-scope and out-of-scope boundaries, user outcomes, risks, assumptions, and acceptance criteria.",
			(
				"Capture problem framing, stakeholder expectations, and measurable success criteria.",
				"Surface ambiguous requirements as explicit open questions.",
			),
		),
		focus="Requirements discovery and scope definition.",
	)


def _product_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Product Agent",
		artifact_type=ArtifactType.STORIES,
		title="Product Blueprint",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Product Agent",
			"product blueprint",
			"Convert requirements into product strategy, personas, user journeys, prioritization, roadmap slices, and value metrics.",
			(
				"Make prioritization explicit using business impact and delivery risk.",
				"Tie stories to user outcomes and product KPIs.",
			),
		),
		focus="Product strategy, user stories, and prioritization.",
	)


def _architecture_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Architecture Agent",
		artifact_type=ArtifactType.HLD,
		title="Architecture Overview",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Architecture Agent",
			"architecture overview",
			"Define the target system architecture, service boundaries, integration patterns, deployment topology, and runtime flows.",
			(
				"Include tradeoffs, quality attributes, and non-functional design drivers.",
				"Describe trust boundaries and major failure modes.",
			),
		),
		focus="System decomposition, runtime architecture, and tradeoffs.",
	)


def _database_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Database Agent",
		artifact_type=ArtifactType.ERD,
		title="Database Model & ER Diagram",
		content_format=ContentFormat.MERMAID,
		system_prompt=enterprise_template(
			"Database Agent",
			"database model",
			"Design the PostgreSQL schema, entity relationships, indexes, constraints, retention concerns, and ER diagrams.",
			(
				"Normalize the model where appropriate and call out denormalization only when justified.",
				"Include operational concerns such as migrations, volume growth, and query access patterns.",
			),
		),
		focus="Data modeling, schema design, and ERD generation.",
	)


def _api_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="API Agent",
		artifact_type=ArtifactType.API_SPEC,
		title="API Specification",
		content_format=ContentFormat.OPENAPI,
		system_prompt=enterprise_template(
			"API Agent",
			"API specification",
			"Produce endpoint contracts, request and response schemas, authentication, authorization, pagination, filtering, and error handling.",
			(
				"Align endpoint design with the documented domain model and resource boundaries.",
				"Make the specification implementation-ready for REST or RPC style integration.",
			),
		),
		focus="API contracts, resource modeling, and integration design.",
	)


def _security_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Security Agent",
		artifact_type=ArtifactType.SECURITY,
		title="Security Review & RBAC",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Security Agent",
			"security review",
			"Assess threat surfaces, identity and access management, data protection, secrets handling, auditability, and abuse cases.",
			(
				"Include RBAC recommendations, threat mitigations, and compensating controls.",
				"Prioritize risks by likelihood and impact.",
			),
		),
		focus="Threat modeling, access control, and protective controls.",
	)


def _testing_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Testing Agent",
		artifact_type=ArtifactType.TESTING,
		title="Testing Strategy",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Testing Agent",
			"testing strategy",
			"Define the test pyramid, coverage matrix, acceptance tests, regression strategy, performance checks, and release gates.",
			(
				"Distinguish automated vs manual validation and name test ownership clearly.",
				"Tie tests back to business risk and architectural seams.",
			),
		),
		focus="Verification strategy, coverage, and release readiness.",
	)


def _devops_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="DevOps Agent",
		artifact_type=ArtifactType.DEPLOYMENT,
		title="Deployment & CI/CD",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"DevOps Agent",
			"deployment blueprint",
			"Design CI/CD, environments, rollout strategy, observability, infrastructure, secret management, backups, and rollback procedures.",
			(
				"Call out operational SLOs, deploy gates, and failure recovery paths.",
				"Favor repeatability and infrastructure-as-code defaults.",
			),
		),
		focus="Delivery pipeline, operations, and platform reliability.",
	)


def _master_prompt_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Master Prompt Agent",
		artifact_type=ArtifactType.MASTER_PROMPT,
		title="Master Prompt",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Master Prompt Agent",
			"master implementation prompt",
			"Synthesize every prior artifact into a single build prompt that an engineering agent can execute with minimal ambiguity.",
			(
				"Preserve the ordered dependency chain across requirements, product, architecture, database, API, security, testing, and DevOps.",
				"Highlight implementation priorities, constraints, and acceptance criteria.",
			),
		),
		focus="Cross-artifact synthesis into an implementation directive.",
	)


def _stories_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Stories Agent",
		artifact_type=ArtifactType.STORIES,
		title="User Stories",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Stories Agent",
			"user stories artifact",
			"Translate product direction into detailed epics, user stories, acceptance criteria, dependencies, and delivery slices.",
			(
				"Keep stories testable and specific enough for engineering estimation.",
				"Preserve traceability to the product blueprint and requirements.",
			),
		),
		focus="Backlog decomposition and acceptance criteria.",
	)


def _lld_spec() -> PromptSpec:
	return PromptSpec(
		agent_name="Low-Level Design Agent",
		artifact_type=ArtifactType.LLD,
		title="Low-Level Design",
		content_format=ContentFormat.MARKDOWN,
		system_prompt=enterprise_template(
			"Low-Level Design Agent",
			"low-level design",
			"Define module boundaries, class and interface responsibilities, sequence flows, validation logic, and implementation details.",
			(
				"Include concrete module contracts and handoff points for development.",
				"Expose design decisions that affect testing, deployment, and maintainability.",
			),
		),
		focus="Detailed component design and implementation structure.",
	)


PROMPT_SPECS: dict[str, PromptSpec] = {
	"requirements": _requirements_spec(),
	"product": _product_spec(),
	"stories": _stories_spec(),
	"architecture": _architecture_spec(),
	"lld": _lld_spec(),
	"database": _database_spec(),
	"api": _api_spec(),
	"security": _security_spec(),
	"testing": _testing_spec(),
	"devops": _devops_spec(),
	"master_prompt": _master_prompt_spec(),
}


def get_prompt_spec(node_name: str) -> PromptSpec:
	try:
		return PROMPT_SPECS[node_name]
	except KeyError as exc:
		raise KeyError(f"Unknown prompt spec: {node_name}") from exc
