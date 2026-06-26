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
- alert_triggered: boolean. True only when the final adjusted fraud_score is greater than 0.30.

alert_triggered is true when the final adjusted fraud_score is greater than 0.30.

alert_triggered is intended for dashboard notification UI. Real email, SMTP, Slack, or external notification delivery is out of scope for this step.

This threshold was empirically adjusted from an original placeholder of 0.85 after testing real fraud and legitimate rows from the actual dataset through the full pipeline. 0.85 was unreachable in practice for the trained model; 0.30 was chosen because it produced zero false positives in the sampled legitimate rows while still catching roughly 63% of sampled fraud cases.

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
  "fraud_rate": 1.0,
  "average_fraud_score": 0.23,
  "total_amount_at_risk": 45230.50,
  "alert_count": 12
}
```

- total_transactions: total number of transactions stored in the backend database.
- fraud_transactions: number of stored transactions where prediction is "Fraud".
- fraud_rate: fraud rate as a percentage, not a decimal ratio. Example: 1 fraud out of 4 total transactions returns 25.0.
- average_fraud_score: average fraud_score across ALL stored transactions (not just the most recent 100 returned by /transactions), rounded to 4 decimals.
- total_amount_at_risk: sum of transaction amounts where prediction is "Fraud", across ALL stored transactions, rounded to 2 decimals. This represents the sum of amounts flagged as fraud, not a true financial exposure model — a real exposure figure would require additional assumptions (chargeback rates, recovery odds, etc.) that this project does not make.
- alert_count: count of stored transactions where alert_triggered is true, across ALL stored transactions.

All three new fields are computed server-side as a single source of truth, rather than derived by the frontend from the capped /transactions list.

These fields return 0.0 / 0.0 / 0 respectively when there are no stored transactions, instead of null or an error.

## GET /health

Simple backend liveness check.

Example response:
```json
{
  "status": "ok"
}
```

- status: "ok" means the FastAPI app is running.
