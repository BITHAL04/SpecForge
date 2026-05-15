import enum


class UserPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class ArtifactType(str, enum.Enum):
    PRD = "PRD"
    STORIES = "STORIES"
    HLD = "HLD"
    LLD = "LLD"
    ERD = "ERD"
    API_SPEC = "API_SPEC"
    SECURITY = "SECURITY"
    TESTING = "TESTING"
    DEPLOYMENT = "DEPLOYMENT"
    MASTER_PROMPT = "MASTER_PROMPT"


class ContentFormat(str, enum.Enum):
    MARKDOWN = "markdown"
    MERMAID = "mermaid"
    OPENAPI = "openapi"
    JSON = "json"


class GenerationEventType(str, enum.Enum):
    STARTED = "started"
    PROGRESS = "progress"
    COMPLETED = "completed"
    ERROR = "error"
