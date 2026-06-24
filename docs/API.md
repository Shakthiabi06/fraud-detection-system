# API Contract (Locked)

This document describes the locked API contract for the fraud detection backend.
Do not change these route signatures without updating this doc first.

## POST /predict

Scores a single transaction.

- TODO: request body schema (Time, V1-V28, Amount)

Example response:
```json
{
  "transaction_id": "TXN001",
  "fraud_score": 0.87,
  "prediction": "Fraud",
  "risk_level": "Critical"
}
```

## GET /transactions

Returns stored transactions, joined with synthetic metadata (country, merchant) for display.

- TODO: query params (pagination, filters)

Example response:
```json
[
  {
    "transaction_id": "TXN001",
    "fraud_score": 0.87,
    "prediction": "Fraud",
    "risk_level": "Critical"
  }
]
```

## GET /fraud-summary

Returns aggregate fraud statistics for the dashboard.

- TODO: response schema (counts, rates, breakdowns)
