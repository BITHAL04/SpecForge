# SpecForge — Implementation Plan

Phased roadmap to deliver a production-ready MVP, then harden for scale. Each phase has clear deliverables, dependencies, and acceptance criteria.

---

## Overview Timeline

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
Foundation   Backend      AI Pipeline  Frontend     Integration  Polish
  (2d)        (3d)         (4d)        (5d)          (2d)        (2d)
```

**Estimated MVP:** ~18 working days (solo developer)

---

## Phase 0: Foundation & Scaffolding

**Goal:** Runnable monorepo skeleton with dev tooling.

### Tasks

| # | Task | Output |
|---|------|--------|
| 0.1 | Init git, `.gitignore`, root `package.json`, `pnpm-workspace.yaml` | Monorepo root |
| 0.2 | Scaffold `packages/shared` with `ArtifactType` enum | Shared types |
| 0.3 | Scaffold `apps/api` with FastAPI hello-world | `GET /health` |
| 0.4 | Scaffold `apps/web` with Next.js 15 + Tailwind + shadcn | Landing stub |
| 0.5 | `docker-compose.yml` with PostgreSQL | Local DB |
| 0.6 | `.env.example` files for api + web | Documented env vars |
| 0.7 | `scripts/dev.ps1` one-command dev start | DX script |

### Acceptance Criteria

- [ ] `docker compose up` starts Postgres
- [ ] `pnpm dev` starts Next.js on `:3000`
- [ ] `uvicorn` starts API on `:8000` with `/health`
- [ ] Shared package imports in frontend without error

### Env Variables

```env
# apps/api
DATABASE_URL=postgresql+asyncpg://specforge:specforge@localhost:5432/specforge
OPENAI_API_KEY=sk-...
JWT_SECRET=...
CORS_ORIGINS=http://localhost:3000

# apps/web
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Phase 1: Backend Core

**Goal:** Auth, database models, CRUD for projects and artifacts.

### Tasks

| # | Task | Details |
|---|------|---------|
| 1.1 | SQLAlchemy models | `User`, `Project`, `Artifact`, `GenerationEvent` |
| 1.2 | Alembic migration `001_initial` | All tables + indexes |
| 1.3 | Pydantic schemas | Request/response for all entities |
| 1.4 | Auth service | Register, login, JWT, `get_current_user` dep |
| 1.5 | Project service | CRUD, user-scoped queries |
| 1.6 | Artifact service | Upsert by `(project_id, type)`, versioning |
| 1.7 | API routes | `/auth/*`, `/projects/*`, `/artifacts/*` |
| 1.8 | Pytest suite | Auth + project + artifact tests |

### API Endpoints (Phase 1)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/{id}
PATCH  /api/v1/projects/{id}
DELETE /api/v1/projects/{id}
GET    /api/v1/projects/{id}/artifacts
GET    /api/v1/projects/{id}/artifacts/{type}
PATCH  /api/v1/projects/{id}/artifacts/{type}
```

### Acceptance Criteria

- [x] User can register and receive JWT
- [x] User can create project with `idea` text
- [x] Artifacts can be manually upserted (for testing)
- [x] Cross-user access returns 403
- [x] All tests pass

---

## Phase 2: AI Generation Pipeline

**Goal:** LangGraph workflow that generates all 10 artifact types from an idea.

### Tasks

| # | Task | Details |
|---|------|---------|
| 2.1 | OpenAI client wrapper | Retry, token counting, structured output |
| 2.2 | Prompt templates | One file per artifact in `graph/prompts/` |
| 2.3 | LangGraph state + workflow | 11 nodes, linear graph with error handling |
| 2.4 | Node implementations | Each node: prompt → parse → upsert artifact |
| 2.5 | Context summarization | Pass prior artifact summaries between nodes |
| 2.6 | Generation service | `start_generation(project_id)` async task |
| 2.7 | Event bus + SSE endpoint | `GET /projects/{id}/generate/stream` |
| 2.8 | Progress tracking | Update `generation_progress`, `status` |
| 2.9 | Retry endpoint | Resume from last successful node |
| 2.10 | Integration tests | Mock OpenAI, verify artifact creation |

### LangGraph Node Order

```
1. analyze_idea       → updates project.title
2. generate_prd       → PRD
3. generate_stories   → STORIES
4. generate_hld       → HLD
5. generate_lld       → LLD
6. generate_erd       → ERD
7. generate_api_spec  → API_SPEC
8. generate_security  → SECURITY
9. generate_testing   → TESTING
10. generate_deployment → DEPLOYMENT
11. generate_master_prompt → MASTER_PROMPT
```

### Structured Output Schema (per node)

```python
class ArtifactOutput(BaseModel):
    title: str
    sections: list[Section]
    summary: str  # for context passing

class Section(BaseModel):
    id: str
    title: str
    content: str
    format: Literal["markdown", "mermaid", "openapi", "json"]
```

### Acceptance Criteria

- [ ] `POST /projects/{id}/generate` kicks off pipeline
- [ ] SSE stream shows real-time progress events
- [ ] All 10 artifacts populated after completion
- [ ] `projects.status` transitions: draft → generating → completed
- [ ] Failure sets status=failed with retriable error message
- [ ] Generation completes in < 5 min for typical idea

---

## Phase 3: Frontend — Marketing & Auth

**Goal:** Premium landing page and authentication flows.

### Tasks

| # | Task | Details |
|---|------|---------|
| 3.1 | Design tokens | Dark theme CSS variables, Geist font |
| 3.2 | shadcn/ui setup | Button, Card, Input, Dialog, Tabs, Command |
| 3.3 | Landing page | Hero, floating cards, gradients (Aceternity/Magic UI) |
| 3.4 | Features section | 6 feature cards with icons |
| 3.5 | Pricing section | 3 tiers (Free, Pro, Enterprise) |
| 3.6 | Demo section | Animated artifact preview carousel |
| 3.7 | CTA + Footer | Sign up prompts |
| 3.8 | Auth pages | Login + Signup forms |
| 3.9 | API client + auth hooks | Token storage, auto-refresh |
| 3.10 | Protected route middleware | Redirect unauthenticated users |

### Landing Page Sections

1. **Navbar** — Logo, Features, Pricing, Login, Get Started
2. **Hero** — Headline, subtext, idea input preview, gradient orbs
3. **Floating Cards** — Sample PRD, Architecture, API spec previews
4. **Demo** — Step-by-step generation animation
5. **Features** — 19 artifacts, AI-powered, export, enterprise-ready
6. **Pricing** — Tier comparison table
7. **CTA** — "Start forging your spec"
8. **Footer** — Links, social, legal

### Acceptance Criteria

- [ ] Landing page renders beautifully in dark mode
- [ ] Animations perform at 60fps (no layout shift)
- [ ] User can sign up and log in
- [ ] Authenticated user redirected to `/dashboard`
- [ ] Responsive down to 375px width

---

## Phase 4: Frontend — Dashboard & Workspace

**Goal:** Full project management and artifact viewing/editing experience.

### Tasks

| # | Task | Details |
|---|------|---------|
| 4.1 | Dashboard layout | Sidebar, header, main area |
| 4.2 | Sidebar | Project explorer, new project, settings |
| 4.3 | Project list | Cards with status, progress, date |
| 4.4 | New project flow | Idea textarea → create → auto-generate |
| 4.5 | Command palette | ⌘K: search projects, navigate artifacts |
| 4.6 | Workspace layout | Header, artifact tabs, content panel |
| 4.7 | Artifact tabs | 10 tabs with icons and completion status |
| 4.8 | Markdown renderer | `react-markdown` + `remark-gfm` |
| 4.9 | Mermaid renderer | `mermaid` init on section content |
| 4.10 | Monaco editor | Edit mode toggle, save to API |
| 4.11 | Generation timeline | SSE hook, animated event list |
| 4.12 | Progress bar | Overall generation % |
| 4.13 | Activity panel | Recent events across projects |
| 4.14 | Zustand stores | UI + workspace state |
| 4.15 | TanStack Query | Projects, artifacts, cache invalidation |

### Workspace UX Flow

```
User opens project
  → If status=draft: show "Generate" button
  → If status=generating: show timeline + progress, auto-select active artifact tab
  → If status=completed: show all artifact tabs, default to PRD
  → User clicks tab → renders sections (markdown/mermaid)
  → User clicks "Edit" → Monaco editor → Save → PATCH artifact
  → User clicks "Export" → download MD or ZIP
```

### Acceptance Criteria

- [ ] Dashboard lists all user projects
- [ ] New project triggers generation and shows live timeline
- [ ] All 10 artifact tabs render content correctly
- [ ] Mermaid diagrams render in HLD and ERD tabs
- [ ] Monaco edit + save persists changes
- [ ] Command palette navigates to projects and artifacts
- [ ] Export downloads ZIP with all artifacts

---

## Phase 5: Export, Polish & Production

**Goal:** Export functionality, error handling, CI/CD, deployment readiness.

### Tasks

| # | Task | Details |
|---|------|---------|
| 5.1 | Export service (backend) | ZIP with markdown files + metadata.json |
| 5.2 | Export UI | Format picker (MD, ZIP) |
| 5.3 | Error boundaries | Graceful frontend error states |
| 5.4 | Toast notifications | Success/error feedback |
| 5.5 | Loading skeletons | All data-fetching views |
| 5.6 | Empty states | No projects, no artifacts |
| 5.7 | Rate limiting | Per-plan generation limits |
| 5.8 | Sentry integration | Frontend + backend error tracking |
| 5.9 | GitHub Actions CI | Lint, test, build on PR |
| 5.10 | Docker production images | Multi-stage builds |
| 5.11 | README + deployment guide | Vercel + Railway instructions |
| 5.12 | Seed script | Demo project with sample artifacts |

### Acceptance Criteria

- [ ] ZIP export contains all 10 artifacts as `.md` files
- [ ] CI passes on clean checkout
- [ ] Production Docker images build successfully
- [ ] App deployable to Vercel (web) + Railway (api)
- [ ] Lighthouse performance score > 85 on landing page

---

## Phase 6 (Future): Enhancements

Not in MVP scope but planned:

| Feature | Description |
|---------|-------------|
| Team workspaces | Multi-user projects, roles |
| Template library | Pre-built idea templates |
| Partial regeneration | Regenerate single artifact |
| React Flow editor | Interactive architecture diagrams |
| PDF export | Puppeteer-based rendering |
| Billing | Stripe integration for Pro/Enterprise |
| Version history | Artifact diff and rollback |
| AI chat | Ask questions about your spec |
| Custom prompts | User-defined generation style |
| Webhook notifications | Slack/Discord on completion |

---

## Dependency Graph

```mermaid
graph LR
    P0[Phase 0: Foundation] --> P1[Phase 1: Backend Core]
    P0 --> P3[Phase 3: Marketing UI]
    P1 --> P2[Phase 2: AI Pipeline]
    P1 --> P4[Phase 4: Dashboard]
    P2 --> P4
    P3 --> P4
    P4 --> P5[Phase 5: Polish]
```

**Parallelizable work:**
- Phase 1 (backend) and Phase 3 (marketing UI) can run in parallel after Phase 0
- Phase 4 requires both Phase 2 and Phase 3

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI rate limits | Generation fails mid-pipeline | Exponential backoff, retry per node |
| Token overflow | Poor quality later artifacts | Summarize context, cap section lengths |
| SSE connection drops | User loses timeline | Reconnect + fetch events from DB |
| Long generation time | User abandons | Show progress, allow background |
| Mermaid render errors | Broken diagrams | Fallback to code block display |
| Monaco bundle size | Slow page load | Dynamic import, load on edit only |

---

## Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Backend unit | pytest | Services, auth, schemas |
| Backend integration | pytest + test DB | API endpoints, generation (mocked LLM) |
| Frontend unit | Vitest | Utils, hooks, stores |
| Frontend component | Testing Library | Key workspace components |
| E2E | Playwright | Signup → create project → view artifact |

---

## Definition of Done (MVP)

The MVP is complete when a user can:

1. Visit the landing page and understand the product
2. Sign up for an account
3. Enter a product idea ("Build an Airbnb clone")
4. Watch real-time generation of all 10 artifacts
5. Browse, read, and edit each artifact
6. View Mermaid diagrams inline
7. Export the full spec as a ZIP
8. Return to dashboard and see all projects

---

## Next Step

Proceed to **Phase 0 implementation** — scaffold the monorepo and verify the dev environment runs end-to-end.
