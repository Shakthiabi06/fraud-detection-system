#!/bin/bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$BASE_DIR"

echo "🚀 Starting Render build process..."

echo "📦 Installing Python packages..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo "🔍 Checking for shipped model artifact..."
if [ -f "model/isolation_forest.pkl" ]; then
    echo "✅ Model already in repo, skipping training"
else
    echo "📥 Model missing from repo checkout, generating fallback dataset and training it"
    python download_data.py
    python train.py
fi

echo "✅ Build completed successfully!"