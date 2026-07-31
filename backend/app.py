from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import pandas as pd
import joblib
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ADD THIS LINE
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import pandas as pd
import joblib
import os

# Create FastAPI app
app = FastAPI(
    title="Fraud Detection API",
    description="Real-time credit card fraud detection",
    version="1.0.0"
)

# ADD THIS CORS MIDDLEWARE RIGHT HERE:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rest of your code...

# Import your prediction function
from predict import predict_transaction_with_score

# Create FastAPI app
app = FastAPI(
    title="Fraud Detection API",
    description="Real-time credit card fraud detection",
    version="1.0.0"
)

# 🔥 FIX 1: Add CORS middleware (this allows frontend to connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 FIX 2: Define Pydantic models for request/response
class TransactionRequest(BaseModel):
    """Transaction data for fraud prediction"""
    amount: float
    merchant: Optional[str] = None
    hour: int
    country: str
    # Optional fields for full features
    V1: Optional[float] = 0
    V2: Optional[float] = 0
    V3: Optional[float] = 0
    V4: Optional[float] = 0
    V5: Optional[float] = 0
    V6: Optional[float] = 0
    V7: Optional[float] = 0
    V8: Optional[float] = 0
    V9: Optional[float] = 0
    V10: Optional[float] = 0
    V11: Optional[float] = 0
    V12: Optional[float] = 0
    V13: Optional[float] = 0
    V14: Optional[float] = 0
    V15: Optional[float] = 0
    V16: Optional[float] = 0
    V17: Optional[float] = 0
    V18: Optional[float] = 0
    V19: Optional[float] = 0
    V20: Optional[float] = 0
    V21: Optional[float] = 0
    V22: Optional[float] = 0
    V23: Optional[float] = 0
    V24: Optional[float] = 0
    V25: Optional[float] = 0
    V26: Optional[float] = 0
    V27: Optional[float] = 0
    V28: Optional[float] = 0

class TransactionResponse(BaseModel):
    """Fraud prediction response"""
    transaction_id: Optional[str] = None
    fraud_score: float
    prediction: str  # "Fraud" or "Legit"
    risk_level: str  # "Critical", "High", "Medium", "Low"
    alert_triggered: bool

class TransactionsListResponse(BaseModel):
    """List of transactions"""
    transactions: List[dict]

class FraudSummaryResponse(BaseModel):
    """Fraud statistics summary"""
    total_transactions: int
    fraud_transactions: int
    fraud_rate: float
    average_fraud_score: float
    total_amount_at_risk: float
    alert_count: int

# 🔥 FIX 3: Add root endpoint
@app.get("/")
async def root():
    return {
        "message": "🚀 Fraud Detection API is running!",
        "docs": "/docs",
        "version": "1.0.0"
    }

# 🔥 FIX 4: Add health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

# 🔥 FIX 5: Add the main prediction endpoint
@app.post("/api/predict", response_model=TransactionResponse)
async def predict_fraud(transaction: TransactionRequest):
    """
    Predict if a single transaction is fraudulent
    
    Example request:
        {
            "amount": 15000.50,
            "merchant": "Amazon",
            "hour": 3,
            "country": "US"
        }
    """
    try:
        # Convert to dict
        data = transaction.dict()
        
        # Get prediction with score
        result = predict_transaction_with_score(data)
        
        # Determine risk level based on score
        fraud_score = result['fraud_score']
        if fraud_score > 0.8:
            risk_level = "Critical"
        elif fraud_score > 0.6:
            risk_level = "High"
        elif fraud_score > 0.4:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        return TransactionResponse(
            transaction_id=f"TXN-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            fraud_score=fraud_score,
            prediction=result['prediction'],
            risk_level=risk_level,
            alert_triggered=result['prediction'] == "Fraud"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# After your existing endpoints, add these:

@app.get("/api/fraud-summary")
async def get_fraud_summary():
    """
    Get fraud detection statistics summary
    """
    try:
        # For now, return mock data
        # Later you can query the database
        return {
            "total_transactions": 1250,
            "fraud_transactions": 42,
            "fraud_rate": 3.36,
            "average_fraud_score": 0.28,
            "total_amount_at_risk": 156000.50,
            "alert_count": 15
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transactions")
async def get_transactions(limit: int = 100):
    """
    Get recent transactions with fraud scores
    """
    try:
        # For now, return mock data
        # Later you can query the database
        import random
        
        transactions = []
        for i in range(20):
            amount = random.uniform(10, 50000)
            fraud_score = random.uniform(0, 1)
            
            transactions.append({
                "transaction_id": f"TXN-{i+1:04d}",
                "amount": round(amount, 2),
                "country": random.choice(['US', 'UK', 'CA', 'AU', 'DE']),
                "merchant": random.choice(['Amazon', 'Apple', 'Walmart', 'Target', 'Best Buy']),
                "fraud_score": round(fraud_score, 4),
                "prediction": "Fraud" if fraud_score > 0.7 else "Legit",
                "risk_level": "Critical" if fraud_score > 0.8 else "High" if fraud_score > 0.6 else "Medium" if fraud_score > 0.4 else "Low",
                "alert_triggered": fraud_score > 0.7,
                "created_at": datetime.now().isoformat()
            })
        
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))