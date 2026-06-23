"""FastAPI app entrypoint.

Flow:

    Incoming transaction
          |
          v
    predict.py returns an ML fraud score using real model fields only
          |
          v
    risk_rules.py applies business risk adjustment using real + synthetic/demo fields
          |
          v
    app.py returns final fraud score, prediction, and risk level

See docs/API.md for the locked API contract (Step 3 extends this — see handoff notes).
"""

import sys
from pathlib import Path

# predict.py uses bare `from utils.preprocessing import ...`, which resolves
# relative to backend/. Adding backend/ to sys.path here lets this module be
# imported as `backend.app` (e.g. via `uvicorn backend.app:app`) from the repo
# root without modifying predict.py.
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict import predict_transaction
from utils.risk_rules import compute_final_risk

app = FastAPI(title="Credit Card Fraud Detection API")

# Permissive dev CORS config is okay for now.
# Tighten CORS before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is temporary in-memory/stub storage until PostgreSQL integration in a future step.
_TRANSACTIONS: list[dict] = []


class TransactionRequest(BaseModel):
    transaction_id: str
    amount: float
    time: float
    country: str
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    # Optional synthetic/demo fields — never passed into predict.py or the model.
    merchant_category: str | None = None
    customer_id: str | None = None
    channel: str | None = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(request: TransactionRequest):
    # Mandatory boundary: only amount, time, and V1-V28 reach predict.py.
    # transaction_id, country, merchant_category, customer_id, channel must
    # never enter the model-facing path.
    model_payload = {
        "amount": request.amount,
        "time": request.time,
        **{f"V{i}": getattr(request, f"V{i}") for i in range(1, 29)},
    }

    try:
        ml_result = predict_transaction(model_payload)
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    final_risk = compute_final_risk(
        ml_fraud_score=ml_result["fraud_score"],
        amount=request.amount,
        country=request.country,
        time_seconds=request.time,
    )

    response = {
        "transaction_id": request.transaction_id,
        "fraud_score": final_risk["final_score"],
        "prediction": final_risk["prediction"],
        "risk_level": final_risk["risk_level"],
    }

    _TRANSACTIONS.append(response)

    return response


@app.get("/transactions")
def get_transactions():
    # This is temporary in-memory/stub storage until PostgreSQL integration in a future step.
    if not _TRANSACTIONS:
        return [
            {
                "transaction_id": "TXN001",
                "fraud_score": 0.87,
                "prediction": "Fraud",
            }
        ]

    return [
        {
            "transaction_id": record["transaction_id"],
            "fraud_score": record["fraud_score"],
            "prediction": record["prediction"],
        }
        for record in _TRANSACTIONS
    ]


@app.get("/fraud-summary")
def fraud_summary():
    # This is temporary in-memory/stub analytics until PostgreSQL integration in a future step.
    if not _TRANSACTIONS:
        return {
            "total_transactions": 10000,
            "fraud_transactions": 100,
            "fraud_rate": 1.0,
        }

    total = len(_TRANSACTIONS)
    fraud_count = sum(1 for record in _TRANSACTIONS if record["prediction"] == "Fraud")
    fraud_rate = round((fraud_count / total) * 100, 4) if total else 0.0

    return {
        "total_transactions": total,
        "fraud_transactions": fraud_count,
        "fraud_rate": fraud_rate,
    }
