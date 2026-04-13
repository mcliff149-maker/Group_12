from __future__ import annotations

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    db_url: str = "sqlite:///./iles.db"

    # JWT
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # CORS – comma-separated list of allowed origins, or "*" to allow all (dev only)
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    # App
    app_name: str = "ILES API"
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
