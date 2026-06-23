# Architecture

## Data flow

```
Transaction -> FastAPI -> Isolation Forest -> DB -> Dashboard/Alerts
```

- The FastAPI backend (`backend/app.py`) receives transactions and calls `predict.py`
  to score them using a trained Isolation Forest model (`train.py`, `model/isolation_forest.pkl`).
- Only the original anonymized features (Time, V1-V28, Amount) are used by the model.
- Synthetic metadata (country, merchant), produced by `enrich_synthetic.py`, is joined
  in for display purposes only — never passed to the model.
- `risk_rules.py` applies rule-based adjustments on top of the ML `fraud_score`
  after prediction, using the synthetic metadata, to produce a final display risk level.
- Results are persisted to the `transactions` table (see `database/schema.sql`) and
  surfaced via `/transactions` and `/fraud-summary` to the frontend dashboard.

TODO: expand with deployment topology, sequence diagrams, and alerting flow as those are built.
