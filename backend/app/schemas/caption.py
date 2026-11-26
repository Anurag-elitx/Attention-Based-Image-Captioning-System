from pydantic import BaseModel
from typing import Dict, List, Optional
import uuid
from datetime import datetime


class AttentionWord(BaseModel):
    word: str
    alpha: List[float]  # 196 elements


class CaptionResponse(BaseModel):
    id: uuid.UUID
    caption_text: str
    title: Optional[str] = None
    language: str = "English (US)"
    tone: str = "Default"
    length: str = "Default"
    platform_captions: Optional[Dict[str, str]] = None
    confidence: float
    inference_time_ms: int
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    attention_data: Optional[List[AttentionWord]] = None
    attention_overlay_url: Optional[str] = None
