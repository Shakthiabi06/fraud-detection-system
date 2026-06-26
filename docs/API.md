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
  "risk_level": "Critical",
  "alert_triggered": true
}
```

Response field contract:

- transaction_id: string transaction identifier.
- fraud_score: decimal from 0.00 to 1.00. This is the final adjusted fraud score returned by the backend.
- prediction: string. Either "Fraud" or "Legitimate".
- risk_level: string. One of "Low", "Medium", "High", or "Critical".
- alert_triggered: boolean. True only when the final adjusted fraud_score is greater than 0.85.

alert_triggered is intended for dashboard notification UI. Real email, SMTP, Slack, or external notification delivery is out of scope for this step.

## GET /transactions

Returns stored transactions from the live backend database.

Merchant/merchant_category is not currently returned by the live backend because it is not stored in the transactions table. It may remain frontend demo/mock data unless added in a future schema migration.

- TODO: query params (pagination, filters)

Example response:
```json
[
  {
    "transaction_id": "TXN001",
    "amount": 1200.0,
    "country": "IN",
    "fraud_score": 0.87,
    "prediction": "Fraud",
    "risk_level": "Critical",
    "alert_triggered": true,
    "created_at": "2026-06-26T11:25:00"
  }
]
```

created_at is returned as an ISO timestamp string and can be used by the frontend for sorting by recency.

## GET /fraud-summary

Returns aggregate fraud statistics for the dashboard.

Example response:
```json
{
  "total_transactions": 10000,
  "fraud_transactions": 100,
  "fraud_rate": 1.0
}
```

- total_transactions: total number of transactions stored in the backend database.
- fraud_transactions: number of stored transactions where prediction is "Fraud".
- fraud_rate: fraud rate as a percentage, not a decimal ratio. Example: 1 fraud out of 4 total transactions returns 25.0.

## GET /health

Simple backend liveness check.

Example response:
```json
{
  "status": "ok"
}
```

- status: "ok" means the FastAPI app is running.
