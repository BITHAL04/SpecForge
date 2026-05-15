# SpecForge — Complete Folder Hierarchy

Generated scaffold as of project initialization. **~120 files** across monorepo.

```
SpecForge/
├── .env.example
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── railway.json                    # Railway deployment (API)
├── vercel.json                     # Vercel deployment (Web)
├── README.md
│
├── .github/workflows/
│   └── ci.yml
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── DEVELOPMENT.md
│   ├── ENVIRONMENT.md
│   ├── FOLDER_STRUCTURE.md
│   └── IMPLEMENTATION_PLAN.md
│
├── docker/
│   ├── docker-compose.yml          # Dev: PostgreSQL only
│   ├── docker-compose.prod.yml     # Prod: full stack
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── init-db.sql
│
├── scripts/
│   ├── dev.ps1
│   └── dev.sh
│
├── packages/shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── artifact-types.ts
│       ├── api-contracts.ts
│       ├── generation-events.ts
│       └── constants.ts
│
├── apps/
│   │
│   ├── api/                        # FASTAPI BACKEND
│   │   ├── pyproject.toml
│   │   ├── alembic.ini
│   │   ├── .env.example
│   │   ├── railway.json
│   │   ├── railway.toml
│   │   │
│   │   ├── alembic/
│   │   │   ├── env.py
│   │   │   ├── script.py.mako
│   │   │   └── versions/
│   │   │       └── 001_initial_schema.py
│   │   │
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   └── test_health.py
│   │   │
│   │   └── app/
│   │       ├── __init__.py
│   │       ├── main.py
│   │       ├── config.py
│   │       │
│   │       ├── core/
│   │       │   ├── exceptions.py
│   │       │   ├── logging.py
│   │       │   └── security.py
│   │       │
│   │       ├── db/
│   │       │   ├── base.py
│   │       │   └── session.py
│   │       │
│   │       ├── models/
│   │       │   └── __init__.py     # User, Project, Artifact, GenerationEvent
│   │       │
│   │       ├── schemas/
│   │       │   └── __init__.py
│   │       │
│   │       ├── api/
│   │       │   ├── deps.py
│   │       │   └── v1/
│   │       │       ├── router.py
│   │       │       └── endpoints/
│   │       │           ├── __init__.py
│   │       │           ├── auth.py
│   │       │           ├── projects.py
│   │       │           ├── artifacts.py
│   │       │           ├── generation.py
│   │       │           └── export.py
│   │       │
│   │       ├── services/
│   │       │   └── generation_service.py
│   │       │
│   │       ├── llm/
│   │       │   └── client.py
│   │       │
│   │       └── graph/
│   │           ├── state.py
│   │           ├── workflow.py
│   │           ├── runner.py
│   │           ├── nodes/
│   │           │   ├── analyze.py
│   │           │   ├── prd.py
│   │           │   ├── stories.py
│   │           │   ├── hld.py
│   │           │   ├── lld.py
│   │           │   ├── erd.py
│   │           │   ├── api_spec.py
│   │           │   ├── security.py
│   │           │   ├── testing.py
│   │           │   ├── deployment.py
│   │           │   └── master_prompt.py
│   │           └── prompts/
│   │               └── system.py
│   │
│   └── web/                        # NEXT.JS 15 FRONTEND
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       ├── components.json
│       ├── vercel.json
│       ├── .env.local.example
│       │
│       ├── public/
│       │   └── .gitkeep
│       │
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── providers.tsx
│       │   │
│       │   ├── (marketing)/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── pricing/page.tsx
│       │   │
│       │   ├── (auth)/
│       │   │   ├── layout.tsx
│       │   │   ├── login/page.tsx
│       │   │   └── signup/page.tsx
│       │   │
│       │   └── (dashboard)/
│       │       ├── layout.tsx
│       │       ├── dashboard/page.tsx
│       │       ├── projects/
│       │       │   ├── new/page.tsx
│       │       │   └── [id]/page.tsx
│       │       └── settings/page.tsx
│       │
│       ├── components/
│       │   ├── ui/
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   └── textarea.tsx
│       │   │
│       │   ├── marketing/
│       │   │   ├── navbar.tsx
│       │   │   ├── footer.tsx
│       │   │   ├── hero-section.tsx
│       │   │   ├── gradient-background.tsx
│       │   │   ├── floating-cards.tsx
│       │   │   ├── demo-section.tsx
│       │   │   ├── features-section.tsx
│       │   │   ├── pricing-section.tsx
│       │   │   └── cta-section.tsx
│       │   │
│       │   ├── auth/
│       │   │   ├── login-form.tsx
│       │   │   └── signup-form.tsx
│       │   │
│       │   ├── dashboard/
│       │   │   ├── sidebar.tsx
│       │   │   ├── project-list.tsx
│       │   │   └── command-palette.tsx
│       │   │
│       │   ├── workspace/
│       │   │   ├── idea-input.tsx
│       │   │   ├── workspace-header.tsx
│       │   │   ├── artifact-tabs.tsx
│       │   │   ├── artifact-viewer.tsx
│       │   │   ├── generation-timeline.tsx
│       │   │   └── export-menu.tsx
│       │   │
│       │   ├── diagrams/
│       │   │   └── mermaid-renderer.tsx
│       │   │
│       │   └── shared/
│       │       └── logo.tsx
│       │
│       └── lib/
│           ├── api/
│           │   ├── client.ts
│           │   ├── auth.ts
│           │   ├── projects.ts
│           │   └── artifacts.ts
│           ├── hooks/
│           │   ├── use-projects.ts
│           │   └── use-generation-stream.ts
│           ├── stores/
│           │   ├── ui-store.ts
│           │   └── workspace-store.ts
│           └── utils/
│               └── cn.ts
```

## Architecture Summary

| Layer | Location | Stack |
|-------|----------|-------|
| Frontend | `apps/web` | Next.js 15, Tailwind, shadcn, Zustand, TanStack Query |
| Backend | `apps/api` | FastAPI, SQLAlchemy, LangGraph, OpenAI |
| Database | PostgreSQL | users, projects, artifacts, generation_events |
| Shared | `packages/shared` | TypeScript types & enums |
| Docker | `docker/` | Dev DB + prod full stack |
| Deploy | `vercel.json`, `railway.json` | Vercel (web) + Railway (api) |
