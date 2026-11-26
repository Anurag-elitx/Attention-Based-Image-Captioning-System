import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./data/captiondb.sqlite"
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DEVICE: str = "cpu"
    MODEL_VERSION: str = "v1.0.0"
    HF_MODEL_REPO: str = ""
    HF_TOKEN: str = ""
    CHECKPOINT_DIR: str = "checkpoints"
    STATIC_OUTPUT_DIR: str = "data/outputs"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    model_config = SettingsConfigDict(env_file=(".env", "../.env"), extra="ignore")

settings = Settings()
