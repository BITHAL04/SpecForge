"""Project export engine for markdown, PDF, and zip delivery."""

from __future__ import annotations

import io
import textwrap
import zipfile
from dataclasses import dataclass
from typing import Iterable

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import artifact_crud
from app.models import Artifact, ArtifactType, ContentFormat, Project, User
from app.services.project_service import get_owned_project


@dataclass(frozen=True, slots=True)
class ExportFile:
    filename: str
    content: str
    media_type: str


ARTIFACT_EXPORT_ORDER: tuple[tuple[ArtifactType, str], ...] = (
    (ArtifactType.PRD, "PRD.md"),
    (ArtifactType.STORIES, "Stories.md"),
    (ArtifactType.HLD, "HLD.md"),
    (ArtifactType.LLD, "LLD.md"),
    (ArtifactType.ERD, "ERD.md"),
    (ArtifactType.API_SPEC, "API.yaml"),
    (ArtifactType.SECURITY, "Security.md"),
    (ArtifactType.TESTING, "Testing.md"),
    (ArtifactType.DEPLOYMENT, "Deployment.md"),
    (ArtifactType.MASTER_PROMPT, "MasterPrompt.md"),
)


def _artifact_by_type(artifacts: Iterable[Artifact], artifact_type: ArtifactType) -> Artifact | None:
    for artifact in artifacts:
        if artifact.type == artifact_type:
            return artifact
    return None


def _markdown_heading(text: str) -> str:
    return text.strip() or "SpecForge Export"


def _missing_placeholder(filename: str, artifact_type: ArtifactType) -> str:
    if artifact_type == ArtifactType.API_SPEC:
        return textwrap.dedent(
            """
            openapi: 3.1.0
            info:
              title: SpecForge API
              version: 1.0.0
            paths: {}
            """
        ).strip()

    return textwrap.dedent(
        f"""
        # {filename}

        _Artifact not generated yet._
        """
    ).strip()


def _render_markdown_block(title: str, artifact: Artifact | None, artifact_type: ArtifactType) -> str:
    if not artifact:
        return _missing_placeholder(title, artifact_type)

    content = artifact.content
    content_format = artifact.content_format
    if content_format == ContentFormat.OPENAPI:
        body = f"```yaml\n{content.strip()}\n```"
    elif content_format == ContentFormat.MERMAID:
        body = f"```mermaid\n{content.strip()}\n```"
    else:
        body = content.strip()

    return textwrap.dedent(
        f"""
        # {title}

        {body}
        """
    ).strip()


def _collect_export_files(project: Project, artifacts: list[Artifact]) -> list[ExportFile]:
    files: list[ExportFile] = []
    for artifact_type, filename in ARTIFACT_EXPORT_ORDER:
        artifact = _artifact_by_type(artifacts, artifact_type)
        if artifact_type == ArtifactType.API_SPEC:
            content = artifact.content.strip() if artifact else _missing_placeholder(filename, artifact_type)
            media_type = "application/yaml"
        else:
            content = _render_markdown_block(artifact.title if artifact else filename.replace(".md", ""), artifact, artifact_type)
            media_type = "text/markdown"
        files.append(ExportFile(filename=filename, content=content, media_type=media_type))
    return files


async def get_export_payload(db: AsyncSession, project_id, user: User) -> tuple[Project, list[Artifact]]:
    project = await get_owned_project(db, project_id, user)
    artifacts = await artifact_crud.get_multi_by_project(db, project.id)
    return project, artifacts


def build_zip_export(project: Project, artifacts: list[Artifact]) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for export_file in _collect_export_files(project, artifacts):
            zf.writestr(export_file.filename, export_file.content)
    buffer.seek(0)
    return buffer.getvalue()


def build_markdown_export(project: Project, artifacts: list[Artifact]) -> str:
    sections = [
        f"# {_markdown_heading(project.title)}",
        "",
        f"## Project Idea",
        project.idea.strip(),
        "",
    ]
    for export_file in _collect_export_files(project, artifacts):
        title = export_file.filename.rsplit(".", 1)[0].replace("MasterPrompt", "Master Prompt")
        sections.append(f"## {title}")
        sections.append("")
        sections.append(export_file.content.strip())
        sections.append("")
    return "\n".join(sections).strip() + "\n"


def build_pdf_export(project: Project, artifacts: list[Artifact]) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    _, height = letter
    left_margin = 54
    top_margin = height - 54
    line_height = 14

    def write_line(text: str) -> None:
        nonlocal top_margin
        if top_margin < 72:
            pdf.showPage()
            top_margin = height - 54
        pdf.drawString(left_margin, top_margin, text[:110])
        top_margin -= line_height

    def write_wrapped(text: str, prefix: str = "") -> None:
        lines = textwrap.wrap(text, width=92) or [""]
        for index, line in enumerate(lines):
            write_line(f"{prefix}{line}" if index == 0 else line)

    pdf.setTitle(project.title)
    pdf.setFont("Helvetica-Bold", 18)
    write_line(project.title)
    pdf.setFont("Helvetica", 11)
    write_line("")
    write_wrapped("Executive summary: This export packages the full SpecForge blueprint for delivery and review.")
    write_line("")
    write_wrapped("Project idea:")
    write_wrapped(project.idea)
    write_line("")

    for export_file in _collect_export_files(project, artifacts):
        pdf.setFont("Helvetica-Bold", 14)
        write_line(export_file.filename.replace(".md", "").replace(".yaml", ""))
        pdf.setFont("Helvetica", 10)
        content = export_file.content.replace("\r", "")
        for paragraph in content.split("\n"):
            if not paragraph.strip():
                write_line("")
                continue
            if paragraph.startswith("#") or paragraph.startswith("##"):
                pdf.setFont("Helvetica-Bold", 11)
                write_wrapped(paragraph.lstrip("# "))
                pdf.setFont("Helvetica", 10)
            else:
                write_wrapped(paragraph)
        write_line("")

    pdf.save()
    buffer.seek(0)
    return buffer.getvalue()


def build_export_filename(project: Project, suffix: str) -> str:
    safe_title = "".join(ch if ch.isalnum() or ch in {"-", "_", " "} else "-" for ch in project.title).strip()
    safe_title = "-".join(part for part in safe_title.split() if part)
    return f"{safe_title or 'specforge-project'}.{suffix}"
