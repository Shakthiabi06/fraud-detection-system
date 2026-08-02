import os
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.datasets import make_classification

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "creditcard.csv"


def download_dataset():
    """Ensure the training dataset exists for Render builds.

    Render does not reliably surface a Git LFS-managed CSV checkout in build
    environments, so this fallback generates a deterministic synthetic dataset
    when the real artifact is not present. That keeps the deployment path
    self-contained and removes the LFS dependency from the build pipeline.
    """

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if DATA_FILE.exists():
        print(f"✅ Dataset already exists at {DATA_FILE}")
        return True

    print("📥 Dataset not present in the repo checkout. Generating a deterministic fallback CSV for build-time training...")

    rng = np.random.default_rng(42)
    features, labels = make_classification(
        n_samples=1200,
        n_features=29,
        n_informative=12,
        n_redundant=5,
        n_clusters_per_class=2,
        weights=[0.998, 0.002],
        flip_y=0.01,
        class_sep=0.9,
        random_state=42,
    )

    frame = pd.DataFrame(features, columns=[f"V{index}" for index in range(1, 30)])
    frame.insert(0, "Time", np.arange(len(frame), dtype="int64"))
    frame.insert(30, "Amount", np.round(np.abs(rng.normal(loc=75, scale=120, size=len(frame))), 2))
    frame["Class"] = labels

    frame.to_csv(DATA_FILE, index=False)
    print(f"✅ Generated fallback dataset at {DATA_FILE}")
    return True


if __name__ == "__main__":
    download_dataset()