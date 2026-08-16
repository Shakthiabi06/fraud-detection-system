import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === "true";

export const getTransactionsRaw = () => apiClient.get("/transactions");
export const getFraudSummaryRaw = () => apiClient.get("/fraud-summary");
export const predictFraudRaw = (payload) => apiClient.post("/predict", payload);

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
    capitalAtRisk: null,
    blocked: null,
    leakage: null,
    queueLatency: null,
  };
};

export const predictFraud = async (payload) => {
  const response = await predictFraudRaw(payload);
  return response.data;
};