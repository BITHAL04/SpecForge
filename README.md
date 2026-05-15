# SpecForge

**Transform a product idea into a complete enterprise software engineering blueprint.**

SpecForge is a production SaaS platform that takes a simple product idea (e.g., "Build an Airbnb clone") and generates a full suite of engineering artifacts — from PRD and user stories through architecture, security, testing, deployment, and an AI-ready master prompt.

## What It Generates

| # | Artifact | Stored As |
|---|----------|-----------|
| 1 | Product Requirements Document (PRD) | `PRD` |
| 2 | User Personas | `PRD` (section) |
| 3 | User Stories | `STORIES` |
| 4 | Acceptance Criteria | `STORIES` (section) |
| 5 | High Level Design (HLD) | `HLD` |
| 6 | Low Level Design (LLD) | `LLD` |
| 7 | Architecture Diagrams | `HLD` (Mermaid) |
| 8 | Database Schema | `ERD` |
| 9 | ER Diagrams | `ERD` (Mermaid) |
| 10 | API Specifications | `API_SPEC` |
| 11 | Security Audit | `SECURITY` |
| 12 | Threat Model | `SECURITY` (section) |
| 13 | RBAC Design | `SECURITY` (section) |
| 14 | Testing Strategy | `TESTING` |
| 15 | Test Cases | `TESTING` (section) |
| 16 | CI/CD Pipeline Design | `DEPLOYMENT` |
| 17 | Deployment Blueprint | `DEPLOYMENT` (section) |
| 18 | Engineering Sprint Plan | `DEPLOYMENT` (section) |
| 19 | Master Prompt for AI Coding Tools | `MASTER_PROMPT` |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15, TypeScript, Tailwind, shadcn/ui, Framer Motion, Aceternity UI, Magic UI, Lucide, React Flow, Mermaid, Monaco, Zustand, TanStack Query |
| Backend | FastAPI, LangGraph, OpenAI SDK, PostgreSQL, SQLAlchemy, Alembic |
| Infra | Docker Compose (local), SSE streaming, JWT auth |

## Repository Layout

```
SpecForge/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # FastAPI backend
├── packages/
│   └── shared/       # Shared TypeScript types & constants
├── docs/             # Architecture & implementation docs
├── docker/           # Docker & compose files
└── scripts/          # Dev & deployment scripts
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) — system design, data model, API, LangGraph pipeline
- [Folder Structure](./docs/STRUCTURE.md) — complete directory hierarchy
- [Database Schema](./docs/DATABASE.md) — tables, indexes, ERD
- [API Reference](./docs/API.md) — REST endpoints
- [Environment Variables](./docs/ENVIRONMENT.md) — all env vars
- [Development Workflow](./docs/DEVELOPMENT.md) — local setup & deployment
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) — phased build roadmap

## Quick Start (after implementation)

```bash
# Start infrastructure
docker compose -f docker/docker-compose.yml up -d

# Backend
cd apps/api && uv sync && alembic upgrade head && uvicorn app.main:app --reload

# Frontend
cd apps/web && pnpm install && pnpm dev
```

## Design Principles

- **Dark mode first** — Linear / Notion / Vercel inspired premium SaaS aesthetic
- **Streaming generation** — real-time artifact timeline via SSE
- **Editable artifacts** — Monaco editor with export (Markdown, JSON, ZIP)
- **Enterprise-ready** — structured outputs, versioning, audit trail

## Production Deployment

- Frontend: Vercel with `NEXT_PUBLIC_API_URL` pointing to the Railway backend
- Backend: Railway using `docker/Dockerfile.api` and `apps/api/railway.json`
- Database: Railway PostgreSQL plugin
- Production secrets: keep `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, and `SENTRY_DSN` in Railway/Vercel/GitHub Actions secrets, not in the repo

## License

Proprietary — SpecForge
