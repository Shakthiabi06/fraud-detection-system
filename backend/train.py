import os

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest

os.makedirs("model", exist_ok=True)

df = pd.read_csv("data/creditcard.csv")
X = df.drop("Class", axis=1)

model = IsolationForest(
    n_estimators=200,
    contamination=0.002,
    random_state=42,
)
model.fit(X)

joblib.dump(model, "model/isolation_forest.pkl")
print("Model Saved")
