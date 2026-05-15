"""Production middleware for request logging and rate limiting."""

from __future__ import annotations

import asyncio
import time
from collections import defaultdict, deque
from dataclasses import dataclass
from typing import Deque
from uuid import uuid4

import structlog
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import Settings

logger = structlog.get_logger()


def _client_ip(request: Request, trusted_proxy_count: int) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        parts = [part.strip() for part in forwarded_for.split(",") if part.strip()]
        if parts:
            index = max(0, len(parts) - trusted_proxy_count - 1)
            return parts[index]
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


@dataclass(slots=True)
class _RateLimitBucket:
    timestamps: Deque[float]


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid4())
        started_at = time.perf_counter()
        response: Response | None = None

        try:
            response = await call_next(request)
        finally:
            duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
            status_code = response.status_code if response else 500
            logger.info(
                "http.request",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                status_code=status_code,
                duration_ms=duration_ms,
            )

        response.headers["x-request-id"] = request_id
        response.headers["x-response-time-ms"] = str(duration_ms)
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, settings: Settings):
        super().__init__(app)
        self.settings = settings
        self._buckets: dict[str, _RateLimitBucket] = defaultdict(lambda: _RateLimitBucket(deque()))
        self._lock = asyncio.Lock()

    async def dispatch(self, request: Request, call_next):
        if not self.settings.rate_limit_enabled:
            return await call_next(request)

        if request.url.path in {"/health", "/docs", "/redoc", "/openapi.json"}:
            return await call_next(request)

        key = f"{_client_ip(request, self.settings.trusted_proxy_count)}:{request.url.path}"
        now = time.monotonic()
        window = self.settings.rate_limit_window_seconds
        limit = self.settings.rate_limit_requests

        async with self._lock:
            bucket = self._buckets[key]
            while bucket.timestamps and now - bucket.timestamps[0] > window:
                bucket.timestamps.popleft()
            if len(bucket.timestamps) >= limit:
                return JSONResponse(
                    content={"detail": "Rate limit exceeded"},
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    headers={"Retry-After": str(window)},
                )
            bucket.timestamps.append(now)

        return await call_next(request)


class RequestTimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, settings: Settings):
        super().__init__(app)
        self.settings = settings

    async def dispatch(self, request: Request, call_next):
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.settings.request_timeout_seconds)
        except asyncio.TimeoutError:
            return JSONResponse(
                content={"detail": "Request timed out"},
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            )