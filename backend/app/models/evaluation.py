import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Any
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON

class EvaluationRun(SQLModel, table=True):
    __tablename__ = "evaluation_run"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    run_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    dataset_split: str
    encoder_name: str
    decoder_config: Any = Field(default={}, sa_column=Column(JSON))
    bleu_1: float
    bleu_2: float
    bleu_3: float
    bleu_4: float
    cider: float
    meteor: float
    num_images: int
    beam_width: int
    notes: Optional[str] = None

class EvaluationSample(SQLModel, table=True):
    __tablename__ = "evaluation_sample"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    evaluation_run_id: uuid.UUID = Field(foreign_key="evaluation_run.id", index=True)
    coco_image_id: int
    image_path: str
    ground_truth_captions: Any = Field(default=[], sa_column=Column(JSON))
    generated_caption: str
    bleu_4_individual: float
    attention_gif_path: Optional[str] = None
