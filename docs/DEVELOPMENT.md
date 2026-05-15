# SpecForge — Development Workflow

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |
| Python | ≥ 3.12 |
| uv | latest |
| Docker | latest |

## First-Time Setup

```powershell
# 1. Clone and enter repo
cd SpecForge

# 2. Start PostgreSQL
docker compose -f docker/docker-compose.yml up -d

# 3. Environment files
cp .env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
# Edit apps/api/.env — set OPENAI_API_KEY and JWT_SECRET

# 4. Install dependencies
pnpm install
cd apps/api && uv sync && alembic upgrade head && cd ../..

# 5. Start dev servers (two terminals)
pnpm dev:api    # http://localhost:8000
pnpm dev:web    # http://localhost:3000
```

Or use the bootstrap script:

```powershell
.\scripts\dev.ps1
```

## Daily Development

```powershell
# Terminal 1 — API with hot reload
pnpm dev:api

# Terminal 2 — Frontend with hot reload
pnpm dev:web

# API docs
# http://localhost:8000/docs
```

## Database

```powershell
# Reset database
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
cd apps/api && alembic upgrade head

# Create new migration
cd apps/api
alembic revision --autogenerate -m "add_column_x"
alembic upgrade head
```

## Testing

```powershell
# Backend
cd apps/api && uv run pytest

# Frontend typecheck
pnpm typecheck
```

## Docker (Full Stack)

```powershell
# Production-like local stack
docker compose -f docker/docker-compose.prod.yml up --build
```

## Deployment

### Vercel (Frontend)

1. Connect GitHub repo to Vercel
2. Set root directory: `apps/web` (or use root `vercel.json`)
3. Environment: `NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1`
4. Deploy
5. Optional monitoring: set `NEXT_PUBLIC_SENTRY_DSN` if the frontend is wired to Sentry

### Railway (Backend + PostgreSQL)

1. Create Railway project
2. Add PostgreSQL plugin → copy `DATABASE_URL` (convert to `postgresql+asyncpg://`)
3. Deploy from `docker/Dockerfile.api` or use `railway.json`
4. Set env vars: `JWT_SECRET`, `OPENAI_API_KEY`, `CORS_ORIGINS`, `LOG_LEVEL`, `SENTRY_DSN`, `RATE_LIMIT_ENABLED`, `RATE_LIMIT_REQUESTS`, `RATE_LIMIT_WINDOW_SECONDS`
5. Health check: `/health`

### GitHub Actions (Production)

1. Set repository secrets:
	- `RAILWAY_DEPLOY_HOOK_URL`
	- `VERCEL_DEPLOY_HOOK_URL`
2. Push to `main` or run the `Deploy` workflow manually.
3. The workflow runs tests, builds the frontend, then triggers the deployment hooks.

## Project Structure Quick Reference

| Path | Purpose |
|------|---------|
| `apps/web/app/` | Next.js routes |
| `apps/web/components/` | React components |
| `apps/web/lib/` | API client, hooks, stores |
| `apps/api/app/api/` | FastAPI routes |
| `apps/api/app/models/` | SQLAlchemy models |
| `apps/api/app/graph/` | LangGraph pipeline |
| `packages/shared/` | Shared TypeScript types |

## Common Issues

| Issue | Fix |
|-------|-----|
| DB connection refused | `docker compose -f docker/docker-compose.yml up -d` |
| CORS error | Check `CORS_ORIGINS` in `apps/api/.env` |
| Alembic enum error | Drop DB volume and re-run migrations |
| pnpm workspace error | Run `pnpm install` from repo root |
