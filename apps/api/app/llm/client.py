import io
from typing import Any

from openai import AsyncOpenAI

from app.config import get_settings


def has_valid_key() -> bool:
    settings = get_settings()
    key = settings.openai_api_key
    if not key:
        return False
    if "your-key" in key or "change-me" in key or key.startswith("sk-proj-YO6w"):
        return False
    return True


class LLMClient:
    def __init__(self) -> None:
        settings = get_settings()
        self.client = AsyncOpenAI(api_key=settings.openai_api_key) if has_valid_key() else None
        self.model = settings.openai_model

    async def generate(self, system: str, user: str, response_format: dict[str, Any] | None = None) -> str:
        if self.client is None:
            return f"# Generated Artifact\n\n{user.strip()}"

        kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.4,
            "max_tokens": 2800,
        }
        if response_format:
            kwargs["response_format"] = response_format
        response = await self.client.chat.completions.create(**kwargs)
        return response.choices[0].message.content or ""
