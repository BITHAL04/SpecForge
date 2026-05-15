#!/usr/bin/env bash
set -e

echo "Starting SpecForge development environment..."

docker compose -f docker/docker-compose.yml up -d
echo "Waiting for database..."
sleep 3

echo ""
echo "SpecForge is ready!"
echo "  Database: postgresql://specforge:specforge@localhost:5432/specforge"
echo ""
echo "Next steps:"
echo "  1. cp .env.example apps/api/.env"
echo "  2. cp apps/web/.env.local.example apps/web/.env.local"
echo "  3. pnpm install"
echo "  4. cd apps/api && uv sync && alembic upgrade head"
echo "  5. pnpm dev:api  (terminal 1)"
echo "  6. pnpm dev:web  (terminal 2)"
