from fastapi import APIRouter
try:
    import torch
    TORCH_AVAILABLE = True
except Exception:
    TORCH_AVAILABLE = False
from app.schemas.system import HealthResponse, GPUHealthResponse
from app.config import settings
from app.services.inference_engine import engine

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    decoder_loaded = engine.decoder is not None
    return {
        "encoder_name": "ResNet-101",
        "decoder_status": "Loaded" if decoder_loaded else "Not loaded",
        "vocab_size": engine.vocab_size if decoder_loaded else 0,
        "beam_width": engine.beam_width,
        "device": str(engine.device),
        "model_version": settings.MODEL_VERSION
    }

@router.get("/health/gpu", response_model=GPUHealthResponse)
async def check_gpu_health():
    """
    Check if the GPU is available and accessible by PyTorch.
    """
    if not TORCH_AVAILABLE:
        return {
            "status": "warning",
            "device": "cpu (torch disabled by WDAC policy)",
            "cuda_available": False,
            "gpu_name": "None",
            "memory_allocated_mb": 0,
            "memory_reserved_mb": 0
        }
        
    cuda_available = torch.cuda.is_available()
    device_name = torch.cuda.get_device_name(0) if cuda_available else None
    
    return {
        "device": settings.DEVICE,
        "cuda_available": cuda_available,
        "device_name": device_name
    }
