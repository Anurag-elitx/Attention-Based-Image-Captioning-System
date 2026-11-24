from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

class AttentionWord(BaseModel):
    word: str
    alpha: List[float] # 196 elements

class CaptionResponse(BaseModel):
    id: uuid.UUID
    caption_text: str
    confidence: float
    inference_time_ms: int
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    attention_data: Optional[List[AttentionWord]] = None
    attention_overlay_url: Optional[str] = None
