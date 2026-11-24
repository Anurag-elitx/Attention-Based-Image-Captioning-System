FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (psycopg2, git, gcc, etc.)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install CPU PyTorch first to keep the container lightweight (~1.2 GB instead of 5+ GB)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

COPY backend/requirements.txt ./backend_requirements.txt
COPY ml/requirements.txt ./ml_requirements.txt
RUN pip install --no-cache-dir -r backend_requirements.txt -r ml_requirements.txt

# Copy ML pipeline, Backend app, and utility scripts
COPY ml/ ./ml/
COPY backend/app/ ./app/
COPY scripts/ ./scripts/

# Create necessary directories
RUN mkdir -p data/outputs/uploads checkpoints

# Download model & seed DB on startup via entrypoint
COPY backend/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# HF Spaces uses port 7860 by default; Docker Compose uses 8000
EXPOSE 7860 8000
ENV PORT=7860
ENTRYPOINT ["./entrypoint.sh"]
