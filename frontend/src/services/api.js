import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Flip VITE_USE_LIVE_API in frontend/.env.local to switch between mock
// and real backend. Default is false (mock) so the app always has
// something to show even when the backend isn't running.
export const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === "true";

// --- Raw axios calls, one per backend route ---

export const getTransactionsRaw = () => apiClient.get("/transactions");
export const getFraudSummaryRaw = () => apiClient.get("/fraud-summary");
export const predictFraudRaw = (payload) => apiClient.post("/predict", payload);

// --- Mapped calls ---
// Convert the real backend's response shape into the shape the frontend
// components already expect, so pages don't need to know about
// snake_case fields or backend-specific naming.

// GET /transactions returns (per row):
//   transaction_id, amount, country, fraud_score, prediction,
//   risk_level, alert_triggered, created_at
// merchant is not stored on the backend — it was always frontend-only
// mock/synthetic data. It will be null on live data.
export const getTransactions = async () => {
  const response = await getTransactionsRaw();
  return response.data.map((txn) => ({
    transaction_id: txn.transaction_id,
    amount: txn.amount ?? null,
    country: txn.country ?? null,
    merchant: null,
    fraud_score: txn.fraud_score,
    prediction: txn.prediction,
    risk_level: txn.risk_level,
    alert_triggered: txn.alert_triggered ?? false,
    timestamp: txn.created_at ?? null,
  }));
};

// GET /fraud-summary returns:
//   total_transactions, fraud_transactions, fraud_rate (already a %,
//   e.g. 12.5 not 0.125), average_fraud_score, total_amount_at_risk,
//   alert_count
// Maps to the dashboardStats shape the frontend KPI cards expect.
// Fields not provided by the backend (capitalAtRisk, blocked, leakage,
// queueLatency) remain null — KPI cards show "—" for these until the
// backend exposes them or we compute them frontend-side from transactions.
const formatMoney = (value) => {
  if (value === null || value === undefined) return null;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

export const getFraudSummary = async () => {
  const response = await getFraudSummaryRaw();
  const d = response.data;
  return {
    totalTransactions: d.total_transactions,
    fraudTransactions: d.fraud_transactions,
    fraudRate: `${d.fraud_rate.toFixed(1)}%`,
    averageFraudScore: d.average_fraud_score.toFixed(4),
    exposure: formatMoney(d.total_amount_at_risk),
    alertCount: d.alert_count,
    // Not yet provided by /fraud-summary:
    capitalAtRisk: null,
    blocked: null,
    leakage: null,
    queueLatency: null,
  };
};

// POST /predict — request must match TransactionRequest in backend/app.py:
//   transaction_id, amount, time, country, V1-V28 (all required)
//   merchant_category, customer_id, channel (optional)
// Response: { transaction_id, fraud_score, prediction, risk_level,
//             alert_triggered }
// No field mapping needed — response already matches frontend naming.
export const predictFraud = async (payload) => {
  const response = await predictFraudRaw(payload);
  return response.data;
};