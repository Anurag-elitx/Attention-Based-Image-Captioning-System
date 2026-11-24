import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from typing import Optional

class ModelCheckpoint(SQLModel, table=True):
    __tablename__ = "model_checkpoint"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    version: str
    encoder_path: str
    decoder_path: str
    word_map_path: str
    vocab_size: int
    embed_dim: int
    hidden_dim: int
    attention_dim: int
    beam_width_default: int
    best_bleu4: float
    epoch: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
