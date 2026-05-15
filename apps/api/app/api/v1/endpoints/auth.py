from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas import (
    ClerkAuthRequest,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=TokenResponse, summary="Register a new account")
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.register_user(db, body)


@router.post("/login", response_model=TokenResponse, summary="Login and receive JWT tokens")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.login_user(db, body)


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.refresh_tokens(db, body.refresh_token)


@router.get("/me", response_model=UserResponse, summary="Get current user profile")
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/clerk", response_model=TokenResponse, summary="Authenticate via Clerk")
async def clerk_auth(body: ClerkAuthRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.authenticate_clerk(db, body)

