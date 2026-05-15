import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_upsert_artifact_create(client: AsyncClient, auth_headers: dict, project_id: str):
    response = await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={
            "title": "Product Requirements",
            "content": "# PRD\n\nBuild an Airbnb clone.",
            "is_generated": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "PRD"
    assert data["title"] == "Product Requirements"
    assert data["version"] == 1
    assert "Airbnb" in data["content"]


@pytest.mark.asyncio
async def test_upsert_artifact_update(client: AsyncClient, auth_headers: dict, project_id: str):
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={"title": "PRD v1", "content": "Initial content"},
    )
    response = await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={"title": "PRD v2", "content": "Updated content"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "PRD v2"
    assert data["version"] == 2


@pytest.mark.asyncio
async def test_list_artifacts(client: AsyncClient, auth_headers: dict, project_id: str):
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={"title": "PRD", "content": "Content"},
    )
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/HLD",
        headers=auth_headers,
        json={"title": "HLD", "content": "Architecture"},
    )

    response = await client.get(f"/api/v1/projects/{project_id}/artifacts", headers=auth_headers)
    assert response.status_code == 200
    artifacts = response.json()
    assert len(artifacts) == 2
    types = {a["type"] for a in artifacts}
    assert types == {"PRD", "HLD"}


@pytest.mark.asyncio
async def test_get_artifact(client: AsyncClient, auth_headers: dict, project_id: str):
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/STORIES",
        headers=auth_headers,
        json={"title": "User Stories", "content": "As a user..."},
    )
    response = await client.get(
        f"/api/v1/projects/{project_id}/artifacts/STORIES",
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["type"] == "STORIES"


@pytest.mark.asyncio
async def test_get_artifact_not_found(client: AsyncClient, auth_headers: dict, project_id: str):
    response = await client.get(
        f"/api/v1/projects/{project_id}/artifacts/LLD",
        headers=auth_headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_patch_artifact(client: AsyncClient, auth_headers: dict, project_id: str):
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={"title": "PRD", "content": "Original"},
    )
    response = await client.patch(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={"content": "Patched content"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Patched content"
    assert data["version"] == 2
    assert data["is_generated"] is False


@pytest.mark.asyncio
async def test_delete_artifact(client: AsyncClient, auth_headers: dict, project_id: str):
    await client.put(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
        json={"title": "PRD", "content": "To be deleted"},
    )
    response = await client.delete(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
    )
    assert response.status_code == 204

    get_response = await client.get(
        f"/api/v1/projects/{project_id}/artifacts/PRD",
        headers=auth_headers,
    )
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_cross_user_artifact_access_forbidden(
    client: AsyncClient, auth_headers: dict, second_user_headers: dict, project_id: str
):
    response = await client.get(
        f"/api/v1/projects/{project_id}/artifacts",
        headers=second_user_headers,
    )
    assert response.status_code == 403
