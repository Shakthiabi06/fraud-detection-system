import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Whether to call the real Sentinel backend instead of reading mock data.
// Controlled by VITE_USE_LIVE_API in .env.local — flip there, not here.
export const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === "true";

// --- Raw calls, one per backend/app.py route ---

export const getTransactionsRaw = () => apiClient.get("/transactions");

export const getFraudSummaryRaw = () => apiClient.get("/fraud-summary");

export const predictFraudRaw = (payload) => apiClient.post("/predict", payload);

// --- Mapped calls: convert the real backend's response shape into the
// shape the frontend components already expect, so pages don't need to
// know about snake_case fields or percentage-vs-decimal differences. ---

// backend/app.py's get_transactions() currently returns only:
//   { transaction_id, fraud_score, prediction, risk_level }
// It does NOT yet return amount, country, or a timestamp, even though
// those are stored in the Transaction table (see backend/app.py's
// /predict handler, which saves amount and country on write).
// merchant is not stored anywhere on the backend at all — it was always a
// frontend-only/synthetic field in mock data, so it has no live equivalent.
//
// Until those 3 fields are added to the backend response, this mapping
// fills them with null so existing table columns don't crash — they will
// render blank for Amount/Origin/Timestamp on live data until the backend
// catches up. No frontend changes will be needed once it does; only the
// fallback values below need deleting.
export const getTransactions = async () => {
  const response = await getTransactionsRaw();
  return response.data.map((txn) => ({
    transaction_id: txn.transaction_id,
    fraud_score: txn.fraud_score,
    prediction: txn.prediction,
    risk_level: txn.risk_level,
    // Not yet returned by the backend — see note above.
    amount: txn.amount ?? null,
    country: txn.country ?? null,
    merchant: txn.merchant ?? null,
    timestamp: txn.created_at ?? null,
  }));
};

// backend/app.py's fraud_summary() returns:
//   { total_transactions, fraud_transactions, fraud_rate }
// where fraud_rate is already a percentage number (e.g. 12.5, not 0.125).
// The frontend's dashboardStats shape uses camelCase keys and a
// pre-formatted "12.5%" string for fraudRate, and also expects
// averageFraudScore, exposure, capitalAtRisk, blocked, leakage, and
// queueLatency — none of which the backend currently computes. Those
// remain null/placeholder until the backend exposes them (or until we
// decide they should be computed frontend-side from raw transactions
// instead of from this summary endpoint).
export const getFraudSummary = async () => {
  const response = await getFraudSummaryRaw();
  const data = response.data;
  return {
    totalTransactions: data.total_transactions,
    fraudTransactions: data.fraud_transactions,
    fraudRate: `${data.fraud_rate.toFixed(1)}%`,
    // Not yet provided by /fraud-summary — see note above.
    averageFraudScore: null,
    exposure: null,
    capitalAtRisk: null,
    blocked: null,
    leakage: null,
    queueLatency: null,
  };
};

// backend/app.py's /predict already returns exactly the shape the
// frontend expects (transaction_id, fraud_score, prediction, risk_level),
// so no field mapping is needed here — only the request payload needs to
// match TransactionRequest in backend/app.py: transaction_id, amount,
// time, country, V1-V28 (all required), plus optional merchant_category,
// customer_id, channel.
export const predictFraud = async (payload) => {
  const response = await predictFraudRaw(payload);
  return response.data;
};