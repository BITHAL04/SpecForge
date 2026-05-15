"""Initial schema: users, projects, artifacts, generation_events

Revision ID: 001
Revises:
Create Date: 2026-06-18
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    user_plan = sa.Enum("free", "pro", "enterprise", name="userplan")
    project_status = sa.Enum("draft", "generating", "completed", "failed", name="projectstatus")
    artifact_type = sa.Enum(
        "PRD", "STORIES", "HLD", "LLD", "ERD", "API_SPEC", "SECURITY", "TESTING", "DEPLOYMENT", "MASTER_PROMPT",
        name="artifacttype",
    )
    content_format = sa.Enum("markdown", "mermaid", "openapi", "json", name="contentformat")
    generation_event_type = sa.Enum("started", "progress", "completed", "error", name="generationeventtype")

    user_plan.create(op.get_bind(), checkfirst=True)
    project_status.create(op.get_bind(), checkfirst=True)
    artifact_type.create(op.get_bind(), checkfirst=True)
    content_format.create(op.get_bind(), checkfirst=True)
    generation_event_type.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("avatar_url", sa.String(512), nullable=True),
        sa.Column("plan", user_plan, nullable=False, server_default="free"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "projects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False, server_default="Untitled Project"),
        sa.Column("idea", sa.Text(), nullable=False),
        sa.Column("status", project_status, nullable=False, server_default="draft"),
        sa.Column("generation_progress", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_projects_user_id", "projects", ["user_id"])
    op.create_index("ix_projects_user_updated", "projects", ["user_id", "updated_at"])

    op.create_table(
        "artifacts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", artifact_type, nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False, server_default=""),
        sa.Column("structured_content", sa.JSON(), nullable=True),
        sa.Column("content_format", content_format, nullable=False, server_default="markdown"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("is_generated", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("project_id", "type", name="uq_artifact_project_type"),
    )
    op.create_index("ix_artifacts_project_id", "artifacts", ["project_id"])

    op.create_table(
        "generation_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id", ondelete="CASCADE"), nullable=False),
        sa.Column("artifact_type", artifact_type, nullable=True),
        sa.Column("event_type", generation_event_type, nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_generation_events_project_id", "generation_events", ["project_id"])


def downgrade() -> None:
    op.drop_table("generation_events")
    op.drop_table("artifacts")
    op.drop_table("projects")
    op.drop_table("users")
    sa.Enum(name="generationeventtype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="contentformat").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="artifacttype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="projectstatus").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="userplan").drop(op.get_bind(), checkfirst=True)
