import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getTransactions = () => apiClient.get("/transactions");

export const getFraudSummary = () => apiClient.get("/fraud-summary");

export const predictFraud = (payload) => apiClient.post("/predict", payload);

export const getModelMetrics = () => apiClient.get("/model-metrics");
