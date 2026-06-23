# Trains an Isolation Forest model on the original anonymized Kaggle features only.
#
# Model input features are strictly limited to: Time, V1-V28, Amount.
# Do NOT add country, merchant, or any synthetic enrichment column as a model feature —
# those are metadata-only fields produced by enrich_synthetic.py for display purposes.

# TODO: load data/creditcard.csv
# TODO: select feature columns: ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
# TODO: apply utils/preprocessing.py feature engineering
# TODO: fit sklearn.ensemble.IsolationForest
# TODO: save trained model to model/isolation_forest.pkl via joblib
