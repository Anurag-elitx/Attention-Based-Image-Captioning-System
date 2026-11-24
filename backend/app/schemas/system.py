from pydantic import BaseModel
from typing import Optional

class HealthResponse(BaseModel):
    encoder_name: Optional[str] = None
    decoder_status: Optional[str] = None
    vocab_size: Optional[int] = None
    beam_width: Optional[int] = None
    device: str
    model_version: str

class GPUHealthResponse(BaseModel):
    device: str
    cuda_available: bool
    device_name: Optional[str] = None
