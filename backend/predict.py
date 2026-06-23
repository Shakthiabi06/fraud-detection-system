# Loads the trained Isolation Forest model and scores a single transaction.
#
# Input must only contain Time, V1-V28, Amount — same feature set used in train.py.
# Returns fraud_score (model anomaly score) + prediction (binary fraud flag).
# Does NOT apply risk_rules.py adjustments — that happens downstream in app.py.

# TODO: load model/isolation_forest.pkl via joblib
# TODO: accept a transaction dict/record with Time, V1-V28, Amount
# TODO: apply same preprocessing as train.py via utils/preprocessing.py
# TODO: return {"fraud_score": float, "prediction": int}
