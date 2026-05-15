from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.router import api_router
from app.config import get_settings
from app.core.exceptions import SpecForgeError
from app.core.logging import setup_logging
from app.core.middleware import RequestLoggingMiddleware, RateLimitMiddleware, RequestTimeoutMiddleware
from app.core.monitoring import setup_monitoring
from app.db.session import engine, get_db
from app.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    setup_logging(settings)
    setup_monitoring(settings)
    if "sqlite" in settings.database_url:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="SpecForge API",
        description="Transform product ideas into enterprise engineering blueprints",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url="/redoc" if settings.environment != "production" else None,
    )

    @app.exception_handler(SpecForgeError)
    async def specforge_exception_handler(_request: Request, exc: SpecForgeError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    app.add_middleware(RequestLoggingMiddleware)
    app.add_middleware(RateLimitMiddleware, settings=settings)
    app.add_middleware(RequestTimeoutMiddleware, settings=settings)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_app()


@app.get("/health", tags=["health"])
async def health(db: AsyncSession = Depends(get_db)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok", "service": "specforge-api", "database": "connected"}


@app.get("/ready", tags=["health"])
async def ready(db: AsyncSession = Depends(get_db)):
    await db.execute(text("SELECT 1"))
    return {"status": "ready"}
