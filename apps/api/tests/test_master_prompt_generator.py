import pytest
from httpx import AsyncClient


async def _seed_master_prompt_sources(client: AsyncClient, headers: dict[str, str], project_id: str) -> None:
    artifacts = [
        ("PRD", {"title": "PRD", "content": "# PRD\n\nBuild a resilient collaboration platform."}),
        ("STORIES", {"title": "Stories", "content": "# Stories\n\nAs a user, I can collaborate in real time."}),
        ("HLD", {"title": "HLD", "content": "# HLD\n\nService-oriented architecture with async processing."}),
        ("LLD", {"title": "LLD", "content": "# LLD\n\nModule boundaries and API contracts."}),
        (
            "ERD",
            {
                "title": "ERD",
                "content": "erDiagram\n  PROJECTS ||--o{ ARTIFACTS : contains\n",
                "content_format": "mermaid",
            },
        ),
        (
            "API_SPEC",
            {
                "title": "API Specification",
                "content": "openapi: 3.1.0\ninfo:\n  title: SpecForge API\n  version: 1.0.0\npaths: {}\n",
                "content_format": "openapi",
            },
        ),
        ("SECURITY", {"title": "Security", "content": "# Security\n\nThreat model and access control."}),
        ("TESTING", {"title": "Testing", "content": "# Testing\n\nAutomation and release gates."}),
        ("DEPLOYMENT", {"title": "Deployment", "content": "# Deployment\n\nCI/CD and rollout strategy."}),
    ]

    for artifact_type, body in artifacts:
        response = await client.put(f"/api/v1/projects/{project_id}/artifacts/{artifact_type}", headers=headers, json=body)
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_generate_master_prompt_bundle(client: AsyncClient, auth_headers: dict, project_id: str):
    await _seed_master_prompt_sources(client, auth_headers, project_id)

    response = await client.post(f"/api/v1/projects/{project_id}/master-prompt", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["missing_sources"] == []
    assert len(data["prompts"]) == 6
    assert {item["platform"] for item in data["prompts"]} == {
        "Cursor",
        "Claude Code",
        "GitHub Copilot",
        "Windsurf",
        "Lovable",
        "Bolt",
    }
    assert "Cursor Prompt" in data["content"]
    assert "Claude Code Prompt" in data["content"]

    artifact_response = await client.get(
        f"/api/v1/projects/{project_id}/artifacts/MASTER_PROMPT",
        headers=auth_headers,
    )
    assert artifact_response.status_code == 200
    artifact = artifact_response.json()
    assert artifact["type"] == "MASTER_PROMPT"
    assert "Bolt Prompt" in artifact["content"]