import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"idea": "Build a task management app like Notion", "title": "TaskApp"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "TaskApp"
    assert data["idea"] == "Build a task management app like Notion"
    assert data["status"] == "draft"
    assert data["generation_progress"] == 0


@pytest.mark.asyncio
async def test_create_project_idea_too_short(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/projects",
        headers=auth_headers,
        json={"idea": "short"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_projects(client: AsyncClient, auth_headers: dict, project_id: str):
    response = await client.get("/api/v1/projects", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    projects = data["items"]
    assert data["total"] >= 1
    assert len(projects) >= 1
    assert any(p["id"] == project_id for p in projects)


@pytest.mark.asyncio
async def test_get_project(client: AsyncClient, auth_headers: dict, project_id: str):
    response = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == project_id


@pytest.mark.asyncio
async def test_update_project(client: AsyncClient, auth_headers: dict, project_id: str):
    response = await client.patch(
        f"/api/v1/projects/{project_id}",
        headers=auth_headers,
        json={"title": "Updated Title"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient, auth_headers: dict, project_id: str):
    response = await client.delete(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/projects/{project_id}", headers=auth_headers)
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_cross_user_access_forbidden(
    client: AsyncClient, auth_headers: dict, second_user_headers: dict, project_id: str
):
    response = await client.get(f"/api/v1/projects/{project_id}", headers=second_user_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_project_not_found(client: AsyncClient, auth_headers: dict):
    response = await client.get(
        "/api/v1/projects/00000000-0000-0000-0000-000000000099",
        headers=auth_headers,
    )
    assert response.status_code == 404
