import sys
import os

# Ensure backend directory is in sys.path so 'app' imports resolve regardless of cwd
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure project root is in sys.path so 'ml' imports resolve
project_root = os.path.dirname(backend_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.database import init_db
from app.config import settings
from app.routers import auth, system, caption, evaluation

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    # Lazy model loading: models are loaded on-demand in InferenceEngine
    # to keep startup memory well under the 512MB RAM limit on free hosting tiers
    yield
    # Shutdown
    # Resources will be cleared when process dies

app = FastAPI(
    title="Attention-Based Image Captioning API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(caption.router, prefix="/api/v1/caption", tags=["caption"])
app.include_router(evaluation.router, prefix="/api/v1/evaluate", tags=["evaluation"])
app.include_router(system.router, prefix="/api/v1", tags=["system"])

# Serve static output files (heatmaps, attention gifs, and uploaded user images)
os.makedirs(settings.STATIC_OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.STATIC_OUTPUT_DIR, "uploads"), exist_ok=True)
app.mount("/static/outputs", StaticFiles(directory=settings.STATIC_OUTPUT_DIR), name="static_outputs")

@app.get("/")
def root():
    return {"message": "Welcome to the Attention-Based Image Captioning API. See /docs for documentation."}
