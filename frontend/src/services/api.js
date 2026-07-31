import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Flip VITE_USE_LIVE_API in frontend/.env.local to switch between mock
// and real backend. Default is false (mock) so the app always has
// something to show even when the backend isn't running.
//export const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === "true";
export const USE_LIVE_API = true;

// --- Raw axios calls, one per backend route ---

// CHANGE THESE:
export const getTransactionsRaw = () => apiClient.get("/api/transactions");  // Added /api/
export const getFraudSummaryRaw = () => apiClient.get("/api/fraud-summary"); // Added /api/
export const predictFraudRaw = (payload) => apiClient.post("/api/predict", payload); // Added /api/
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
  try {
    const response = await getTransactionsRaw();
    console.log("🔴 TRANSACTIONS RESPONSE:", response.data);
    console.log("🔴 FIRST TRANSACTION:", response.data[0]); // ← ADD THIS
    
    const transactions = Array.isArray(response.data) ? response.data : [];
    console.log("🔴 MAPPED TRANSACTIONS:", transactions); // ← ADD THIS
    
    return transactions.map((txn) => ({
      transaction_id: txn.transaction_id || `TXN-${Math.random().toString(36).substr(2, 6)}`,
      amount: txn.amount ?? null,
      country: txn.country ?? null,
      merchant: txn.merchant || 'Unknown',
      fraud_score: txn.fraud_score ?? 0,
      prediction: txn.prediction || 'Legit',
      risk_level: txn.risk_level || 'Low',
      alert_triggered: txn.alert_triggered ?? false,
      timestamp: txn.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
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
  console.log("🔴 FETCHING FROM LIVE BACKEND...");
  try {
    const response = await getFraudSummaryRaw();
    console.log("🔴 BACKEND RESPONSE:", response.data);
    const d = response.data;
    
    // 🔥 FIX: Map backend fields to what Dashboard expects
    return {
      totalTransactions: d.total_transactions || 0,
      fraudTransactions: d.fraud_transactions || 0,
      fraudRate: d.fraud_rate ? `${d.fraud_rate.toFixed(1)}%` : "0%",
      averageFraudScore: d.average_fraud_score ? d.average_fraud_score.toFixed(4) : "0",
      exposure: d.total_amount_at_risk ? `$${(d.total_amount_at_risk / 1000).toFixed(1)}K` : "—",
      alertCount: d.alert_count || 0,
      // These fields don't exist in backend yet - keep as null
      capitalAtRisk: d.total_amount_at_risk ? `$${(d.total_amount_at_risk / 1000).toFixed(1)}K` : "—",
      blocked: null,
      leakage: null,
      queueLatency: null,
    };
  } catch (error) {
    console.error("Error fetching fraud summary:", error);
    // Return default values if backend fails
    return {
      totalTransactions: 0,
      fraudTransactions: 0,
      fraudRate: "0%",
      averageFraudScore: "0",
      exposure: "—",
      alertCount: 0,
      capitalAtRisk: "—",
      blocked: null,
      leakage: null,
      queueLatency: null,
    };
  }
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