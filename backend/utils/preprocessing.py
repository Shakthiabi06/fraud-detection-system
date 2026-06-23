# Feature engineering applied before model training/inference.
#
# Operates only on the original anonymized Kaggle features (Time, V1-V28, Amount, Class).
# Synthetic/demo fields (country, merchant, etc.) are never touched here — they don't
# exist at this stage of the pipeline and must never reach the model.

import os

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "creditcard.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model")
SCALER_AMOUNT_PATH = os.path.join(MODEL_DIR, "scaler_amount.pkl")
SCALER_TIME_PATH = os.path.join(MODEL_DIR, "scaler_time.pkl")

# Exact feature order the Isolation Forest model must always see.
MODEL_FEATURE_COLUMNS = [
    "V1", "V2", "V3", "V4", "V5", "V6", "V7",
    "V8", "V9", "V10", "V11", "V12", "V13", "V14",
    "V15", "V16", "V17", "V18", "V19", "V20", "V21",
    "V22", "V23", "V24", "V25", "V26", "V27", "V28",
    "Amount_scaled", "Time_scaled"
]


def run_preprocessing():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            "Download the Kaggle Credit Card Fraud Detection dataset and place "
            "creditcard.csv at backend/data/creditcard.csv before continuing."
        )

    df = pd.read_csv(DATA_PATH)

    os.makedirs(MODEL_DIR, exist_ok=True)

    scaler_amount = StandardScaler()
    scaler_time = StandardScaler()

    # fit_transform only happens here, during preprocessing/training.
    # predict.py must only ever call .transform() on the saved scalers.
    df["Amount_scaled"] = scaler_amount.fit_transform(df[["Amount"]])
    df["Time_scaled"] = scaler_time.fit_transform(df[["Time"]])

    joblib.dump(scaler_amount, SCALER_AMOUNT_PATH)
    joblib.dump(scaler_time, SCALER_TIME_PATH)

    X = df[MODEL_FEATURE_COLUMNS]
    y = df["Class"]

    # y is used only for evaluation — never passed into IsolationForest.fit().
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    X_train, X_test, y_train, y_test = run_preprocessing()
    print("X_train shape:", X_train.shape)
    print("X_test shape:", X_test.shape)
    print("y_train fraud count:", int(y_train.sum()))
    print("y_test fraud count:", int(y_test.sum()))
    print("feature columns used:", MODEL_FEATURE_COLUMNS)
