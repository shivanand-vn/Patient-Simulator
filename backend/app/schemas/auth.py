from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: uuid.UUID
    role: str
    full_name: str
    institution_id: uuid.UUID

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: uuid.UUID
    institution_id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    preferred_language: str
    is_active: bool

    class Config:
        from_attributes = True
