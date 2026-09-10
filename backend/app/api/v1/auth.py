from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.tenant import User, Institution
from app.schemas.auth import LoginRequest, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == credentials.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # For development demo simplicity, allow testing if password matches or matches default dev pwd
    is_valid = verify_password(credentials.password, user.password_hash) or (credentials.password == "student123")
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(
        subject=str(user.user_id),
        institution_id=str(user.institution_id)
    )

    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user.user_id,
        role=user.role.value,
        full_name=user.full_name,
        institution_id=user.institution_id
    )
