#!/bin/bash

#!/bin/bash
set -euo pipefail

echo "🚀 Starting Render build process..."

# Install Python dependencies
echo "📦 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Always ensure the CSV exists for training. This avoids Render depending on
# a Git LFS-managed checkout for the large dataset artifact.
echo "🔍 Checking for dataset..."
if [ ! -f "data/creditcard.csv" ]; then
    echo "📥 Dataset not found, generating fallback dataset..."
    python download_data.py
fi

# Check if model exists, if not train it
echo "🔍 Checking for trained model..."
if [ ! -f "model/isolation_forest.pkl" ]; then
    echo "🤖 Training model..."
    python train.py
else
    echo "✅ Model already exists, skipping training"
fi

echo "✅ Build completed successfully!"