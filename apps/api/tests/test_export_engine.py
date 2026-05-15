import io
import zipfile

import pytest
from httpx import AsyncClient


async def _seed_exports(client: AsyncClient, headers: dict[str, str], project_id: str) -> None:
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=headers,
        json={"title": "Requirements Document", "content": "# Requirements\n\nCore scope.", "is_generated": True},
    )
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/STORIES",
        headers=headers,
        json={"title": "Product Blueprint", "content": "# Product\n\nUser stories.", "is_generated": True},
    )
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/API_SPEC",
        headers=headers,
        json={
            "title": "API Specification",
            "content": "openapi: 3.1.0\ninfo:\n  title: SpecForge API\n  version: 1.0.0\npaths: {}\n",
            "content_format": "openapi",
            "is_generated": True,
        },
    )


@pytest.mark.asyncio
async def test_export_zip_contains_requested_files(client: AsyncClient, auth_headers: dict, project_id: str):
    await _seed_exports(client, auth_headers, project_id)

    response = await client.get(f"/api/v1/projects/{project_id}/export?format=zip", headers=auth_headers)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/zip")
    assert "Untitled-Project.zip" in response.headers["content-disposition"]

    archive = zipfile.ZipFile(io.BytesIO(response.content))
    assert archive.namelist() == [
        "PRD.md",
        "Stories.md",
        "HLD.md",
        "LLD.md",
        "ERD.md",
        "API.yaml",
        "Security.md",
        "Testing.md",
        "Deployment.md",
        "MasterPrompt.md",
    ]
    assert "Core scope." in archive.read("PRD.md").decode("utf-8")


@pytest.mark.asyncio
async def test_export_markdown_merges_artifacts(client: AsyncClient, auth_headers: dict, project_id: str):
    await _seed_exports(client, auth_headers, project_id)

    response = await client.get(f"/api/v1/projects/{project_id}/export?format=markdown", headers=auth_headers)
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/markdown")
    body = response.text
    assert "# Untitled Project" in body
    assert "## PRD" in body
    assert "## API" in body
    assert "openapi: 3.1.0" in body


@pytest.mark.asyncio
async def test_export_pdf_returns_pdf_bytes(client: AsyncClient, auth_headers: dict, project_id: str):
    await _seed_exports(client, auth_headers, project_id)

    response = await client.get(f"/api/v1/projects/{project_id}/export?format=pdf", headers=auth_headers)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF")