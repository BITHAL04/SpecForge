"""Platform-specific master prompt templates for SpecForge."""

from __future__ import annotations

from dataclasses import dataclass
from textwrap import dedent
from typing import Mapping

from app.models import ArtifactType


MASTER_PROMPT_SOURCE_ORDER: tuple[ArtifactType, ...] = (
    ArtifactType.PRD,
    ArtifactType.STORIES,
    ArtifactType.HLD,
    ArtifactType.LLD,
    ArtifactType.ERD,
    ArtifactType.API_SPEC,
    ArtifactType.SECURITY,
    ArtifactType.TESTING,
    ArtifactType.DEPLOYMENT,
)


@dataclass(frozen=True, slots=True)
class PlatformPromptProfile:
    platform: str
    title: str
    operating_model: str
    optimization_notes: tuple[str, ...]
    output_requirements: tuple[str, ...]


PLATFORM_PROMPT_PROFILES: tuple[PlatformPromptProfile, ...] = (
    PlatformPromptProfile(
        platform="Cursor",
        title="Cursor Prompt",
        operating_model="Interactive code editor with repo-aware editing",
        optimization_notes=(
            "Work incrementally: inspect nearby files, then make the smallest correct edits.",
            "Prefer concrete file paths, exact code changes, and short verification loops.",
            "Keep implementation choices aligned with the existing repository patterns.",
        ),
        output_requirements=(
            "Start with a brief implementation plan.",
            "List the files to create or modify.",
            "Provide exact code changes and the verification command.",
        ),
    ),
    PlatformPromptProfile(
        platform="Claude Code",
        title="Claude Code Prompt",
        operating_model="Terminal-first autonomous coding assistant",
        optimization_notes=(
            "Use a disciplined plan-edit-verify loop.",
            "Inspect repository context before changing code.",
            "Favor pragmatic changes over broad refactors unless the blueprint requires them.",
        ),
        output_requirements=(
            "Return a concise execution plan before editing.",
            "Show the final changes and any residual risks.",
            "Always include focused tests or checks.",
        ),
    ),
    PlatformPromptProfile(
        platform="GitHub Copilot",
        title="GitHub Copilot Prompt",
        operating_model="In-editor pair programming with concise, actionable guidance",
        optimization_notes=(
            "Keep instructions short, specific, and immediately actionable.",
            "Prefer repository-aware implementation guidance and local code style alignment.",
            "Ask for missing context only when it materially affects correctness.",
        ),
        output_requirements=(
            "Summarize the task in one short paragraph.",
            "Provide a small set of next actions and a focused implementation target.",
            "Include validation guidance for the code you introduce.",
        ),
    ),
    PlatformPromptProfile(
        platform="Windsurf",
        title="Windsurf Prompt",
        operating_model="Agentic coding workflow with plan, execute, and verify phases",
        optimization_notes=(
            "Treat the task as a multi-step engineering workflow.",
            "Preserve existing architecture and add production-safe changes only.",
            "Use the source artifacts to connect requirements to code and tests.",
        ),
        output_requirements=(
            "Return implementation phases in order.",
            "Call out code changes, tests, and follow-up checks.",
            "Close with a concise completion summary.",
        ),
    ),
    PlatformPromptProfile(
        platform="Lovable",
        title="Lovable Prompt",
        operating_model="Full-stack product-to-code generation with strong UX bias",
        optimization_notes=(
            "Optimize for polished user experience, responsive layout, and accessible interactions.",
            "Choose production-ready defaults for UI structure, state management, and API integration.",
            "Balance visual quality with maintainable implementation.",
        ),
        output_requirements=(
            "Describe the product experience and the implementation approach.",
            "Specify UI structure, backend integration, and test coverage.",
            "Include accessibility and responsiveness considerations.",
        ),
    ),
    PlatformPromptProfile(
        platform="Bolt",
        title="Bolt Prompt",
        operating_model="Rapid full-stack scaffolding with strong implementation defaults",
        optimization_notes=(
            "Prefer a complete runnable implementation over abstract guidance.",
            "Use sensible conventions, explicit dependencies, and clear file organization.",
            "Keep the plan oriented toward getting to a working build quickly.",
        ),
        output_requirements=(
            "Provide the build plan, file structure, and implementation steps.",
            "Include tests, scripts, and any environment setup required.",
            "Favor concise but actionable output.",
        ),
    ),
)


def _format_source_artifacts(source_artifacts: Mapping[str, dict[str, object]]) -> str:
    blocks: list[str] = []
    for artifact_type in MASTER_PROMPT_SOURCE_ORDER:
        artifact = source_artifacts.get(artifact_type.value)
        if not artifact:
            blocks.append(
                dedent(
                    f"""
                    ## {artifact_type.value}
                    _Missing source artifact. State explicit assumptions before coding._
                    """
                ).strip()
            )
            continue

        title = str(artifact.get("title") or artifact_type.value)
        content = str(artifact.get("content") or "").strip()
        blocks.append(
            dedent(
                f"""
                ## {artifact_type.value} - {title}
                {content}
                """
            ).strip()
        )
    return "\n\n".join(blocks)


def render_platform_prompt(
    profile: PlatformPromptProfile,
    project_title: str,
    project_idea: str,
    source_artifacts: Mapping[str, dict[str, object]],
) -> str:
    source_block = _format_source_artifacts(source_artifacts)
    optimization_block = "\n".join(f"- {note}" for note in profile.optimization_notes)
    output_block = "\n".join(f"- {item}" for item in profile.output_requirements)

    return dedent(
        f"""
        You are {profile.platform}, generating production-ready code for SpecForge.

        Objective:
        Create a complete, high-confidence implementation that turns the blueprint into working software.

        Project context:
        - Project title: {project_title}
        - Product idea: {project_idea}
        - Operating model: {profile.operating_model}

        Source artifacts:
        {source_block}

        Platform optimization:
        {optimization_block}

        Mandatory engineering standards:
        - Preserve existing architecture and follow local conventions.
        - Make the smallest production-safe changes that satisfy the blueprint.
        - Add or update tests for new behavior.
        - Include security, scalability, and error-handling considerations in the implementation.
        - If information is missing, make the most conservative assumption and state it clearly.

        Output requirements:
        {output_block}

        Deliverable:
        A prompt that can be pasted directly into {profile.platform} to generate production-ready code.
        """
    ).strip()


def build_master_prompt_bundle(
    project_title: str,
    project_idea: str,
    source_artifacts: Mapping[str, dict[str, object]],
) -> dict[str, object]:
    prompts = [
        {
            "platform": profile.platform,
            "title": profile.title,
            "prompt": render_platform_prompt(profile, project_title, project_idea, source_artifacts),
        }
        for profile in PLATFORM_PROMPT_PROFILES
    ]
    missing_sources = [
        artifact_type.value
        for artifact_type in MASTER_PROMPT_SOURCE_ORDER
        if artifact_type.value not in source_artifacts
    ]
    return {
        "title": "Master Prompt Generator",
        "project_title": project_title,
        "project_idea": project_idea,
        "prompts": prompts,
        "missing_sources": missing_sources,
    }


def render_master_prompt_markdown(bundle: Mapping[str, object]) -> str:
    lines: list[str] = ["# Master Prompt Generator", ""]
    if bundle.get("missing_sources"):
        lines.extend(["## Missing Source Artifacts", ""])
        for item in bundle["missing_sources"]:
            lines.append(f"- {item}")
        lines.append("")

    for prompt in bundle.get("prompts", []):
        platform = prompt["platform"]
        title = prompt["title"]
        content = prompt["prompt"]
        lines.extend(
            [
                f"## {platform}",
                "",
                f"### {title}",
                "",
                "```text",
                content,
                "```",
                "",
            ]
        )
    return "\n".join(lines).strip() + "\n"