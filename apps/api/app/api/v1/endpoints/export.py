from uuid import UUID
from typing import Literal

import io

from fastapi import APIRouter, Depends
from fastapi.responses import Response, StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import User
from app.services.export_service import (
    build_export_filename,
    build_markdown_export,
    build_pdf_export,
    build_zip_export,
    get_export_payload,
)

router = APIRouter()


@router.get("/{project_id}/export")
async def export_project(
    project_id: UUID,
    format: Literal["zip", "markdown", "pdf"] = "zip",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project, artifacts = await get_export_payload(db, project_id, current_user)

    if format == "markdown":
        content = build_markdown_export(project, artifacts)
        return Response(
            content=content,
            media_type="text/markdown; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{build_export_filename(project, "md")}"'},
        )

    if format == "pdf":
        content = build_pdf_export(project, artifacts)
        return Response(
            content=content,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{build_export_filename(project, "pdf")}"'},
        )

    content = build_zip_export(project, artifacts)
    return StreamingResponse(
        io.BytesIO(content),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{build_export_filename(project, "zip")}"'},
    )
