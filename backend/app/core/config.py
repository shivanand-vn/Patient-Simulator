from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Patient Simulation Engine API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://sim_admin:sim_secure_password_2026@localhost:5432/ai_patient_simulation"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10

    # JWT Authentication
    JWT_SECRET_KEY: str = "default_insecure_key_change_me_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours for medical lab sessions

    # CORS configuration for desktop and web
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173", # Vite dev
        "http://localhost:3000",
        "tauri://localhost",     # Tauri native desktop
        "https://tauri.localhost"
    ]

    # AI Configuration
    OPENAI_API_KEY: str = ""
    LLM_MODEL_NAME: str = "gpt-4o"
    LLM_TEMPERATURE: float = 0.3

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()
