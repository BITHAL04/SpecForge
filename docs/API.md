# SpecForge — API Architecture

Base URL: `/api/v1`

## Authentication

All protected endpoints require `Authorization: Bearer <access_token>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create account → JWT |
| POST | `/auth/login` | No | Login → JWT |
| POST | `/auth/refresh` | No | Refresh access token |
| GET | `/auth/me` | Yes | Current user profile |

## Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List projects (paginated: `?skip=0&limit=50`) |
| POST | `/projects` | Create project `{ idea, title?, metadata? }` |
| GET | `/projects/{id}` | Get project detail |
| PATCH | `/projects/{id}` | Update `{ title?, metadata? }` |
| DELETE | `/projects/{id}` | Delete project + artifacts |

## Artifacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/{id}/artifacts` | List all artifacts |
| GET | `/projects/{id}/artifacts/{type}` | Get single artifact by type |
| PUT | `/projects/{id}/artifacts/{type}` | Upsert artifact (create or replace) |
| PATCH | `/projects/{id}/artifacts/{type}` | Partial update artifact content |
| DELETE | `/projects/{id}/artifacts/{type}` | Delete artifact |

**Artifact types:** `PRD`, `STORIES`, `HLD`, `LLD`, `ERD`, `API_SPEC`, `SECURITY`, `TESTING`, `DEPLOYMENT`, `MASTER_PROMPT`

## Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects/{id}/generate` | Start LangGraph pipeline (202) |
| GET | `/projects/{id}/generate/stream` | SSE real-time events |
| GET | `/projects/{id}/events` | Paginated event history |

### SSE Format

```
event: generation
data: {"id":"...","event_type":"progress","message":"Generating HLD...","artifact_type":"HLD"}
```

## Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects/{id}/export` | Download ZIP of all artifacts |

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |

## Error Responses

```json
{ "detail": "Error message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 401 | Invalid/missing token |
| 403 | Access denied (wrong user) |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 422 | Request validation failed |

## OpenAPI

Interactive docs available at `/docs` (non-production).
