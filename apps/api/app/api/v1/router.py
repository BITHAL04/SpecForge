from fastapi import APIRouter

from app.api.v1.endpoints import artifacts, auth, export, generation, projects

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(artifacts.router, prefix="/projects", tags=["artifacts"])
api_router.include_router(generation.router, prefix="/projects", tags=["generation"])
api_router.include_router(export.router, prefix="/projects", tags=["export"])
