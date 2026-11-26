import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Index

class User(SQLModel, table=True):
    __tablename__ = "user"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str
    hashed_password: str
    role: str = Field(default="user") # 'admin' | 'user'
    credits: int = Field(default=10)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
