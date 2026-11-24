from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class EvaluationRunResponse(BaseModel):
    id: uuid.UUID
    triggered_by: uuid.UUID
    execution_time_s: int
    bleu_1: float
    bleu_2: float
    bleu_3: float
    bleu_4: float
    meteor: float
    cider: float
    created_at: datetime
