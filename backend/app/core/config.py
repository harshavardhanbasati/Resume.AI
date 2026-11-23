import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Absolute path to backend directory and .env file
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "ResumeAI"
    API_V1_STR: str = "/api"
    
    # Secrets loaded from .env
    SECRET_KEY: str = os.getenv("SECRET_KEY", "resumeai-default-dev-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    
    # PostgreSQL connection loaded from .env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres@localhost:5432/resumeai")
    
    # Document storage
    UPLOAD_DIR: str = str(BACKEND_DIR / "uploads")
    
    # Ollama / AI Settings
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")

    class Config:
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"
        extra = "allow"

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
