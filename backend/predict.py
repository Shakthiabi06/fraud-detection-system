# Loads the trained Isolation Forest model and scores a single transaction.
#
# Input must only contain V1-V28, Amount, Time — same feature set used in train.py.
# Returns fraud_score (0-1 squashed anomaly score) + prediction (Fraud/Legitimate).
# Does NOT apply risk_rules.py adjustments — that happens downstream in app.py.

import os

import joblib
import numpy as np
import pandas as pd

from utils.preprocessing import MODEL_FEATURE_COLUMNS

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.pkl")
SCALER_AMOUNT_PATH = os.path.join(MODEL_DIR, "scaler_amount.pkl")
SCALER_TIME_PATH = os.path.join(MODEL_DIR, "scaler_time.pkl")

_MISSING_ARTIFACT_ERROR = (
    "Missing model/scaler artifact: {path}. Run `python backend/train.py` first."
)

for _path in (MODEL_PATH, SCALER_AMOUNT_PATH, SCALER_TIME_PATH):
    if not os.path.exists(_path):
        raise FileNotFoundError(_MISSING_ARTIFACT_ERROR.format(path=_path))

# Loaded once at import time — never reloaded per prediction request.
# joblib.load deserializes pickles; safe here because these files are produced
# locally by backend/train.py and backend/utils/preprocessing.py, not untrusted input.
model = joblib.load(MODEL_PATH)
scaler_amount = joblib.load(SCALER_AMOUNT_PATH)
scaler_time = joblib.load(SCALER_TIME_PATH)

V_COLUMNS = [f"V{i}" for i in range(1, 29)]


def predict_transaction(transaction: dict) -> dict:
    missing = [col for col in V_COLUMNS if col not in transaction]
    if missing:
        raise ValueError(f"Missing required fields: {missing}")

    # The model was trained on Kaggle's Time column.
    # The hour fallback is only a demo convenience and should not be treated as a real trained hour feature.
    time_value = transaction.get("time")
    if time_value is None:
        if "hour" in transaction:
            time_value = transaction["hour"] * 3600
        else:
            raise ValueError("Missing required field: time (or hour as a fallback)")

    amount_value = transaction.get("amount")
    if amount_value is None:
        raise ValueError("Missing required field: amount")

    amount_scaled = scaler_amount.transform(
        pd.DataFrame([[amount_value]], columns=["Amount"])
    )[0][0]
    time_scaled = scaler_time.transform(
        pd.DataFrame([[time_value]], columns=["Time"])
    )[0][0]

    row = {col: transaction[col] for col in V_COLUMNS}
    row["Amount_scaled"] = amount_scaled
    row["Time_scaled"] = time_scaled

    feature_df = pd.DataFrame([row])[MODEL_FEATURE_COLUMNS]

    # decision_function: more positive = more normal, more negative = more anomalous.
    raw_score = model.decision_function(feature_df)[0]
    fraud_score = 1 / (1 + np.exp(10 * raw_score))
    fraud_score = round(float(fraud_score), 4)

    prediction = "Fraud" if fraud_score > 0.5 else "Legitimate"

    return {
        "fraud_score": fraud_score,
        "prediction": prediction
    }


if __name__ == "__main__":
    sample_transaction = {
        "amount": 1200,
        "time": 36000,
        **{f"V{i}": 0.1 for i in range(1, 29)}
    }
    result = predict_transaction(sample_transaction)
    print("Smoke test prediction:", result)
