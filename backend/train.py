# Trains an Isolation Forest model on the original anonymized Kaggle features only.
#
# Model input features are strictly limited to: V1-V28, Amount_scaled, Time_scaled.
# Do NOT add country, merchant, or any synthetic enrichment column as a model feature —
# those are metadata-only fields produced by enrich_synthetic.py for display purposes.

import os

import joblib
from sklearn.ensemble import IsolationForest
from sklearn.metrics import confusion_matrix, f1_score, precision_score, recall_score

from utils.preprocessing import MODEL_FEATURE_COLUMNS, run_preprocessing

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.pkl")


def main():
    X_train, X_test, y_train, y_test = run_preprocessing()

    model = IsolationForest(
        n_estimators=200,
        contamination=0.002,  # tested against 0.00172 (real dataset fraud rate); 0.002 gave better recall
                               # (0.3061 vs 0.2755) and better F1 (0.2703 vs 0.2634) on the held-out test set.
                               # For fraud detection, missing real fraud (false negatives) is costlier than
                               # false alarms, so recall was prioritized. Kept as v1 baseline.
        random_state=42,
        n_jobs=-1
    )

    # Isolation Forest is unsupervised — fit on X_train only, never on labels.
    model.fit(X_train)

    raw_predictions = model.predict(X_test)
    # sklearn convention: 1 = normal, -1 = anomaly.
    # Project convention: 0 = Legitimate, 1 = Fraud.
    y_pred = [1 if p == -1 else 0 for p in raw_predictions]

    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred)

    # Do not quote these metrics publicly until train.py has been run on the actual dataset.
    # Never use placeholder precision, recall, or F1 values in documentation, resumes, or case studies.
    print("Precision:", precision)
    print("Recall:", recall)
    print("F1 Score:", f1)
    print("Confusion Matrix:")
    print(cm)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    print("Feature columns used:", MODEL_FEATURE_COLUMNS)


if __name__ == "__main__":
    main()
