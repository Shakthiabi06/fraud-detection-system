import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "creditcard.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_FILE = MODEL_DIR / "isolation_forest.pkl"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(DATA_FILE)
X = df.drop("Class", axis=1)

model = IsolationForest(
    n_estimators=200,
    contamination=0.002,
    random_state=42,
)
model.fit(X)

joblib.dump(model, MODEL_FILE)
print("Model Saved")
