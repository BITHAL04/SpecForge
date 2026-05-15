# SpecForge — Environment Variables

## Root `.env.example`

Reference only — copy to app-specific locations.

## Backend (`apps/api/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL async connection string |
| `OPENAI_API_KEY` | Yes* | — | OpenAI API key for generation |
| `OPENAI_MODEL` | No | `gpt-4o` | Model for LangGraph nodes |
| `JWT_SECRET` | Yes | — | Secret for signing JWTs (64+ chars) |
| `JWT_ALGORITHM` | No | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` | Refresh token TTL |
| `CORS_ORIGINS` | Yes | — | Comma-separated allowed origins |
| `ENVIRONMENT` | No | `development` | `development` \| `production` |
| `LOG_LEVEL` | No | `INFO` | Logging level |
| `API_PREFIX` | No | `/api/v1` | API route prefix |
| `SENTRY_DSN` | No | — | Error monitoring endpoint |
| `SENTRY_TRACES_SAMPLE_RATE` | No | `0.1` | Sentry performance sample rate |
| `RATE_LIMIT_ENABLED` | No | `true` | Enable API rate limiting |
| `RATE_LIMIT_REQUESTS` | No | `120` | Requests per window |
| `RATE_LIMIT_WINDOW_SECONDS` | No | `60` | Rate limiting window |
| `TRUSTED_PROXY_COUNT` | No | `1` | Number of trusted reverse proxies |
| `REQUEST_TIMEOUT_SECONDS` | No | `60` | Request timeout budget |

\* Required for generation; optional for auth/CRUD testing.

### Example

```env
DATABASE_URL=postgresql+asyncpg://specforge:specforge@localhost:5432/specforge
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
JWT_SECRET=your-64-char-random-secret-here
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

### Railway Production

```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/railway
OPENAI_API_KEY=sk-...
JWT_SECRET=<generate-secure-random>
CORS_ORIGINS=https://specforge.vercel.app
ENVIRONMENT=production
LOG_LEVEL=INFO
SENTRY_DSN=https://...
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=120
RATE_LIMIT_WINDOW_SECONDS=60
PORT=8000
```

## Frontend (`apps/web/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | — | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | No | — | Frontend URL for metadata |
| `NEXT_PUBLIC_SENTRY_DSN` | No | — | Frontend error monitoring endpoint |

### Example

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=
```

### Vercel Production

```env
NEXT_PUBLIC_API_URL=https://specforge-api.up.railway.app/api/v1
NEXT_PUBLIC_APP_URL=https://specforge.vercel.app
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## Docker Compose

Set in `docker/docker-compose.prod.yml` or via `.env` file in `docker/`:

```env
JWT_SECRET=...
OPENAI_API_KEY=sk-...
```

## Security Notes

- Never commit `.env` or `.env.local` files
- Use different `JWT_SECRET` per environment
- Rotate `OPENAI_API_KEY` if exposed
- Railway/Vercel env vars are encrypted at rest
