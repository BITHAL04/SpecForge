# SpecForge — Complete Folder Structure

```
SpecForge/
│
├── README.md
├── .gitignore
├── .env.example
├── pnpm-workspace.yaml
├── package.json                          # Root workspace scripts
├── turbo.json                            # Optional: Turborepo pipeline
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FOLDER_STRUCTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── API.md                            # OpenAPI reference (generated)
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── init-db.sql
│
├── scripts/
│   ├── dev.ps1                           # Windows dev bootstrap
│   ├── dev.sh                            # Unix dev bootstrap
│   ├── seed.py                           # Demo data seeder
│   └── generate-openapi.sh
│
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── artifact-types.ts         # ArtifactType enum + labels
│           ├── api-contracts.ts          # Request/response interfaces
│           ├── generation-events.ts      # SSE event types
│           └── constants.ts
│
├── apps/
│   │
│   ├── web/                              # ─── NEXT.JS 15 FRONTEND ───
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.mjs
│   │   ├── components.json               # shadcn/ui config
│   │   ├── .env.local.example
│   │   │
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── og-image.png
│   │   │   └── logos/
│   │   │
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx                # Root layout, fonts, providers
│   │   │   ├── providers.tsx             # QueryClient, Theme, Toaster
│   │   │   │
│   │   │   ├── (marketing)/              # Public marketing routes
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx              # Landing page
│   │   │   │   └── pricing/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── signup/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx            # Sidebar + command palette shell
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx          # Project list home
│   │   │       ├── projects/
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx      # New project / idea input
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx      # Workspace (artifact viewer)
│   │   │       │       └── loading.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                       # shadcn/ui primitives
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   └── command.tsx           # cmdk wrapper
│   │   │   │
│   │   │   ├── marketing/
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── floating-cards.tsx
│   │   │   │   ├── gradient-background.tsx
│   │   │   │   ├── demo-section.tsx
│   │   │   │   ├── features-section.tsx
│   │   │   │   ├── pricing-section.tsx
│   │   │   │   ├── cta-section.tsx
│   │   │   │   ├── navbar.tsx
│   │   │   │   └── footer.tsx
│   │   │   │
│   │   │   ├── aceternity/               # Aceternity UI effects
│   │   │   │   ├── spotlight.tsx
│   │   │   │   ├── background-beams.tsx
│   │   │   │   └── text-generate-effect.tsx
│   │   │   │
│   │   │   ├── magic/                    # Magic UI components
│   │   │   │   ├── animated-gradient-text.tsx
│   │   │   │   ├── shimmer-button.tsx
│   │   │   │   └── border-beam.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── sidebar-nav.tsx
│   │   │   │   ├── project-list.tsx
│   │   │   │   ├── project-card.tsx
│   │   │   │   ├── command-palette.tsx
│   │   │   │   ├── activity-panel.tsx
│   │   │   │   ├── search-bar.tsx
│   │   │   │   └── user-menu.tsx
│   │   │   │
│   │   │   ├── workspace/
│   │   │   │   ├── artifact-tabs.tsx
│   │   │   │   ├── artifact-viewer.tsx
│   │   │   │   ├── artifact-editor.tsx   # Monaco wrapper
│   │   │   │   ├── generation-timeline.tsx
│   │   │   │   ├── generation-progress.tsx
│   │   │   │   ├── export-menu.tsx
│   │   │   │   ├── idea-input.tsx
│   │   │   │   └── workspace-header.tsx
│   │   │   │
│   │   │   ├── diagrams/
│   │   │   │   ├── mermaid-renderer.tsx
│   │   │   │   ├── architecture-flow.tsx  # React Flow
│   │   │   │   └── er-diagram.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── logo.tsx
│   │   │       ├── theme-toggle.tsx
│   │   │       ├── loading-spinner.tsx
│   │   │       └── empty-state.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts             # Fetch wrapper + auth
│   │   │   │   ├── auth.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── artifacts.ts
│   │   │   │   └── generation.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts
│   │   │   │   ├── use-projects.ts
│   │   │   │   ├── use-artifacts.ts
│   │   │   │   ├── use-generation-stream.ts
│   │   │   │   └── use-command-palette.ts
│   │   │   ├── stores/
│   │   │   │   ├── ui-store.ts           # Sidebar, modals
│   │   │   │   └── workspace-store.ts    # Active tab, edit mode
│   │   │   └── utils/
│   │   │       ├── cn.ts
│   │   │       ├── format.ts
│   │   │       └── export.ts
│   │   │
│   │   └── types/
│   │       └── index.ts                  # Re-exports from @specforge/shared
│   │
│   └── api/                              # ─── FASTAPI BACKEND ───
│       ├── pyproject.toml                # uv / poetry deps
│       ├── alembic.ini
│       ├── .env.example
│       │
│       ├── alembic/
│       │   ├── env.py
│       │   ├── script.py.mako
│       │   └── versions/
│       │       └── 001_initial_schema.py
│       │
│       ├── tests/
│       │   ├── conftest.py
│       │   ├── test_auth.py
│       │   ├── test_projects.py
│       │   ├── test_artifacts.py
│       │   └── test_generation.py
│       │
│       └── app/
│           ├── __init__.py
│           ├── main.py                   # FastAPI app factory
│           ├── config.py                 # Pydantic Settings
│           │
│           ├── db/
│           │   ├── base.py
│           │   ├── session.py
│           │   └── init_db.py
│           │
│           ├── models/
│           │   ├── __init__.py
│           │   ├── user.py
│           │   ├── project.py
│           │   ├── artifact.py
│           │   └── generation_event.py
│           │
│           ├── schemas/
│           │   ├── __init__.py
│           │   ├── auth.py
│           │   ├── user.py
│           │   ├── project.py
│           │   ├── artifact.py
│           │   └── generation.py
│           │
│           ├── api/
│           │   ├── deps.py               # get_db, get_current_user
│           │   └── v1/
│           │       ├── router.py
│           │       └── endpoints/
│           │           ├── auth.py
│           │           ├── projects.py
│           │           ├── artifacts.py
│           │           ├── generation.py
│           │           └── export.py
│           │
│           ├── services/
│           │   ├── auth_service.py
│           │   ├── project_service.py
│           │   ├── artifact_service.py
│           │   ├── generation_service.py
│           │   ├── export_service.py
│           │   └── event_bus.py          # SSE pub/sub
│           │
│           ├── graph/                    # LangGraph pipeline
│           │   ├── __init__.py
│           │   ├── state.py
│           │   ├── workflow.py           # Graph definition
│           │   ├── runner.py             # Async execution + SSE hooks
│           │   ├── nodes/
│           │   │   ├── __init__.py
│           │   │   ├── analyze.py
│           │   │   ├── prd.py
│           │   │   ├── stories.py
│           │   │   ├── hld.py
│           │   │   ├── lld.py
│           │   │   ├── erd.py
│           │   │   ├── api_spec.py
│           │   │   ├── security.py
│           │   │   ├── testing.py
│           │   │   ├── deployment.py
│           │   │   └── master_prompt.py
│           │   └── prompts/
│           │       ├── system.py
│           │       ├── prd.py
│           │       ├── stories.py
│           │       ├── hld.py
│           │       ├── lld.py
│           │       ├── erd.py
│           │       ├── api_spec.py
│           │       ├── security.py
│           │       ├── testing.py
│           │       ├── deployment.py
│           │       └── master_prompt.py
│           │
│           ├── core/
│           │   ├── security.py             # JWT, password hashing
│           │   ├── exceptions.py
│           │   └── logging.py
│           │
│           └── llm/
│               ├── client.py               # OpenAI wrapper
│               └── structured_output.py    # JSON schema helpers
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

## File Count Summary

| Area | Approx. Files |
|------|---------------|
| Frontend (`apps/web`) | ~85 |
| Backend (`apps/api`) | ~55 |
| Shared package | ~8 |
| Docker / CI / Scripts | ~12 |
| Docs | ~4 |
| **Total** | **~164** |

## Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| React components | PascalCase file | `ArtifactViewer.tsx` |
| Hooks | `use-` prefix | `use-generation-stream.ts` |
| API routes (FastAPI) | snake_case | `generation.py` |
| DB models | singular PascalCase | `User`, `Project` |
| DB tables | plural snake_case | `users`, `projects` |
| Env vars | SCREAMING_SNAKE | `OPENAI_API_KEY` |
| Shared enums | PascalCase | `ArtifactType.PRD` |
