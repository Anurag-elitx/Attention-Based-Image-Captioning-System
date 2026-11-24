import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from typing import Any

class CaptionRecord(SQLModel, table=True):
    __tablename__ = "caption_record"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    image_path: Optional[str] = None
    image_filename: str
    caption_text: str
    confidence: float
    beam_width: int = Field(default=5)
    inference_time_ms: int
    device: str = Field(default="cpu")
    attention_overlay_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)

class AttentionData(SQLModel, table=True):
    __tablename__ = "attention_data"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    caption_record_id: uuid.UUID = Field(foreign_key="caption_record.id")
    word_index: int
    word_text: str
    alpha_weights: Any = Field(default={}, sa_column=Column(JSON))
    heatmap_path: Optional[str] = None
