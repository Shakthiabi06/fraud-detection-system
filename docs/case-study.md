# Case Study

TODO: write up the project narrative, motivation, and results.

## Disclosure

The public Kaggle "Credit Card Fraud Detection" dataset is fully anonymized and
contains only `Time`, `V1`-`V28` (PCA-transformed features), `Amount`, and `Class`.
It does not include any country, merchant, or other real-world transaction metadata.

For dashboard and demonstration purposes, this project generates **synthetic**
`country` and `merchant` fields (see `backend/enrich_synthetic.py`) that are appended
to the dataset purely for display and storytelling. These synthetic fields are **never**
used as inputs to the fraud detection model. Fraud scoring (`backend/train.py`,
`backend/predict.py`) relies exclusively on the original anonymized transaction
features (`Time`, `V1`-`V28`, `Amount`). Any "risk rules" that reference country or
merchant (see `backend/utils/risk_rules.py`) are a separate, clearly-labeled rule-based
layer applied after the ML model's prediction, and are not part of the model itself.

TODO: add results, metrics, and discussion once the model is trained.
