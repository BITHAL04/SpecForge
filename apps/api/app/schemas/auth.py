from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models import UserPlan


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ClerkAuthRequest(BaseModel):
    email: EmailStr
    clerk_id: str
    name: str



class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    plan: UserPlan
    created_at: datetime

    model_config = {"from_attributes": True}
