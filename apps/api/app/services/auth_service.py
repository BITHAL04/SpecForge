from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.crud import user_crud
from app.models import User
from app.schemas import ClerkAuthRequest, LoginRequest, RegisterRequest, TokenResponse


async def authenticate_clerk(db: AsyncSession, body: ClerkAuthRequest) -> TokenResponse:
    user = await user_crud.get_by_email(db, body.email)
    if not user:
        user = await user_crud.create(
            db,
            email=body.email,
            password_hash=hash_password(f"clerk_{body.clerk_id}"),
            name=body.name,
        )
    return _token_response(user)


async def register_user(db: AsyncSession, body: RegisterRequest) -> TokenResponse:
    if await user_crud.get_by_email(db, body.email):
        raise ConflictError("Email already registered")

    user = await user_crud.create(
        db,
        email=body.email,
        password_hash=hash_password(body.password),
        name=body.name,
    )
    return _token_response(user)


async def login_user(db: AsyncSession, body: LoginRequest) -> TokenResponse:
    user = await user_crud.get_by_email(db, body.email)
    if not user or not verify_password(body.password, user.password_hash):
        raise UnauthorizedError()
    return _token_response(user)


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenResponse:
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise ValueError("Invalid token type")
        user_id = UUID(payload["sub"])
    except (ValueError, KeyError) as e:
        raise UnauthorizedError("Invalid refresh token") from e

    user = await user_crud.get_by_id(db, user_id)
    if not user:
        raise UnauthorizedError("User not found")
    return _token_response(user)


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User | None:
    return await user_crud.get_by_id(db, user_id)


def _token_response(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )
