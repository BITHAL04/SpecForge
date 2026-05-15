from typing import Annotated, TypedDict, Any

from app.models import ArtifactType


def merge_dict(left: dict[Any, Any] | None, right: dict[Any, Any] | None) -> dict[Any, Any]:
    new_dict = dict(left or {})
    new_dict.update(right or {})
    return new_dict


class GenerationState(TypedDict, total=False):
    project_id: str
    idea: str
    title: str
    context: Annotated[dict[str, str], merge_dict]
    artifacts: Annotated[dict[str, dict[str, str]], merge_dict]
    current_artifact: ArtifactType | None
    current_output: dict[str, object] | None
    project_title: str
    progress: int
    errors: list[str]
