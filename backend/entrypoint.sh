#!/bin/bash
set -e

# Download model from HuggingFace if not present and repo configured
if [ ! -f "checkpoints/decoder_best.pt" ] && [ -n "$HF_MODEL_REPO" ]; then
    echo "Downloading model from HuggingFace ($HF_MODEL_REPO)..."
    python scripts/download_model.py || echo "Warning: Model download failed, running in mock/local fallback mode"
fi

# Auto-seed database (creates tables, default admin, initial checkpoint metadata)
echo "Seeding database..."
python scripts/seed_db.py || echo "Warning: Database seed skipped or already applied"

# Start the FastAPI server
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
