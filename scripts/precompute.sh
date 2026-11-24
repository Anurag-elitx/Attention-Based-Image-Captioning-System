#!/bin/bash
# Precompute features wrapper script

# Navigate to project root
cd "$(dirname "$0")/.."

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    source .venv/bin/activate || source .venv/Scripts/activate
fi

echo "Starting ResNet-101 feature precomputation..."
python ml/precompute_features.py --batch_size 64
echo "Done!"
